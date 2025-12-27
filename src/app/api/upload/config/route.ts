import { NextResponse } from "next/server";

export async function GET() {
  const hasApiKey = Boolean(process.env.IMGBB_API_KEY);

  return NextResponse.json({ shareableEnabled: hasApiKey });
}
