"use client";

import { FormEvent, useEffect, useState } from "react";
import { PageShell } from "@/components/layout";

type CustomerReturn = {
  id: string;
  return_number: number;
  order_id: string;
  order_number: number;
  status: string;
  reason: string;
  customer_note: string | null;
  created_at: string;
};

type Order = { id: string; order_number: number };

export default function AccountReturnsPage() {
  const [returns, setReturns] = useState<CustomerReturn[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderId, setOrderId] = useState("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function loadReturns() {
    const response = await fetch("/api/returns");
    const data = await response.json().catch(() => []);
    setReturns(response.ok && Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    void loadReturns();
    fetch("/api/orders?page_size=100")
      .then((response) => (response.ok ? response.json() : { items: [] }))
      .then((data) => {
        const items = Array.isArray(data?.items) ? data.items : [];
        setOrders(items);
        if (items[0]?.id) setOrderId(items[0].id);
      })
      .catch(() => setOrders([]));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    const response = await fetch("/api/returns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: orderId, reason, note: note || null }),
    }).catch(() => null);
    const data = await response?.json().catch(() => ({}));
    if (response?.ok) {
      setReason("");
      setNote("");
      setMessage("Your return request has been created.");
      await loadReturns();
    } else {
      setMessage(data?.detail ?? "We couldn't create this return request.");
    }
    setSubmitting(false);
  }

  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "My Account", href: "/account" },
        { label: "Returns" },
      ]}
      title="Returns"
      description="Request a return and follow its status."
    >
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.8fr]">
        <section>
          <h2 className="text-xl font-semibold">Your return requests</h2>
          {returns.length ? (
            <div className="mt-5 space-y-3">
              {returns.map((item) => (
                <article key={item.id} className="rounded-2xl border border-border/40 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">Return #{item.return_number}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Order #{item.order_number} · {item.reason}
                      </p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary">
                      {item.status}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm text-muted-foreground">No return requests yet.</p>
          )}
        </section>

        <form onSubmit={submit} className="rounded-2xl bg-secondary/20 p-6">
          <h2 className="text-xl font-semibold">Request a return</h2>
          <label className="mt-5 block text-sm font-medium">
            Order
            <select
              required
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
              className="mt-2 block w-full rounded-xl border border-border/50 bg-background px-3 py-2"
            >
              <option value="">Select an order</option>
              {orders.map((order) => (
                <option key={order.id} value={order.id}>
                  Order #{order.order_number}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-4 block text-sm font-medium">
            Reason
            <input
              required
              minLength={2}
              maxLength={200}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="mt-2 block w-full rounded-xl border border-border/50 bg-background px-3 py-2"
            />
          </label>
          <label className="mt-4 block text-sm font-medium">
            Note (optional)
            <textarea
              rows={4}
              maxLength={2000}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="mt-2 block w-full rounded-xl border border-border/50 bg-background px-3 py-2"
            />
          </label>
          <button
            type="submit"
            disabled={submitting || !orderId}
            className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Request return"}
          </button>
          {message ? <p className="mt-3 text-sm text-muted-foreground">{message}</p> : null}
        </form>
      </div>
    </PageShell>
  );
}
