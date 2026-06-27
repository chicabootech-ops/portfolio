import { NextResponse } from "next/server";
import { apiConfig } from "@/config/api";
import { resolveCollectionImage } from "@/lib/collection-images";

type CategoryListResponse = {
  items?: Array<{ slug: string; image_url: string | null }>;
};

export async function GET() {
  try {
    const response = await fetch(`${apiConfig.baseUrl}/api/categories`, {
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

    const payload = data as CategoryListResponse;
    const items = (payload.items ?? []).map((item) => ({
      ...item,
      image_url: resolveCollectionImage(item.slug, item.image_url),
    }));

    return NextResponse.json({ ...payload, items }, { status: response.status });
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
