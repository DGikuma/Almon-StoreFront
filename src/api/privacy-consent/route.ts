import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { choice } = await req.json();

    if (!choice || (choice !== "accept" && choice !== "decline")) {
      return NextResponse.json(
        { message: "Invalid choice. Must be 'accept' or 'decline'" },
        { status: 400 }
      );
    }

    // TODO: Save preference to database
    // Example implementation:
    // await saveMarketingPreference({
    //   customerId: customerId || email || phone,
    //   marketingConsent: choice === "accept",
    //   timestamp: new Date(),
    //   ipAddress: req.headers.get("x-forwarded-for") || "unknown"
    // });

    // For now, just return success
    // In production, you should:
    // 1. Save to database (customers table or preferences table)
    // 2. Log the consent for compliance
    // 3. Update email marketing service (if applicable)
    // 4. Send confirmation email

    return NextResponse.json({
      success: true,
      message: `Marketing preference saved: ${choice === "accept" ? "accepted" : "declined"}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Privacy consent error:", error);
    return NextResponse.json(
      { message: "Failed to save preference", error: error.message },
      { status: 500 }
    );
  }
}

