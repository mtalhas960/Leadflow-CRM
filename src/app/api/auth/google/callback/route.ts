import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { exchangeCodeForTokens, saveCalendarTokens } from "@/lib/calendar";
import { getAdminDb } from "@/lib/firebase/admin";
import { cookies } from "next/headers";

function decryptState(state: string): { userId: string; redirectTo: string } | null {
  try {
    // Format: prefix.base64encoded (added by the initiate route)
    const dotIndex = state.indexOf(".");
    if (dotIndex === -1) return null;
    const encoded = state.substring(dotIndex + 1);
    const decoded = JSON.parse(Buffer.from(encoded, "base64").toString());
    if (!decoded.userId) return null;
    return { userId: decoded.userId, redirectTo: decoded.redirectTo || "/settings" };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");
    const state = req.nextUrl.searchParams.get("state");
    const error = req.nextUrl.searchParams.get("error");

    if (error) {
      return NextResponse.redirect(
        new URL("/settings?calendar_error=access_denied", req.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/settings?calendar_error=invalid_request", req.url)
      );
    }

    const cookieStore = await cookies();
    const storedState = cookieStore.get("calendar_oauth_state");

    if (!storedState || storedState.value !== state) {
      return NextResponse.redirect(
        new URL("/settings?calendar_error=invalid_state", req.url)
      );
    }

    cookieStore.delete("calendar_oauth_state");

    const parsed = decryptState(state);
    if (!parsed) {
      return NextResponse.redirect(
        new URL("/settings?calendar_error=invalid_state", req.url)
      );
    }

    const { userId, redirectTo } = parsed;

    const tokens = await exchangeCodeForTokens(code);

    if (!tokens.access_token) {
      return NextResponse.redirect(
        new URL(`${redirectTo}?calendar_error=token_exchange_failed`, req.url)
      );
    }

    // H-4: Verify the token's Google email matches the requesting user's email
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: tokens.access_token });
    const tokenInfo = await oauth2Client.getTokenInfo(tokens.access_token);

    if (tokenInfo.email) {
      const userDoc = await getAdminDb().collection("users").doc(userId).get();
      const userData = userDoc.data();
      const userEmail = userData?.email || userData?.primaryEmail || "";

      if (userEmail && tokenInfo.email !== userEmail) {
        console.warn(
          `OAuth token email mismatch: token=${tokenInfo.email}, user=${userEmail} (${userId})`
        );
        return NextResponse.redirect(
          new URL(`${redirectTo}?calendar_error=email_mismatch`, req.url)
        );
      }
    }

    await saveCalendarTokens(userId, tokens, tokenInfo.email || "");

    return NextResponse.redirect(
      new URL(`${redirectTo}?calendar_connected=true`, req.url)
    );
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    return NextResponse.redirect(
      new URL("/settings?calendar_error=unknown", req.url)
    );
  }
}
