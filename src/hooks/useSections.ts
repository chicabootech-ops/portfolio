"use client";

import { useQuery } from "@tanstack/react-query";
import { catalogQueryKeys } from "@/hooks/query-keys";
import { fetchSections } from "@/services/catalog.service";

export function useSections() {
  return useQuery({
    queryKey: catalogQueryKeys.sections(),
    queryFn: fetchSections,
    staleTime: 5 * 60_000,
  });
}
