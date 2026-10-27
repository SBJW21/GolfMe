import type { ReactNode } from "react";

/** One collapsible section. Native details element, so it works without scripts. */
export default function Accordion({ icon, title, overview, open = false, big = false, children }: { icon: ReactNode; title: string; overview: ReactNode; open?: boolean; big?: boolean; children: ReactNode }) {
  return (
    <details open={open} className="group overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04] open:border-lime/50">
      <summary className="flex cursor-pointer list-none items-center gap-3 p-4 sm:gap-4 sm:p-5 [&::-webkit-details-marker]:hidden">
        <span className={`grid shrink-0 place-items-center rounded-full bg-lime/15 text-lime ${big ? "h-14 w-14" : "h-11 w-11"}`}>{icon}</span>
        <span className="min-w-0 flex-1">
          <span className="font-display block text-[1.6rem] leading-none">{title}</span>
          <span className="mt-1 block text-sm text-white/70">{overview}</span>
        </span>
        <span aria-hidden="true" className="mr-1 h-2.5 w-2.5 shrink-0 rotate-45 border-b-2 border-r-2 border-lime transition group-open:-rotate-[135deg]" />
      </summary>
      <div className="px-4 pb-5 sm:px-5">{children}</div>
    </details>
  );
}

const svg = (d: string, size = "h-6 w-6") => (
  <svg viewBox="0 0 24 24" className={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
export const CapIcon = () => svg("M2 9l10-5 10 5-10 5L2 9Zm5 3v4.5c0 1 2.2 2.5 5 2.5s5-1.5 5-2.5V12M22 9v6");
export const FlagIcon = () => svg("M6 21V3m0 1h11l-2.5 4L17 12H6");
export const PencilIcon = () => svg("M4 20l1-4L16.5 4.5a2 2 0 0 1 3 3L8 19l-4 1Zm10-13 3 3");
export const SmileIcon = () => (
  <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2.5 4 2.5S16 14 16 14" />
    <path d="M9 9.5h.01M15 9.5h.01" strokeWidth="2.6" />
  </svg>
);
