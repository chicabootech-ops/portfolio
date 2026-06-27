"use client";

import { useQuery } from "@tanstack/react-query";
import { catalogQueryKeys } from "@/hooks/query-keys";
import { fetchCategories } from "@/services/catalog.service";

export function useCollections() {
  return useQuery({
    queryKey: catalogQueryKeys.categories(),
    queryFn: fetchCategories,
    staleTime: 5 * 60_000,
  });
}
