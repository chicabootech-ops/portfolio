"use client";

import Link from "next/link";
import { MapPin, Plus, Pencil, Trash2, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AccountAddress } from "@/types/account";
import { SectionCard } from "./shared/section-card";
import { EmptyState } from "./shared/empty-state";

type AddressesSectionProps = {
  addresses: AccountAddress[];
};

export function AddressesSection({ addresses }: AddressesSectionProps) {
  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];

  return (
    <SectionCard
      title="Saved Addresses"
      action={
        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-9 min-h-[44px] rounded-full"
        >
          <Link href="/account/addresses">
            <Plus size={16} aria-hidden />
            Add
          </Link>
        </Button>
      }
    >
      {addresses.length === 0 ? (
        <EmptyState
          icon={<MapPin size={24} />}
          title="No addresses saved"
          description="Add a delivery address for faster checkout on your next bespoke order."
          actionLabel="Add Address"
          actionHref="/account/addresses"
        />
      ) : (
        <div className="space-y-3">
          {defaultAddress ? (
            <article className="rounded-xl border border-primary/25 bg-primary/5 p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge>{defaultAddress.label}</Badge>
                <Badge variant="success">Default</Badge>
              </div>
              <p className="font-medium text-foreground">{defaultAddress.name}</p>
              <p className="text-sm text-muted-foreground">{defaultAddress.phone}</p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                {defaultAddress.line1}
                {defaultAddress.line2 ? `, ${defaultAddress.line2}` : ""}
                <br />
                {defaultAddress.city}, {defaultAddress.state} {defaultAddress.pincode}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="h-10 min-h-[44px] rounded-full">
                  <Pencil size={14} aria-hidden />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="h-10 min-h-[44px] rounded-full">
                  <Trash2 size={14} aria-hidden />
                  Delete
                </Button>
              </div>
            </article>
          ) : null}

          {addresses
            .filter((a) => !a.isDefault)
            .map((address) => (
              <article
                key={address.id}
                className="rounded-xl border border-border/25 bg-background/50 p-4"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <Badge variant="outline">{address.label}</Badge>
                  <Button variant="ghost" size="sm" className="h-9 rounded-full text-xs">
                    <Star size={14} aria-hidden />
                    Set Default
                  </Button>
                </div>
                <p className="font-medium text-foreground">{address.name}</p>
                <p className="text-sm text-muted-foreground">{address.phone}</p>
                <p className="mt-1 text-sm text-foreground/90">
                  {address.line1}, {address.city}
                </p>
              </article>
            ))}

          <Button
            asChild
            variant="ghost"
            className="h-11 min-h-[44px] w-full rounded-xl text-primary"
          >
            <Link href="/account/addresses">Manage all addresses</Link>
          </Button>
        </div>
      )}
    </SectionCard>
  );
}
