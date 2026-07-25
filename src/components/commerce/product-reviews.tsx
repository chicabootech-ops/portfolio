"use client";

import { FormEvent, useEffect, useState } from "react";

type Review = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  author_name: string | null;
  is_verified_purchase: boolean | null;
  created_at: string;
};

export function ProductReviews({ slug }: { slug: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/reviews/${encodeURIComponent(slug)}`)
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]));
  }, [slug]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    const response = await fetch(`/api/reviews/${encodeURIComponent(slug)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, title: title || null, body: body || null }),
    }).catch(() => null);
    const data = await response?.json().catch(() => ({}));
    if (response?.ok) {
      setTitle("");
      setBody("");
      setMessage("Thanks! Your review was submitted for approval.");
    } else if (response?.status === 401) {
      setMessage("Please sign in to submit a review.");
    } else {
      setMessage(data?.detail ?? "We couldn't submit your review.");
    }
    setSubmitting(false);
  }

  return (
    <section className="mt-16 border-t border-border/40 pt-10">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="text-2xl font-semibold">Customer reviews</h2>
          {reviews.length ? (
            <div className="mt-6 space-y-6">
              {reviews.map((review) => (
                <article key={review.id} className="rounded-2xl border border-border/40 p-5">
                  <p className="text-primary" aria-label={`${review.rating} out of 5 stars`}>
                    {"★".repeat(review.rating)}
                    <span className="text-border">{"★".repeat(5 - review.rating)}</span>
                  </p>
                  {review.title ? <h3 className="mt-2 font-semibold">{review.title}</h3> : null}
                  {review.body ? (
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{review.body}</p>
                  ) : null}
                  <p className="mt-3 text-xs text-muted-foreground">
                    {review.author_name ?? "Customer"}
                    {review.is_verified_purchase ? " · Verified purchase" : ""}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm text-muted-foreground">
              No reviews yet. Be the first to share your thoughts.
            </p>
          )}
        </div>

        <form onSubmit={submit} className="rounded-2xl bg-secondary/20 p-6">
          <h3 className="text-lg font-semibold">Write a review</h3>
          <label className="mt-5 block text-sm font-medium">
            Rating
            <select
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
              className="mt-2 block w-full rounded-xl border border-border/50 bg-background px-3 py-2"
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} stars
                </option>
              ))}
            </select>
          </label>
          <label className="mt-4 block text-sm font-medium">
            Title (optional)
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={160}
              className="mt-2 block w-full rounded-xl border border-border/50 bg-background px-3 py-2"
            />
          </label>
          <label className="mt-4 block text-sm font-medium">
            Review (optional)
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              maxLength={4000}
              rows={4}
              className="mt-2 block w-full rounded-xl border border-border/50 bg-background px-3 py-2"
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit review"}
          </button>
          {message ? <p className="mt-3 text-sm text-muted-foreground">{message}</p> : null}
        </form>
      </div>
    </section>
  );
}
