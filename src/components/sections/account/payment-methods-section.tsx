"use client";

import { CreditCard, Plus, Smartphone, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PaymentMethod } from "@/types/account";
import { SectionCard } from "./shared/section-card";
import { EmptyState } from "./shared/empty-state";

function PaymentIcon({ type }: { type: PaymentMethod["type"] }) {
  if (type === "upi") {
    return <Smartphone size={20} aria-hidden />;
  }
  return <CreditCard size={20} aria-hidden />;
}

type PaymentMethodsSectionProps = {
  methods: PaymentMethod[];
};

export function PaymentMethodsSection({ methods }: PaymentMethodsSectionProps) {
  return (
    <SectionCard title="Payment Methods">
      {methods.length === 0 ? (
        <EmptyState
          icon={<CreditCard size={24} />}
          title="No saved payments"
          description="Save a card or UPI ID for quicker checkout on your next order."
          actionLabel="Add Payment Method"
          actionHref="/account/payments"
        />
      ) : (
        <div className="space-y-3">
          {methods.map((method) => (
            <article
              key={method.id}
              className="flex items-center gap-3 rounded-xl border border-border/25 bg-background/50 p-4"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary/60 text-primary">
                <PaymentIcon type={method.type} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-foreground">{method.label}</p>
                  {method.isDefault ? (
                    <Badge variant="success">Default</Badge>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">{method.masked}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-1.5 sm:flex-row">
                {!method.isDefault ? (
                  <Button variant="ghost" size="sm" className="h-9 text-xs">
                    Set default
                  </Button>
                ) : null}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive hover:text-destructive"
                  aria-label={`Remove ${method.label}`}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </article>
          ))}

          <Button
            variant="outline"
            className="h-11 min-h-[44px] w-full rounded-full"
          >
            <Plus size={16} aria-hidden />
            Add payment method
          </Button>
        </div>
      )}
    </SectionCard>
  );
}
