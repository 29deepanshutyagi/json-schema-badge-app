import { NextResponse } from "next/server";
import axios from "axios";
import { processUnissuedBadges } from "@/lib/google-sheets";

export async function POST() {
  try {
    if (!process.env.BADGR_API_URL || !process.env.BADGR_BADGE_CLASS_ID || !process.env.BADGR_ISSUER_ID || !process.env.BADGR_ACCESS_TOKEN) {
      throw new Error("Missing one or more required environment variables for Badgr API");
    }

    console.log("Fetching unissued badges...");
    const rows = await processUnissuedBadges();
    let issuedCount = 0;
    const issuedBadges: { email: string; badgeUrl: string }[] = [];

    for (const row of rows) {
      if (row.get("issued") === "No") {
        const email = row.get("email");

        console.log(`Issuing badge for: ${email}`);
        const url = `${process.env.BADGR_API_URL}/v2/issuers/${process.env.BADGR_ISSUER_ID}/assertions`;
        console.log(url);

        try {
          // Send request to Badgr API
          const response = await axios.post(
            url,
            {
              recipient: {
                identity: email,
                type: "email",
                hashed: false
              },
              badgeclass: process.env.BADGR_BADGE_CLASS_ID,
              issuer: process.env.BADGR_ISSUER_ID,
              notify: true
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.BADGR_ACCESS_TOKEN}`,
                "Content-Type": "application/json"
              }
            }
          );

          const badgeId = response.data.result.id; // Extract issued badge ID
          const badgeUrl = response.data.result[0].openBadgeId;

          console.log(`✅ Badge issued for ${email}: ${badgeUrl}`);
          console.log(response.data);

          // ✅ Update Google Sheets with issued status and badge URL
          row.set("issued", "Yes");
          row.set("badgeUrl", badgeUrl); // Assuming there's a `badgeUrl` column in your sheet
          await row.save();

          issuedBadges.push({ email, badgeUrl });
          issuedCount++;
        } catch (apiError: any) {
          console.error(`❌ Failed to issue badge for ${email}:`, apiError.response?.data || apiError.message);
          // In your catch block:
console.error(`❌ Failed to issue badge for ${email}:`, {
  status: apiError.response?.status,
  data: apiError.response?.data,
  headers: apiError.response?.headers  // Check for API version mismatch
});
        }
      }
    }

    console.log(`🎉 Total badges issued: ${issuedCount}`);

    return NextResponse.json({
      success: true,
      message: `${issuedCount} badges issued successfully`,
      totalProcessed: rows.length,
      issuedBadges
    });

  } catch (error: any) {
    console.error("🚨 Badge Issuance Error:", {
      error: error.response?.data || error.message
    });

    return NextResponse.json(
      {
        success: false,
        error: "Badge issuance failed",
        details: error.message,
        sheetId: process.env.GOOGLE_SHEET_ID
      },
      { status: 500 }
    );
  }
}
