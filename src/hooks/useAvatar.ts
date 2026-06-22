"use client";

import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { userQueryKeys } from "@/hooks/query-keys";
import { userService } from "@/services/user.service";
import { UserApiError } from "@/types/user";

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/webp", "image/jpeg", "image/png"]);

export function useAvatarUrl(enabled = true) {
  return useQuery({
    queryKey: userQueryKeys.avatarUrl(),
    queryFn: () => userService.getAvatarUrl(),
    enabled,
    staleTime: 45 * 60_000,
    retry: (count, error) => {
      if (error instanceof UserApiError && error.status === 404) return false;
      return count < 2;
    },
  });
}

export function useDeleteAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => userService.deleteAvatar(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.avatarUrl() });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.me() });
    },
  });
}

export type AvatarUploadState = {
  progress: number;
  isUploading: boolean;
  isSuccess: boolean;
  error: string | null;
};

/**
 * End-to-end avatar upload: presigned URL → R2 PUT → confirm → refresh signed GET URL.
 */
export function useAvatarUpload() {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      setError(null);
      setProgress(0);

      if (!ALLOWED_TYPES.has(file.type)) {
        throw new UserApiError("Use WebP, JPEG, or PNG", 422, "invalid_type");
      }
      if (file.size > MAX_AVATAR_BYTES) {
        throw new UserApiError("Max file size is 5MB", 422, "too_large");
      }

      const contentType = file.type === "image/jpeg" ? "image/jpeg" : file.type;
      const { upload_url } = await userService.getAvatarUploadUrl({
        content_type: contentType,
        content_length: file.size,
      });

      await userService.uploadAvatarToR2(upload_url, file, contentType, setProgress);
      await userService.confirmAvatar(file.size);
    },
    onSuccess: async () => {
      setProgress(100);
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.avatarUrl() });
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.me() });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      setProgress(0);
    },
  });

  const upload = useCallback(
    (file: File) => {
      mutation.mutate(file);
    },
    [mutation]
  );

  const reset = useCallback(() => {
    setError(null);
    setProgress(0);
    mutation.reset();
  }, [mutation]);

  return {
    upload,
    reset,
    progress,
    isUploading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: error ?? (mutation.error instanceof Error ? mutation.error.message : null),
  } satisfies AvatarUploadState & {
    upload: (file: File) => void;
    reset: () => void;
  };
}
