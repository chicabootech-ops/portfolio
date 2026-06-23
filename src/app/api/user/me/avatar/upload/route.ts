import { NextResponse } from "next/server";

import { apiConfig } from "@/config/api";
import { fetchWithAccessToken } from "@/lib/auth/server-tokens";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/webp", "image/jpeg", "image/png"]);

/**
 * Server-side avatar upload — avoids browser CORS/CSP blocks on direct R2 PUT.
 * Flow: presigned URL → server PUT to R2 → confirm.
 */
export async function POST(request: Request) {
  const contentType = request.headers.get("content-type")?.split(";")[0]?.trim() ?? "";
  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (!ALLOWED_TYPES.has(contentType)) {
    return NextResponse.json(
      { error: "Use WebP, JPEG, or PNG", code: "invalid_type" },
      { status: 422 }
    );
  }

  if (!contentLength || contentLength > MAX_BYTES) {
    return NextResponse.json(
      { error: "Max file size is 5MB", code: "too_large" },
      { status: 422 }
    );
  }

  const fileBuffer = Buffer.from(await request.arrayBuffer());
  if (fileBuffer.byteLength !== contentLength) {
    return NextResponse.json({ error: "Upload size mismatch" }, { status: 422 });
  }

  const urlResponse = await fetchWithAccessToken(
    `${apiConfig.baseUrl}/api/user/me/avatar/upload-url`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content_type: contentType,
        content_length: contentLength,
      }),
    }
  );

  const urlData = (await urlResponse.json().catch(() => ({}))) as {
    upload_url?: string;
    error?: string;
    message?: string;
  };

  if (!urlResponse.ok || !urlData.upload_url) {
    return NextResponse.json(
      { error: urlData.message ?? urlData.error ?? "Could not get upload URL" },
      { status: urlResponse.status || 502 }
    );
  }

  let putResponse: Response;
  try {
    putResponse = await fetch(urlData.upload_url, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(contentLength),
      },
      body: fileBuffer,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to upload to storage", code: "r2_put_failed" },
      { status: 502 }
    );
  }

  if (!putResponse.ok) {
    return NextResponse.json(
      { error: `Storage upload failed (${putResponse.status})`, code: "r2_put_failed" },
      { status: 502 }
    );
  }

  const confirmResponse = await fetchWithAccessToken(
    `${apiConfig.baseUrl}/api/user/me/avatar/confirm`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content_length: contentLength }),
    }
  );

  const confirmData = await confirmResponse.json().catch(() => ({}));
  return NextResponse.json(confirmData, { status: confirmResponse.status });
}
