"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { userQueryKeys } from "@/hooks/query-keys";
import { userService } from "@/services/user.service";
import type { ProfileUpdatePayload } from "@/types/user";

export function useMe() {
  return useQuery({
    queryKey: userQueryKeys.me(),
    queryFn: () => userService.getMe(),
    staleTime: 60_000,
  });
}

export function useOnboarding() {
  return useQuery({
    queryKey: userQueryKeys.onboarding(),
    queryFn: () => userService.getOnboarding(),
    staleTime: 30_000,
  });
}

export function useUpdateMe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProfileUpdatePayload) => userService.updateMe(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.me() });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.onboarding() });
    },
  });
}
