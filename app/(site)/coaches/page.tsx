import type { Metadata } from "next";
import CoachCard from "@/components/CoachCard";
import SampleNotice from "@/components/SampleNotice";
import FocusPicker from "@/components/FocusPicker";
import AreaPicker from "@/components/AreaPicker";
import { areaCounts, suburbInArea } from "@/lib/areas";
import { averageRating } from "@/lib/data";
import { loadCoaches } from "@/lib/repo";
import type { FocusArea } from "@/lib/types";

export const metadata: Metadata = {
  title: "Find a golf coach in Sydney",
  description:
    "Compare Sydney golf coaches by suburb, price and focus area. Read reviews and book online.",
};

const budgets = [
  { label: "Any budget", max: 0 },
  { label: "Up to $80", max: 8000 },
  { label: "Up to $100", max: 10000 },
  { label: "Up to $120", max: 12000 },
  { label: "Up to $175", max: 17500 },
];

function all(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value : value ? [value] : []).filter(Boolean);
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CoachesPage(props: PageProps<"/coaches">) {
  const sp = await props.searchParams;
  const area = first(sp.area) ?? "";
  const focus = all(sp.focus);
  const max = Number(first(sp.max) ?? 0) || 0;
  const sort = first(sp.sort) ?? "rating";
  const { coaches, isSample } = await loadCoaches();

  let results = coaches.filter(
    (c) =>
      (!area || suburbInArea(c.suburb, area)) &&
      (focus.length === 0 || focus.some((f) => c.focus.includes(f as FocusArea))) &&
      (!max || c.priceCents <= max),
  );

  results = [...results].sort((a, b) => {
    if (sort === "price") return a.priceCents - b.priceCents;
    return (averageRating(b) ?? 0) - (averageRating(a) ?? 0);
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-[clamp(2.2rem,7vw,3.4rem)]">
        Find a coach
      </h1>
      <p className="mt-2 text-white/80">Golf coaches across Sydney.</p>

      <form method="GET" className="glass relative z-10 mt-6 grid gap-3 rounded-2xl p-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="text-sm font-semibold">
          Area
          <div className="mt-1">
            <AreaPicker
              name="area"
              defaultValue={area}
              counts={areaCounts(coaches.map((c) => c.suburb))}
            />
          </div>
        </div>
        <div className="text-sm font-semibold">
          Focus
          <div className="mt-1">
            <FocusPicker name="focus" defaultValue={focus} />
          </div>
        </div>
        <label className="text-sm font-semibold">
          Budget
          <select name="max" defaultValue={String(max)} className="field-input mt-1">
            {budgets.map((b) => (
              <option key={b.max} value={b.max}>
                {b.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Sort by
          <select name="sort" defaultValue={sort} className="field-input mt-1">
            <option value="rating">Highest rated</option>
            <option value="price">Lowest price</option>
          </select>
        </label>
        <button type="submit" className="btn self-end">
          Search
        </button>
      </form>

      <div className="mt-6">
        <SampleNotice show={isSample} />
      </div>

      <p className="mt-6 text-sm text-white/70" aria-live="polite">
        {results.length} {results.length === 1 ? "coach" : "coaches"} found
      </p>

      {results.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-white/15 p-6 text-white/80">
          No coaches match those filters. Try a different suburb or budget.
        </p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((c) => (
            <CoachCard key={c.slug} coach={c} />
          ))}
        </div>
      )}
    </main>
  );
}
