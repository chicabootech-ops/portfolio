"use client";

import { useQuery } from "@tanstack/react-query";

import { userQueryKeys } from "@/hooks/query-keys";
import { useAvatarUrl } from "@/hooks/useAvatar";
import { isStorageAvatarKey, resolveAvatarUrl } from "@/lib/account/avatar-url";

/**
 * Resolve avatar for display: blob preview → signed R2 URL → static URL.
 */
export function useDisplayAvatar(
  storageKeyOrUrl: string | null | undefined,
  blobPreview?: string | null
) {
  const needsSignedUrl = isStorageAvatarKey(storageKeyOrUrl) && !blobPreview;
  const { data: signed, isLoading } = useAvatarUrl(needsSignedUrl);

  if (blobPreview) {
    return { src: blobPreview, isLoading: false };
  }

  if (needsSignedUrl) {
    return {
      src: signed?.url ?? null,
      isLoading,
    };
  }

  return {
    src: resolveAvatarUrl(storageKeyOrUrl ?? null),
    isLoading: false,
  };
}
