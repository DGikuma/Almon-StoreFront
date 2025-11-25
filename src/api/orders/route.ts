import { NextResponse } from "next/server";
import { saveOrder, type OrderData } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const orderData = await req.json();

    // Validate required fields
    if (!orderData.store_id) {
      return NextResponse.json(
        { message: "store_id is required" },
        { status: 400 }
      );
    }

    if (!orderData.products || !Array.isArray(orderData.products) || orderData.products.length === 0) {
      return NextResponse.json(
        { message: "products array is required and must not be empty" },
        { status: 400 }
      );
    }

    if (!orderData.delivery) {
      return NextResponse.json(
        { message: "delivery information is required" },
        { status: 400 }
      );
    }

    if (!orderData.delivery.recipient_name || !orderData.delivery.recipient_phone || !orderData.delivery.delivery_address) {
      return NextResponse.json(
        { message: "recipient_name, recipient_phone, and delivery_address are required" },
        { status: 400 }
      );
    }

    if (!orderData.customer_name || !orderData.phone_number) {
      return NextResponse.json(
        { message: "customer_name and phone_number are required" },
        { status: 400 }
      );
    }

    if (!orderData.payment_method) {
      return NextResponse.json(
        { message: "payment_method is required" },
        { status: 400 }
      );
    }

    // Calculate delivery fee (you may want to pass this from frontend)
    const deliveryFee = orderData.delivery_fee || 0;

    // Prepare order data for database
    const dbOrderData: OrderData = {
      store_id: orderData.store_id,
      customer_name: orderData.customer_name,
      phone_number: orderData.phone_number,
      payment_method: orderData.payment_method,
      recipient_name: orderData.delivery.recipient_name,
      recipient_phone: orderData.delivery.recipient_phone,
      recipient_email: orderData.delivery.recipient_email,
      delivery_address: orderData.delivery.delivery_address,
      delivery_fee: deliveryFee,
      products: orderData.products.map((p: any) => ({
        product_id: p.product_id,
        quantity: p.quantity,
        unit: p.unit,
        price: p.price, // Optional: if provided, will use it; otherwise fetches from DB
      })),
    };

    // Save order to database
    const savedOrder = await saveOrder(dbOrderData);

    return NextResponse.json(
      {
        message: "Order submitted successfully",
        sale_id: savedOrder.sale_id,
        order_id: savedOrder.id,
        order: {
          ...orderData,
          id: savedOrder.id,
          sale_id: savedOrder.sale_id,
          status: savedOrder.status,
          created_at: savedOrder.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Order submission error:", error);
    return NextResponse.json(
      { message: "Failed to submit order", error: error.message },
      { status: 500 }
    );
  }
}

