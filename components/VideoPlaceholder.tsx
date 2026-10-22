/** Holding tile for a video that has not been added yet. */
export default function VideoPlaceholder({
  title,
  meta,
  label = "Coming soon",
}: {
  title: string;
  meta?: string;
  label?: string;
}) {
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="relative flex aspect-video items-center justify-center bg-[radial-gradient(circle_at_50%_40%,#27340f,#0b0d08_75%)]">
        <svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
          {Array.from({ length: 5 }, (_, i) => (
            <ellipse key={i} cx="100" cy="150" rx={50 + i * 34} ry={36 + i * 22} fill="none" stroke="#c6ff3d" strokeOpacity={0.2 - i * 0.03} />
          ))}
        </svg>
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-lime/90 text-black">
          <svg viewBox="0 0 24 24" className="ml-0.5 h-6 w-6" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white/80">
          {label}
        </span>
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold">{title}</p>
        {meta && <p className="mt-0.5 text-xs text-white/60">{meta}</p>}
      </div>
    </div>
  );
}
