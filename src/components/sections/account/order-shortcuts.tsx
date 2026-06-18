"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Package,
  Heart,
  RotateCcw,
  Receipt,
} from "lucide-react";
import type { AccountStats } from "@/types/account";
import { cn } from "@/lib/utils";

const shortcuts = [
  {
    key: "orders" as const,
    label: "Orders",
    href: "/account/orders",
    icon: Package,
    color: "from-primary/20 to-primary/5 text-primary",
  },
  {
    key: "wishlist" as const,
    label: "Wishlist",
    href: "/wishlist",
    icon: Heart,
    color: "from-rose-500/15 to-rose-500/5 text-rose-600",
  },
  {
    key: "returns" as const,
    label: "Returns",
    href: "/account/orders?tab=returns",
    icon: RotateCcw,
    color: "from-amber-500/15 to-amber-500/5 text-amber-700",
  },
  {
    key: "refunds" as const,
    label: "Refunds",
    href: "/account/orders?tab=refunds",
    icon: Receipt,
    color: "from-emerald-500/15 to-emerald-500/5 text-emerald-700",
  },
];

type OrderShortcutsProps = {
  stats: AccountStats;
};

export function OrderShortcuts({ stats }: OrderShortcutsProps) {
  return (
    <section aria-label="Order shortcuts">
      <h2 className="mb-3 text-base font-semibold text-foreground md:text-lg">
        Quick Access
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {shortcuts.map((item, index) => {
          const Icon = item.icon;
          const count = stats[item.key];

          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Link
                href={item.href}
                className="group flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-2xl border border-border/30 bg-white/80 p-4 shadow-sm transition-all active:scale-[0.98] hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                aria-label={`${item.label}, ${count} items`}
              >
                <span
                  className={cn(
                    "flex size-11 items-center justify-center rounded-xl bg-gradient-to-br",
                    item.color
                  )}
                >
                  <Icon size={22} strokeWidth={1.75} aria-hidden />
                </span>
                <span className="text-sm font-medium text-foreground">
                  {item.label}
                </span>
                <span className="text-lg font-bold text-primary">{count}</span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
