import { NextResponse } from "next/server";
import pool from "@/lib/db";

/**
 * POST /api/delivery/verify-otp
 * Verify OTP and complete delivery
 */
export async function POST(req: Request) {
  try {
    const { order_id, otp, delivered_items } = await req.json();

    if (!order_id || !otp) {
      return NextResponse.json(
        { message: "order_id and otp are required" },
        { status: 400 }
      );
    }

    if (!delivered_items || !Array.isArray(delivered_items) || delivered_items.length === 0) {
      return NextResponse.json(
        { message: "delivered_items array is required and must not be empty" },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Get delivery information
      const deliveryResult = await client.query(
        `SELECT sd.id, sd.otp, sd.otp_expires_at, sd.otp_verified, sd."saleId"
         FROM sale_deliveries sd
         JOIN sales s ON s.id = sd."saleId"
         WHERE s.id = $1 OR sd."saleId" = $1
         LIMIT 1`,
        [order_id]
      );

      if (deliveryResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { message: "Order not found" },
          { status: 404 }
        );
      }

      const delivery = deliveryResult.rows[0];

      // Check if OTP is already verified
      if (delivery.otp_verified) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { message: "Delivery already completed" },
          { status: 400 }
        );
      }

      // Check if OTP exists
      if (!delivery.otp) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { message: "OTP not generated. Please generate OTP first." },
          { status: 400 }
        );
      }

      // Check if OTP is expired
      const expiresAt = new Date(delivery.otp_expires_at);
      if (expiresAt < new Date()) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { message: "OTP has expired. Please generate a new OTP." },
          { status: 400 }
        );
      }

      // Verify OTP
      if (delivery.otp !== otp) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { message: "Invalid OTP" },
          { status: 400 }
        );
      }

      // Update delivery status
      await client.query(
        `UPDATE sale_deliveries 
         SET otp_verified = true, 
             status = 'delivered',
             delivery_date = NOW(),
             updated_at = NOW()
         WHERE id = $1`,
        [delivery.id]
      );

      // Update sale status
      await client.query(
        `UPDATE sales 
         SET status = 'completed', updated_at = NOW()
         WHERE id = $1`,
        [delivery.saleId]
      );

      // Create delivered_items records
      for (const item of delivered_items) {
        await client.query(
          `INSERT INTO delivered_items (quantity, price, total, "deliveryId", "productId")
           VALUES ($1, $2, $3, $4, $5)`,
          [
            item.quantity,
            item.price,
            item.price * item.quantity,
            delivery.id,
            item.product_id,
          ]
        );
      }

      await client.query('COMMIT');

      return NextResponse.json(
        {
          message: "Delivery completed successfully",
          delivery_id: delivery.id,
          sale_id: delivery.saleId,
        },
        { status: 200 }
      );
    } catch (error: any) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { message: "Failed to verify OTP", error: error.message },
      { status: 500 }
    );
  }
}

