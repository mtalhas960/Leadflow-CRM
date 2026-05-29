import { NextRequest, NextResponse } from "next/server";
import { createCalendarEvent, getUpcomingEvents, disconnectCalendar, getCalendarConnectionStatus } from "@/lib/calendar";
import { getLead } from "@/lib/firebase/firestore";
import { withAuth } from "@/lib/api/middleware";

export async function POST(req: NextRequest) {
  return withAuth(req, async (ctx) => {
    try {
      const body = await req.json();
      const { leadId, followUpDate } = body;

      if (!leadId || !followUpDate) {
        return NextResponse.json(
          { error: "leadId and followUpDate are required" },
          { status: 400 }
        );
      }

      const lead = await getLead(leadId);

      if (!lead) {
        return NextResponse.json(
          { error: "Lead not found" },
          { status: 404 }
        );
      }

      const event = await createCalendarEvent(ctx.userId, lead, followUpDate);
      return NextResponse.json({ event });
    } catch (error) {
      console.error("Create calendar event error:", error);
      const message = error instanceof Error ? error.message : "Failed to create event";
      return NextResponse.json(
        { error: message },
        { status: 500 }
      );
    }
  });
}

export async function GET(req: NextRequest) {
  return withAuth(req, async (ctx) => {
    try {
      const maxResults = parseInt(req.nextUrl.searchParams.get("maxResults") || "5", 10);

      const status = await getCalendarConnectionStatus(ctx.userId);

      if (!status.connected) {
        return NextResponse.json(
          { error: "Google Calendar not connected", connected: false },
          { status: 200 }
        );
      }

      const events = await getUpcomingEvents(ctx.userId, maxResults);
      return NextResponse.json({ events, connected: true, email: status.email });
    } catch (error) {
      console.error("Get upcoming events error:", error);
      const message = error instanceof Error ? error.message : "Failed to get upcoming events";
      return NextResponse.json(
        { error: message },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(req: NextRequest) {
  return withAuth(req, async (ctx) => {
    try {
      await disconnectCalendar(ctx.userId);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Disconnect calendar error:", error);
      return NextResponse.json(
        { error: "Failed to disconnect calendar" },
        { status: 500 }
      );
    }
  });
}
