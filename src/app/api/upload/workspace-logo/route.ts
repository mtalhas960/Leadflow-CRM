import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api/middleware";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  return withAuth(req, async (ctx) => {
    try {
      // Only owner/admin can update workspace logo
      if (ctx.role !== "owner" && ctx.role !== "admin") {
        return NextResponse.json({ error: "Only workspace owner or admin can update the logo" }, { status: 403 });
      }

      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: "Invalid file type. Accepted: JPEG, PNG, WebP, GIF, SVG." }, { status: 400 });
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        return NextResponse.json({ error: "File too large. Maximum size: 5MB." }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

      const result = await cloudinary.uploader.upload(base64, {
        folder: `leadflow/workspace-logos`,
        public_id: `workspace-${ctx.workspaceId}`,
        overwrite: true,
        transformation: { width: 256, height: 256, crop: "fill" },
      });

      return NextResponse.json({ success: true, url: result.secure_url });
    } catch (error) {
      console.error("Workspace logo upload error:", error);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
  });
}
