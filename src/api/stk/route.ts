import { NextResponse } from "next/server";
import axios from "axios";

/**
 * 🔐 Required Environment Variables (in your .env.local file)
 * 
 * SAFARICOM_CONSUMER_KEY=your_consumer_key
 * SAFARICOM_CONSUMER_SECRET=your_consumer_secret
 * MPESA_SHORTCODE=174379
 * MPESA_PASSKEY=your_lnm_passkey
 * CALLBACK_URL=https://yourdomain.com/api/stk/callback
 */

export async function POST(req: Request) {
  try {
    const { phone, amount } = await req.json();

    if (!phone || !amount) {
      return NextResponse.json({ message: "Phone and amount are required." }, { status: 400 });
    }

    // ✅ Format phone number (ensure it starts with 254)
    const formattedPhone = phone.startsWith("254")
      ? phone
      : phone.replace(/^0/, "254");

    // 1️⃣ Generate access token
    const tokenResponse = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        auth: {
          username: process.env.SAFARICOM_CONSUMER_KEY!,
          password: process.env.SAFARICOM_CONSUMER_SECRET!,
        },
      }
    );
    const accessToken = tokenResponse.data.access_token;

    // 2️⃣ Generate timestamp and password
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14);
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    // 3️⃣ STK Push request
    const stkRequest = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: formattedPhone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: process.env.CALLBACK_URL,
      AccountReference: "ALMON-STORE",
      TransactionDesc: "Purchase from Almon Storefront",
    };

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      stkRequest,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({
      message: "STK Push initiated successfully. Check your phone.",
      response: response.data,
    });
  } catch (error: any) {
    console.error("STK Error:", error.response?.data || error.message);
    return NextResponse.json(
      { message: "Failed to initiate STK Push", error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
