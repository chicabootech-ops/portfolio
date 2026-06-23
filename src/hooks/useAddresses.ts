"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { userQueryKeys } from "@/hooks/query-keys";
import { userService } from "@/services/user.service";
import type { AddressCreatePayload, AddressUpdatePayload } from "@/types/user";

export function useAddresses(enabled = true) {
  return useQuery({
    queryKey: userQueryKeys.addresses(),
    queryFn: async () => {
      const data = await userService.listAddresses();
      return data.items;
    },
    staleTime: 5 * 60_000,
    enabled,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddressCreatePayload) => userService.createAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.addresses() });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.me() });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.onboarding() });
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AddressUpdatePayload }) =>
      userService.updateAddress(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.addresses() });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.address(variables.id) });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.addresses() });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.me() });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.onboarding() });
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.setDefaultAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.addresses() });
    },
  });
}
