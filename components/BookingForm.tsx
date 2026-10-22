"use client";

import { useState } from "react";

export default function BookingForm({
  slug,
  slot,
  source = "site",
}: {
  slug: string;
  slot: string;
  /** "solo" when booked from a coach's own page, so the customer stays on that page. */
  source?: "site" | "solo";
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          slot,
          source,
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 text-ink">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          Name <span className="text-[#d4351c]">*</span>
          <input
            name="name"
            required
            autoComplete="name"
            className="field-input mt-1"
          />
        </label>
        <label className="text-sm font-semibold">
          Email <span className="text-[#d4351c]">*</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="field-input mt-1"
          />
        </label>
      </div>
      <label className="text-sm font-semibold">
        Mobile <span className="text-[#d4351c]">*</span>
        <input
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          className="field-input mt-1"
        />
      </label>
      {error && (
        <p role="alert" className="text-sm text-[#d4351c]">
          {error}
        </p>
      )}
      <button type="submit" className="btn" disabled={busy}>
        {busy ? "Please wait" : "Continue to payment"}
      </button>
    </form>
  );
}
