import { NextResponse } from "next/server";
import { apiConfig } from "@/config/api";

export async function GET() {
  try {
    const response = await fetch(`${apiConfig.baseUrl}/api/sections`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            (data as { detail?: string; error?: string }).detail ??
            (data as { error?: string }).error ??
            "Catalog service unavailable",
          items: [],
        },
        { status: response.status }
      );
    }
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      {
        error: "Could not reach catalog service. Run ./start.sh and ensure backend is on :4002.",
        items: [],
      },
      { status: 503 }
    );
  }
}
