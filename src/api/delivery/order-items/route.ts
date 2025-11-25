import { NextResponse } from "next/server";
import pool from "@/lib/db";

/**
 * GET /api/delivery/order-items?order_id=xxx
 * Get order items for a specific order
 */
export async function GET(req: Request) {
  try {
    // Check database connection
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { message: "Database connection not configured. Please set DATABASE_URL environment variable." },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      return NextResponse.json(
        { message: "order_id query parameter is required" },
        { status: 400 }
      );
    }

    console.log(`Fetching order items for order_id: ${orderId}`);

    // Get order items
    const result = await pool.query(
      `SELECT 
        si.id,
        si.quantity,
        si.price,
        si.total,
        p.id as product_id,
        p.name as product_name,
        p.base_unit as unit
       FROM sale_items si
       JOIN products p ON p.id = si."productId"
       WHERE si."saleId" = $1
       ORDER BY si.id`,
      [orderId]
    );

    console.log(`Found ${result.rows.length} items for order ${orderId}`);

    if (result.rows.length === 0) {
      // Check if order exists at all
      const orderCheck = await pool.query(
        `SELECT id FROM sales WHERE id = $1`,
        [orderId]
      );

      if (orderCheck.rows.length === 0) {
        return NextResponse.json(
          { message: `Order ${orderId} not found in database` },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: `Order ${orderId} found but has no items` },
        { status: 404 }
      );
    }

    // Get delivery information
    const deliveryResult = await pool.query(
      `SELECT recipient_name, recipient_phone, recipient_email, delivery_address, status
       FROM sale_deliveries
       WHERE "saleId" = $1
       LIMIT 1`,
      [orderId]
    );

    const items = result.rows.map((row) => ({
      id: row.id,
      product_id: row.product_id,
      name: row.product_name,
      quantity: row.quantity,
      price: parseFloat(row.price),
      unit: row.unit || 'pcs',
    }));

    return NextResponse.json(
      {
        order_id: orderId,
        items: items,
        delivery: deliveryResult.rows[0] || null,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get order items error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
    });
    
    return NextResponse.json(
      { 
        message: "Failed to get order items", 
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? {
          code: error.code,
          detail: error.detail,
          hint: error.hint,
        } : undefined,
      },
      { status: 500 }
    );
  }
}

