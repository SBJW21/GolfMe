import Link from "next/link";
import type { Slot } from "@/lib/types";

function dayLabel(date: string) {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function timeLabel(time: string) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(2000, 0, 1, h, m);
  return d.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" });
}

/** Open lesson times grouped by day. Each time links to `${bookPath}?slot=...`. */
export default function SlotPicker({
  slots,
  bookPath,
  sidebar = false,
}: {
  slots: Slot[];
  bookPath: string;
  /** In the narrow desktop sidebar the list scrolls inside its box. Everywhere else the page scrolls. */
  sidebar?: boolean;
}) {
  const byDay = new Map<string, string[]>();
  for (const s of slots) {
    const [date, time] = s.startsAt.split("T");
    byDay.set(date, [...(byDay.get(date) ?? []), time]);
  }

  if (byDay.size === 0) {
    return (
      <p className="mt-4 text-sm text-white/70">
        No times are open right now. Please check back soon.
      </p>
    );
  }

  return (
    <div
      className={
        sidebar
          ? "mt-4 grid gap-4 lg:max-h-[420px] lg:overflow-y-auto lg:overscroll-contain lg:pr-1"
          : "mt-4 grid gap-4 sm:grid-cols-2 sm:gap-x-6"
      }
    >
      {Array.from(byDay.entries()).map(([date, times]) => (
        <div key={date}>
          <p className="mb-1.5 text-sm font-semibold">{dayLabel(date)}</p>
          <div className="flex flex-wrap gap-2">
            {times.map((t) => (
              <Link
                key={t}
                href={`${bookPath}?slot=${encodeURIComponent(`${date}T${t}`)}`}
                className="rounded-lg border border-white/30 px-3 py-1.5 text-sm hover:border-lime hover:bg-lime hover:text-black"
              >
                {timeLabel(t)}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
