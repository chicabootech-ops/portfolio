"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { userQueryKeys } from "@/hooks/query-keys";
import { userService } from "@/services/user.service";
import type { PreferencesUpdatePayload } from "@/types/user";

export function usePreferences() {
  return useQuery({
    queryKey: userQueryKeys.preferences(),
    queryFn: () => userService.getPreferences(),
    staleTime: 60_000,
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PreferencesUpdatePayload) => userService.updatePreferences(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.preferences() });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.me() });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.onboarding() });
    },
  });
}
