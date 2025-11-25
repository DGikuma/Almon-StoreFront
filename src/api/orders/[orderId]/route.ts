import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/lib/db";

/**
 * GET /api/orders/[orderId]
 * Retrieve a specific order by ID
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;

    // Get order from database
    const order = await getOrderById(orderId);
    
    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        id: order.id,
        sale_id: order.sale_id,
        store_id: order.store_id,
        customer_name: order.customer_name,
        phone_number: order.phone_number,
        payment_method: order.payment_method,
        recipient_name: order.recipient_name,
        recipient_phone: order.recipient_phone,
        recipient_email: order.recipient_email,
        delivery_address: order.delivery_address,
        status: order.status,
        created_at: order.created_at,
        updated_at: order.updated_at,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Order retrieval error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

