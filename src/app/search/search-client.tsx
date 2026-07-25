"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { PageShell } from "@/components/layout";
import { ImageWithSkeleton } from "@/components/skeletons";
import { formatPaise } from "@/lib/format";
import { resolveCollectionImage } from "@/lib/collection-images";

type SearchItem = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  price_paise: number;
  category_slug: string | null;
};

type SearchResult = {
  query: string;
  items: SearchItem[];
  suggestions: { name: string; slug: string }[];
  total: number;
};

export default function SearchPageClient() {
  const params = useSearchParams();
  const router = useRouter();
  const initial = params.get("q") ?? "";
  const [q, setQ] = useState(initial);
  const [sort, setSort] = useState(params.get("sort") ?? "relevance");
  const [data, setData] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = params.get("q") ?? "";
    setQ(query);
    if (!query.trim()) {
      setData(null);
      return;
    }
    setLoading(true);
    const qs = new URLSearchParams({
      q: query,
      sort: params.get("sort") ?? "relevance",
    });
    fetch(`/api/search?${qs}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ query, items: [], suggestions: [], total: 0 }))
      .finally(() => setLoading(false));
  }, [params]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams();
    if (q.trim()) next.set("q", q.trim());
    if (sort !== "relevance") next.set("sort", sort);
    router.push(`/search?${next.toString()}`);
  };

  return (
    <PageShell
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Search" }]}
      title="Search"
      description="Find bouquets, hampers, and keepsakes."
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-1.5 text-sm">
          <span className="text-muted-foreground">What are you looking for?</span>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-11 w-full rounded-full border border-border/60 bg-white/80 pl-10 pr-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              placeholder="Tulips, rakhi, hamper…"
            />
          </div>
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block text-muted-foreground">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-11 rounded-full border border-border/60 bg-white px-4"
          >
            <option value="relevance">Relevance</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
            <option value="newest">Newest</option>
            <option value="name">Name</option>
          </select>
        </label>
        <button
          type="submit"
          className="h-11 rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground"
        >
          Search
        </button>
      </form>

      {loading ? (
        <div className="mt-16 flex justify-center">
          <Loader2 className="animate-spin text-primary" />
        </div>
      ) : data && data.query ? (
        <div className="mt-10">
          <p className="text-sm text-muted-foreground">
            {data.total} result{data.total === 1 ? "" : "s"} for “{data.query}”
          </p>
          {data.items.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-border/30 bg-white/60 px-6 py-12 text-center">
              <p className="font-heading text-lg">No matches</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try another spelling, or browse these close matches.
              </p>
              {data.suggestions.length > 0 ? (
                <ul className="mt-6 flex flex-wrap justify-center gap-2">
                  {data.suggestions.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/product/${s.slug}`}
                        className="rounded-full border border-border/40 px-4 py-2 text-sm hover:border-primary hover:text-primary"
                      >
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <Link href="/" className="mt-6 inline-block text-sm text-primary hover:underline">
                  Back to home
                </Link>
              )}
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {data.items.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group flex flex-col gap-2"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary/20">
                    <ImageWithSkeleton
                      src={
                        product.image_url ||
                        resolveCollectionImage(product.category_slug || product.slug, null)
                      }
                      alt={product.name}
                      fill
                      sizes="200px"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <p className="line-clamp-2 text-sm font-medium">{product.name}</p>
                  <p className="text-sm font-semibold text-primary">
                    {formatPaise(product.price_paise)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </PageShell>
  );
}
