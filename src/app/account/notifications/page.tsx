"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { PageShell } from "@/components/layout";
import { EmptyState } from "@/components/sections/account/shared/empty-state";

type Notification = {
  id: string;
  order_id: string;
  order_number: number;
  title: string;
  reason: string | null;
  created_at: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[] | null>(null);

  useEffect(() => {
    fetch("/api/notifications")
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .catch(() => setNotifications([]));
  }, []);

  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "My Account", href: "/account" },
        { label: "Notifications" },
      ]}
      title="Notifications"
      description="Stay updated on orders, offers, and account activity."
    >
      {notifications === null ? (
        <p className="mt-10 text-sm text-muted-foreground">Loading notifications…</p>
      ) : notifications.length ? (
        <div className="mt-10 max-w-3xl space-y-3">
          {notifications.map((notification) => (
            <a
              key={notification.id}
              href={`/account/orders/${notification.order_id}`}
              className="flex gap-4 rounded-2xl border border-border/40 p-5 transition hover:border-primary/40"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <Bell size={18} />
              </span>
              <span>
                <strong className="block text-sm">{notification.title}</strong>
                {notification.reason ? (
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {notification.reason}
                  </span>
                ) : null}
                <span className="mt-2 block text-xs text-muted-foreground">
                  {new Date(notification.created_at).toLocaleString("en-IN")}
                </span>
              </span>
            </a>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Bell size={24} />}
          title="You're all caught up"
          description="Order updates will appear here."
          actionLabel="Back to account"
          actionHref="/account"
        />
      )}
    </PageShell>
  );
}
