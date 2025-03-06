import { NextResponse } from "next/server";
import { saveQuizData } from "@/lib/google-sheets";

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();
    
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    await saveQuizData(name, email);
    return NextResponse.json({ message: "Quiz submitted" });

  } catch (error: unknown) {
    console.error("Submission Error Details:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { 
        error: "Failed to submit quiz",
        details: errorMessage,
        sheetId: process.env.GOOGLE_SHEET_ID,
        serviceAccount: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
      },
      { status: 500 }
    );
  }
}