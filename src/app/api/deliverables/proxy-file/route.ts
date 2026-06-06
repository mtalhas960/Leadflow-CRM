import { NextRequest, NextResponse } from "next/server";

/**
 * Proxies files from Cloudinary (or any URL) through our server,
 * stripping restrictive headers (X-Frame-Options, Content-Disposition)
 * that block iframe embedding in browsers.
 *
 * Usage: GET /api/deliverables/proxy-file?url=<encoded-cloudinary-url>
 *
 * GigBase equivalent: /api/workflow/deliverables/proxy-pdf, proxy-image, proxy-audio
 */
export async function GET(req: NextRequest) {
  try {
    const urlParam = req.nextUrl.searchParams.get("url");
    if (!urlParam) {
      return NextResponse.json({ error: "Missing 'url' query parameter" }, { status: 400 });
    }

    const targetUrl = decodeURIComponent(urlParam);

    // Validate it's a Cloudinary URL (security: prevent open proxy)
    if (!targetUrl.includes("res.cloudinary.com")) {
      return NextResponse.json({ error: "Only Cloudinary URLs are allowed" }, { status: 400 });
    }

    // Fetch the file from Cloudinary
    const response = await fetch(targetUrl, {
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch file: ${response.status}` },
        { status: response.status }
      );
    }

    // Get the file data and content type
    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const arrayBuffer = await response.arrayBuffer();

    // Return with permissive headers (no X-Frame-Options, no Content-Disposition)
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": arrayBuffer.byteLength.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
        // Allow iframe embedding everywhere
        "X-Frame-Options": "ALLOWALL",
        // Let the browser decide how to handle it
        "Content-Disposition": "inline",
        // CORS
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Proxy file error:", error);
    return NextResponse.json({ error: "Failed to proxy file" }, { status: 500 });
  }
}
