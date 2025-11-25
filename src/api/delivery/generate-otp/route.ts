import { NextResponse } from "next/server";
import pool from "@/lib/db";

/**
 * POST /api/delivery/generate-otp
 * Generate OTP for delivery completion
 */
export async function POST(req: Request) {
  try {
    const { order_id, delivered_items } = await req.json();

    if (!order_id) {
      return NextResponse.json(
        { message: "order_id is required" },
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

      // Get delivery information and phone number
      const deliveryResult = await client.query(
        `SELECT sd.id, sd.recipient_phone, sd."saleId"
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
      const phoneNumber = delivery.recipient_phone;

      if (!phoneNumber) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { message: "Phone number not found for this order" },
          { status: 400 }
        );
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

      // Update delivery record with OTP
      await client.query(
        `UPDATE sale_deliveries 
         SET otp = $1, otp_expires_at = $2, otp_verified = false, updated_at = NOW()
         WHERE id = $3`,
        [otp, expiresAt, delivery.id]
      );

      // TODO: Send OTP via SMS (integrate with SMS service like Twilio, Africa's Talking, etc.)
      // For now, we'll return it in the response (remove this in production!)
      console.log(`OTP for order ${order_id}: ${otp} (sent to ${phoneNumber})`);

      await client.query('COMMIT');

      return NextResponse.json(
        {
          message: "OTP generated successfully",
          // Remove otp from response in production - only for testing
          otp: process.env.NODE_ENV === 'development' ? otp : undefined,
          expires_at: expiresAt.toISOString(),
          phone_number: phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1***$3'), // Mask phone number
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
    console.error("OTP generation error:", error);
    return NextResponse.json(
      { message: "Failed to generate OTP", error: error.message },
      { status: 500 }
    );
  }
}

