"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useCart } from "@/components/providers/cart-provider";
import { useAddresses } from "@/hooks/useAddresses";
import { formatPaise } from "@/lib/format";
import { loadRazorpay, openRazorpayCheckout } from "@/lib/razorpay";
import {
  createCheckout,
  getPaymentConfig,
  verifyPayment,
  type CheckoutAddress,
} from "@/services/commerce.service";

const BRAND_GOLD = "#c19b54";

type FormState = {
  full_name: string;
  phone: string;
  line1: string;
  line2: string;
  landmark: string;
  city: string;
  state: string;
  postal_code: string;
};

const EMPTY_FORM: FormState = {
  full_name: "",
  phone: "",
  line1: "",
  line2: "",
  landmark: "",
  city: "",
  state: "",
  postal_code: "",
};

export function CheckoutView() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { items, subtotalPaise, count, clear, isReady } = useCart();
  const { data: addresses } = useAddresses(!!user);

  const [selectedId, setSelectedId] = useState<string>("new");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentEnabled, setPaymentEnabled] = useState<boolean | null>(null);
  // Stable per-mount key so a double-submit / retry reuses one order server-side.
  const idempotencyKey = useRef<string>(
    typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `ck_${Date.now()}`
  );

  useEffect(() => {
    getPaymentConfig()
      .then((c) => setPaymentEnabled(c.enabled))
      .catch(() => setPaymentEnabled(false));
  }, []);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        full_name: f.full_name || user.name || "",
        phone: f.phone || user.phone || "",
      }));
    }
  }, [user]);

  // Default to the saved default address when one exists.
  useEffect(() => {
    if (addresses && addresses.length > 0 && selectedId === "new") {
      const def = addresses.find((a) => a.is_default) ?? addresses[0];
      setSelectedId(def.id);
    }
  }, [addresses, selectedId]);

  const shippingAddress = useMemo<CheckoutAddress | null>(() => {
    if (selectedId !== "new" && addresses) {
      const a = addresses.find((x) => x.id === selectedId);
      if (a) {
        return {
          full_name: a.full_name,
          phone: a.phone,
          line1: a.line1,
          line2: a.line2,
          landmark: a.landmark,
          city: a.city,
          state: a.state,
          postal_code: a.postal_code,
          country: a.country || "IN",
        };
      }
    }
    if (!form.full_name || !form.line1 || !form.city || !form.state || !form.postal_code) {
      return null;
    }
    return { ...form, country: "IN" };
  }, [selectedId, addresses, form]);

  const update = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handlePay = async () => {
    setError(null);
    if (!shippingAddress) {
      setError("Please fill in your complete shipping address.");
      return;
    }
    setSubmitting(true);
    try {
      const checkout = await createCheckout({
        items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
        shipping_address: shippingAddress,
        idempotency_key: idempotencyKey.current,
      });

      if (!checkout.razorpay) {
        setError("Online payments aren't available right now. Please try again later.");
        setSubmitting(false);
        return;
      }

      const ready = await loadRazorpay();
      if (!ready) {
        setError("Could not load the payment window. Check your connection and retry.");
        setSubmitting(false);
        return;
      }

      const rp = checkout.razorpay;
      openRazorpayCheckout({
        key: rp.key_id,
        amount: rp.amount_paise,
        currency: rp.currency,
        name: rp.name,
        description: rp.description,
        order_id: rp.razorpay_order_id,
        theme: { color: BRAND_GOLD },
        prefill: {
          name: rp.prefill_name ?? shippingAddress.full_name,
          email: rp.prefill_email ?? user?.email,
          contact: rp.prefill_contact ?? shippingAddress.phone ?? undefined,
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
            setError("Payment was cancelled. Your bag is saved — you can try again.");
          },
        },
        handler: async (res) => {
          try {
            const status = await verifyPayment({
              order_id: checkout.order_id,
              razorpay_order_id: res.razorpay_order_id,
              razorpay_payment_id: res.razorpay_payment_id,
              razorpay_signature: res.razorpay_signature,
            });
            clear();
            const params = new URLSearchParams({
              order: String(status.order_number),
              id: status.order_id,
            });
            if (status.invoice_number) params.set("invoice", String(status.invoice_number));
            router.push(`/checkout/success?${params.toString()}`);
          } catch (err) {
            setSubmitting(false);
            setError(
              err instanceof Error
                ? err.message
                : "We couldn't confirm your payment. If money was deducted, it will be refunded."
            );
          }
        },
      });
    } catch (err) {
      setSubmitting(false);
      setError(err instanceof Error ? err.message : "Checkout failed. Please try again.");
    }
  };

  if (authLoading || !isReady) {
    return (
      <div className="mt-16 flex justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mt-12 rounded-3xl border border-border/40 bg-white/60 px-6 py-16 text-center">
        <p className="font-heading text-xl text-foreground">Please sign in to checkout</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to complete your order securely and track it anytime.
        </p>
        <Link
          href="/login?redirect=/checkout"
          className="mt-8 inline-flex h-11 items-center rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Sign in to continue
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mt-12 rounded-3xl border border-border/40 bg-white/60 px-6 py-16 text-center">
        <p className="font-heading text-xl text-foreground">Your bag is empty</p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-6">
        {addresses && addresses.length > 0 && (
          <section className="rounded-2xl border border-border/40 bg-white/60 p-5">
            <h2 className="font-heading text-lg font-semibold text-foreground">Saved addresses</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {addresses.map((a) => (
                <label
                  key={a.id}
                  className={`cursor-pointer rounded-xl border p-4 text-sm transition ${
                    selectedId === a.id
                      ? "border-primary bg-primary/5"
                      : "border-border/50 hover:border-primary/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    className="sr-only"
                    checked={selectedId === a.id}
                    onChange={() => setSelectedId(a.id)}
                  />
                  <span className="font-semibold text-foreground">{a.full_name}</span>
                  <span className="mt-1 block text-muted-foreground">
                    {a.line1}, {a.city}, {a.state} - {a.postal_code}
                  </span>
                </label>
              ))}
              <label
                className={`cursor-pointer rounded-xl border p-4 text-sm transition ${
                  selectedId === "new"
                    ? "border-primary bg-primary/5"
                    : "border-border/50 hover:border-primary/50"
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  className="sr-only"
                  checked={selectedId === "new"}
                  onChange={() => setSelectedId("new")}
                />
                <span className="font-semibold text-foreground">+ Use a new address</span>
              </label>
            </div>
          </section>
        )}

        {selectedId === "new" && (
          <section className="rounded-2xl border border-border/40 bg-white/60 p-5">
            <h2 className="font-heading text-lg font-semibold text-foreground">Shipping address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" value={form.full_name} onChange={update("full_name")} required />
              <Field label="Phone" value={form.phone} onChange={update("phone")} />
              <Field className="sm:col-span-2" label="Address line 1" value={form.line1} onChange={update("line1")} required />
              <Field className="sm:col-span-2" label="Address line 2 (optional)" value={form.line2} onChange={update("line2")} />
              <Field label="Landmark (optional)" value={form.landmark} onChange={update("landmark")} />
              <Field label="City" value={form.city} onChange={update("city")} required />
              <Field label="State" value={form.state} onChange={update("state")} required />
              <Field label="PIN code" value={form.postal_code} onChange={update("postal_code")} required />
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-border/40 bg-white/60 p-5">
          <h2 className="font-heading text-lg font-semibold text-foreground">Your items</h2>
          <ul className="mt-4 divide-y divide-border/40">
            {items.map((i) => (
              <li key={i.slug} className="flex items-center gap-3 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={i.image ?? "/collections/tulips.jpeg"}
                  alt={i.name}
                  className="h-14 w-12 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-medium text-foreground">{i.name}</p>
                  <p className="text-xs text-muted-foreground">Qty {i.quantity}</p>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {formatPaise(i.pricePaise * i.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside className="h-fit rounded-2xl border border-border/40 bg-white/70 p-6 lg:sticky lg:top-28">
        <h2 className="font-heading text-lg font-semibold text-foreground">Order total</h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <dt>Subtotal ({count} item{count === 1 ? "" : "s"})</dt>
            <dd className="font-medium text-foreground">{formatPaise(subtotalPaise)}</dd>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <dt>Shipping &amp; taxes</dt>
            <dd className="font-medium text-foreground">Calculated securely</dd>
          </div>
        </dl>
        <div className="mt-5 flex justify-between border-t border-border/40 pt-4">
          <span className="font-semibold text-foreground">Payable</span>
          <span className="text-lg font-bold text-foreground">{formatPaise(subtotalPaise)}</span>
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </p>
        )}
        {paymentEnabled === false && (
          <p className="mt-4 rounded-xl bg-secondary/40 px-3 py-2 text-xs text-secondary-foreground">
            Online payments are being set up. Please check back shortly.
          </p>
        )}

        <button
          type="button"
          onClick={handlePay}
          disabled={submitting || paymentEnabled === false}
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold tracking-wide text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Lock size={16} />
          )}
          {submitting ? "Processing…" : "Pay securely"}
        </button>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-[0.7rem] text-muted-foreground">
          <ShieldCheck size={13} /> Secured by Razorpay · UPI, cards, netbanking
        </p>
      </aside>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  className,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <span className="text-xs font-medium text-muted-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      <input
        value={value}
        onChange={onChange}
        className="h-11 rounded-xl border border-border/60 bg-white/80 px-3.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
}
