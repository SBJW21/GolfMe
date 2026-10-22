"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Scrollable area with soft fades at the top and bottom edges. The fades show only while
 * there is more to scroll in that direction. `maxClass` sets the height limit.
 */
export default function FadeScroll({
  children,
  maxClass,
  fadeFrom = "#101010",
  className = "",
}: {
  children: React.ReactNode;
  maxClass: string;
  fadeFrom?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(false);
  const [bottom, setBottom] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setTop(el.scrollTop > 4);
    setBottom(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    Array.from(el.children).forEach((c) => ro.observe(c));
    return () => ro.disconnect();
  }, [update, children]);

  return (
    <div className={`relative ${className}`}>
      <div ref={ref} onScroll={update} className={`${maxClass} overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}>
        {children}
      </div>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-10 transition-opacity ${top ? "opacity-100" : "opacity-0"}`}
        style={{ background: `linear-gradient(to bottom, ${fadeFrom}, transparent)` }}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-14 transition-opacity ${bottom ? "opacity-100" : "opacity-0"}`}
        style={{ background: `linear-gradient(to top, ${fadeFrom}, transparent)` }}
      />
    </div>
  );
}
