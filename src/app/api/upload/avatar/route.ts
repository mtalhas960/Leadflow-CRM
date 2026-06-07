import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api/middleware";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  return withAuth(req, async (ctx) => {
    try {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: "Invalid file type. Accepted: JPEG, PNG, WebP, GIF." }, { status: 400 });
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        return NextResponse.json({ error: "File too large. Maximum size: 5MB." }, { status: 400 });
      }

      // Upload to Cloudinary
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

      const result = await cloudinary.uploader.upload(base64, {
        folder: `leadflow/avatars/${ctx.workspaceId}`,
        public_id: `user-${ctx.userId}`,
        overwrite: true,
        transformation: { width: 400, height: 400, crop: "fill", gravity: "face" },
      });

      return NextResponse.json({ success: true, url: result.secure_url });
    } catch (error) {
      console.error("Avatar upload error:", error);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
  });
}
