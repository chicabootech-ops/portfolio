"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { userQueryKeys } from "@/hooks/query-keys";
import { userService } from "@/services/user.service";
import type { PreferencesUpdatePayload, UserPreferences } from "@/types/user";

export function usePreferences(initialData?: UserPreferences | null, enabled = true) {
  return useQuery({
    queryKey: userQueryKeys.preferences(),
    queryFn: () => userService.getPreferences(),
    staleTime: 5 * 60_000,
    enabled: enabled && !initialData,
    initialData: initialData ?? undefined,
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PreferencesUpdatePayload) => userService.updatePreferences(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(userQueryKeys.preferences(), data);
      queryClient.invalidateQueries({ queryKey: userQueryKeys.me() });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.onboarding() });
    },
  });
}
