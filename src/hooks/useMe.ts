"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { userQueryKeys } from "@/hooks/query-keys";
import { fetchCurrentUser } from "@/lib/user/fetch-current-user";
import { userService } from "@/services/user.service";
import type { ProfileUpdatePayload } from "@/types/user";

export function useMe() {
  return useQuery({
    queryKey: userQueryKeys.me(),
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60_000,
  });
}

export function useOnboarding(enabled = true) {
  return useQuery({
    queryKey: userQueryKeys.onboarding(),
    queryFn: () => userService.getOnboarding(),
    staleTime: 5 * 60_000,
    enabled,
  });
}

export function useUpdateMe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProfileUpdatePayload) => userService.updateMe(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(userQueryKeys.me(), data);
      queryClient.invalidateQueries({ queryKey: userQueryKeys.onboarding() });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.avatarUrl() });
    },
  });
}
