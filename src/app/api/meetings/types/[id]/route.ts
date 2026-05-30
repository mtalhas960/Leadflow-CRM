import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api/middleware";
import {
  getMeetingType,
  updateMeetingType,
  deleteMeetingType,
} from "@/lib/firebase/server-admin";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(req, async (ctx) => {
    try {
      const { id } = await params;
      const existing = await getMeetingType(id);
      if (!existing) {
        return NextResponse.json({ error: "Meeting type not found" }, { status: 404 });
      }
      const existingData = existing as Record<string, unknown>;
      if (existingData.workspaceId !== ctx.workspaceId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const body = await req.json();
      // Whitelist allowed updatable fields to prevent overwriting protected fields
      const allowedFields = [
        "name",
        "duration",
        "description",
        "availability",
        "videoTool",
        "bookingQuestions",
        "confirmationPage",
        "redirectUrl",
        "isActive",
      ];
      const updateData: Record<string, unknown> = {};
      for (const field of allowedFields) {
        if (field in body) updateData[field] = body[field];
      }
      await updateMeetingType(id, updateData);

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Failed to update meeting type:", error);
      return NextResponse.json(
        { error: "Failed to update meeting type" },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(req, async (ctx) => {
    try {
      const { id } = await params;
      const existing = await getMeetingType(id);
      if (!existing) {
        return NextResponse.json({ error: "Meeting type not found" }, { status: 404 });
      }
      const existingData = existing as Record<string, unknown>;
      if (existingData.workspaceId !== ctx.workspaceId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      await deleteMeetingType(id);

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Failed to delete meeting type:", error);
      return NextResponse.json(
        { error: "Failed to delete meeting type" },
        { status: 500 }
      );
    }
  });
}
