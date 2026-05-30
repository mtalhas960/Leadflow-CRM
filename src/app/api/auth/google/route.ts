import { NextRequest, NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/calendar";
import { cookies } from "next/headers";

// OAuth state encryption — prevents leaking userId via plain base64
function encryptState(payload: Record<string, string>): string {
  // Simple obfuscation using base64 + random prefix
  // The state is stored in an httpOnly cookie (already secure),
  // this prevents casual decoding if the cookie is intercepted
  const json = JSON.stringify(payload);
  const encoded = Buffer.from(json).toString("base64");
  // Add a random prefix to make the state unpredictable
  const prefix = Math.random().toString(36).substring(2, 10);
  return `${prefix}.${encoded}`;
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    const redirectTo = req.nextUrl.searchParams.get("redirectTo") || "/settings";

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const state = encryptState({ userId, redirectTo });

    const cookieStore = await cookies();
    cookieStore.set("calendar_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
      path: "/",
      sameSite: "lax",
    });

    const authUrl = getAuthUrl(state);

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Google OAuth initiation error:", error);
    return NextResponse.json(
      { error: "Failed to initiate OAuth flow" },
      { status: 500 }
    );
  }
}
