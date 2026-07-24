import { NextResponse } from "next/server";
import { apiConfig } from "@/config/api";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  try {
    const response = await fetch(
      `${apiConfig.baseUrl}/api/sections/${encodeURIComponent(slug)}`,
      {
        headers: { Accept: "application/json" },
        cache: "no-store",
      }
    );
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ error: "Catalog service unavailable" }, { status: 503 });
  }
}
