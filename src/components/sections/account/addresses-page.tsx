"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MapPin, MoreVertical, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useAddresses,
  useCreateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
  useUpdateAddress,
} from "@/hooks/useAddresses";
import { useMe } from "@/hooks/useMe";
import {
  mapAccountToCreate,
  mapAccountToUpdate,
  mapUserAddressToAccount,
} from "@/lib/account/adapters";
import type { AccountAddress } from "@/types/account";
import { AddressFormSheet, EMPTY_ADDRESS_FORM } from "./address-form-sheet";
import { EmptyState } from "./shared/empty-state";

function formatAddressLine(address: AccountAddress) {
  const parts = [
    address.line1,
    address.line2,
    `${address.city}, ${address.state} ${address.pincode}`,
  ].filter(Boolean);
  return parts.join(", ");
}

function AddressRow({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isDeleting,
  isSettingDefault,
}: {
  address: AccountAddress;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
  isDeleting: boolean;
  isSettingDefault: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <article className="rounded-2xl border border-border/30 bg-white/80 shadow-sm">
      {/* Mobile-first row header */}
      <div className="flex items-start justify-between gap-3 border-b border-border/15 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {address.name}
            <span className="mx-2 font-normal text-muted-foreground">·</span>
            <span className="font-medium text-foreground/90">{address.phone || "—"}</span>
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
              {address.label}
            </Badge>
            {address.is_default ? (
              <Badge variant="success" className="text-[10px] uppercase tracking-wide">
                Default
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
            aria-label="Address options"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <MoreVertical size={18} />
          </button>
          {menuOpen ? (
            <>
              <button
                type="button"
                className="fixed inset-0 z-40 cursor-default"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-11 z-50 min-w-[10.5rem] overflow-hidden rounded-xl border border-border/30 bg-white py-1 shadow-lg">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-secondary/40"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit();
                  }}
                >
                  <Pencil size={15} />
                  Edit
                </button>
                {!address.is_default ? (
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-secondary/40 disabled:opacity-50"
                    disabled={isSettingDefault}
                    onClick={() => {
                      setMenuOpen(false);
                      onSetDefault();
                    }}
                  >
                    <Star size={15} />
                    Set default
                  </button>
                ) : null}
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-destructive hover:bg-destructive/5 disabled:opacity-50"
                  disabled={isDeleting}
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete();
                  }}
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>

      <div className="px-4 py-3">
        <p className="text-sm leading-relaxed text-foreground/85">{formatAddressLine(address)}</p>
      </div>

      {/* Desktop / wide — inline actions */}
      <div className="hidden flex-wrap gap-2 border-t border-border/15 px-4 py-3 sm:flex">
        <Button type="button" variant="outline" size="sm" className="h-9 rounded-full" onClick={onEdit}>
          <Pencil size={14} />
          Edit
        </Button>
        {!address.is_default ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-full"
            disabled={isSettingDefault}
            onClick={onSetDefault}
          >
            <Star size={14} />
            Set default
          </Button>
        ) : null}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 rounded-full text-destructive hover:text-destructive"
          disabled={isDeleting}
          onClick={onDelete}
        >
          <Trash2 size={14} />
          Delete
        </Button>
      </div>
    </article>
  );
}

export function AddressesPageClient() {
  const router = useRouter();
  const { data: me, isLoading: meLoading } = useMe();
  const { data: rows, isLoading } = useAddresses(Boolean(me));
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"add" | "edit">("add");
  const [editing, setEditing] = useState<AccountAddress | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [defaultingId, setDefaultingId] = useState<string | null>(null);

  const addresses = useMemo(
    () => (rows ?? []).map(mapUserAddressToAccount),
    [rows]
  );

  useEffect(() => {
    if (meLoading) return;
    if (!me) router.replace("/login?next=/account/addresses");
  }, [me, meLoading, router]);

  function openAdd() {
    setSheetMode("add");
    setEditing(null);
    setSheetOpen(true);
  }

  function openEdit(address: AccountAddress) {
    setSheetMode("edit");
    setEditing(address);
    setSheetOpen(true);
  }

  async function handleSubmit(payload: AccountAddress | Omit<AccountAddress, "id">) {
    if (sheetMode === "add") {
      await createAddress.mutateAsync(
        mapAccountToCreate({
          ...(payload as Omit<AccountAddress, "id">),
          is_default:
            addresses.length === 0 ? true : (payload as AccountAddress).is_default,
        })
      );
      return;
    }

    if ("id" in payload && payload.id) {
      await updateAddress.mutateAsync({
        id: payload.id,
        payload: mapAccountToUpdate(payload),
      });
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this address?")) return;
    setDeletingId(id);
    try {
      await deleteAddress.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSetDefault(id: string) {
    setDefaultingId(id);
    try {
      await setDefaultAddress.mutateAsync(id);
    } finally {
      setDefaultingId(null);
    }
  }

  const formInitial = editing
    ? editing
    : {
        ...EMPTY_ADDRESS_FORM,
        name: me?.profile?.first_name
          ? [me.profile.first_name, me.profile.last_name].filter(Boolean).join(" ")
          : "",
        phone: me?.phone ?? "",
      };

  if (meLoading || !me) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center pt-36">
        <Loader2 className="size-8 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-24 pt-32 md:pt-36">
      <div className="mx-auto w-full max-w-2xl px-4 md:px-6">
        <PageBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "My Account", href: "/account" },
            { label: "Saved Addresses" },
          ]}
          className="mb-4"
        />

        <header className="mb-6">
          <h1 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
            Saved Addresses
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage delivery addresses for faster checkout.
          </p>
        </header>

        <button
          type="button"
          onClick={openAdd}
          className="mb-5 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/35 bg-primary/5 px-4 py-3 text-sm font-semibold tracking-wide text-primary transition-colors hover:bg-primary/10"
        >
          <Plus size={18} aria-hidden />
          ADD A NEW ADDRESS
        </button>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-secondary/40" />
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <EmptyState
            icon={<MapPin size={24} />}
            title="No addresses yet"
            description="Add your first delivery address for faster checkout on bespoke orders."
            actionLabel="Add address"
            onAction={openAdd}
          />
        ) : (
          <div className="space-y-3">
            {/* Tabular header — visible sm+ */}
            <div className="hidden grid-cols-[1fr_auto] gap-4 rounded-xl bg-secondary/30 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:grid">
              <span>Address</span>
              <span className="text-right">Actions</span>
            </div>

            {addresses.map((address) => (
              <AddressRow
                key={address.id}
                address={address}
                onEdit={() => openEdit(address)}
                onDelete={() => handleDelete(address.id)}
                onSetDefault={() => handleSetDefault(address.id)}
                isDeleting={deletingId === address.id}
                isSettingDefault={defaultingId === address.id}
              />
            ))}

            <p className="pt-2 text-center text-xs text-muted-foreground">
              {addresses.length} saved address{addresses.length !== 1 ? "es" : ""}
            </p>
          </div>
        )}
      </div>

      <AddressFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        mode={sheetMode}
        initial={sheetMode === "edit" && editing ? editing : formInitial}
        isFirstAddress={addresses.length === 0 && sheetMode === "add"}
        isSaving={createAddress.isPending || updateAddress.isPending}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
