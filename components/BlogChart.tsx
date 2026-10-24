export type ChartRow = { label: string; min: number; max?: number; note?: string };
export type ChartSpec = {
  title: string;
  /** Short line under the chart saying where the figures come from. */
  caption: string;
  /** Text put before each number, for example "$". */
  prefix?: string;
  /** Text put after each number, for example " clubs". */
  suffix?: string;
  /** Axis start and end. */
  axis: [number, number];
  /** Axis tick values. */
  ticks: number[];
  /** "range" draws a bar from min to max (a dot when they match). "bar" draws a bar from the axis start. */
  kind: "range" | "bar";
  rows: ChartRow[];
};

function fmt(n: number, prefix = "", suffix = "") {
  const t = Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0$/, "");
  return `${prefix}${t}${suffix}`;
}

/** Brand-coloured horizontal chart built from plain HTML so it stays readable on a phone. */
export default function BlogChart({ spec }: { spec: ChartSpec }) {
  const [a, b] = spec.axis;
  const pct = (v: number) => `${((v - a) / (b - a)) * 100}%`;
  return (
    <figure className="glass my-2 rounded-2xl p-4 sm:p-5">
      <figcaption className="font-display text-xl text-white">{spec.title}</figcaption>
      <ul className="mt-4 grid gap-3.5">
        {spec.rows.map((r) => {
          const hi = r.max ?? r.min;
          const dot = spec.kind === "range" && hi === r.min;
          const from = spec.kind === "bar" ? a : r.min;
          const value = r.max !== undefined && r.max !== r.min ? `${fmt(r.min, spec.prefix)} to ${fmt(r.max, spec.prefix, spec.suffix)}` : fmt(r.min, spec.prefix, spec.suffix);
          return (
            <li key={r.label}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="text-white/90">{r.label}</span>
                <span className="shrink-0 font-bold text-lime">{value}</span>
              </div>
              <div className="relative mt-1.5 h-3 rounded-full bg-white/10" role="img" aria-label={`${r.label}: ${value}`}>
                {dot ? (
                  <span
                    className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime shadow-[0_0_10px_rgba(198,255,61,0.6)]"
                    style={{ left: pct(r.min) }}
                  />
                ) : (
                  <span
                    className="absolute inset-y-0 rounded-full bg-lime"
                    style={{ left: pct(from), width: `calc(${pct(spec.kind === "bar" ? r.min : hi)} - ${pct(from)})`, minWidth: "0.75rem" }}
                  />
                )}
              </div>
              {r.note && <p className="mt-1 text-xs text-white/55">{r.note}</p>}
            </li>
          );
        })}
      </ul>
      <div className="relative mt-3 h-5 border-t border-white/15 text-[11px] text-white/55" aria-hidden="true">
        {spec.ticks.map((t) => (
          <span key={t} className="absolute top-1" style={{ left: pct(t), transform: t === a ? "none" : t === b ? "translateX(-100%)" : "translateX(-50%)" }}>
            {fmt(t, spec.prefix)}
          </span>
        ))}
      </div>
      <p className="mt-2 text-xs text-white/60">{spec.caption}</p>
    </figure>
  );
}
