"use client";

import { useEffect, useRef, useState } from "react";
import { focusAreas } from "@/lib/data";

/**
 * Focus filter as a tick list. Looks like a field, opens a panel of checkboxes.
 * Ticked options are sent with the form as repeated "focus" values.
 */
export default function FocusPicker({
  name,
  defaultValue = [],
}: {
  name: string;
  defaultValue?: string[];
}) {
  const [picked, setPicked] = useState<string[]>(defaultValue);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const toggle = (f: string) =>
    setPicked((p) => (p.includes(f) ? p.filter((x) => x !== f) : [...p, f]));

  const label =
    picked.length === 0
      ? "What do you want to work on?"
      : picked.length <= 2
        ? picked.join(", ")
        : `${picked.length} areas selected`;

  return (
    <div ref={box} className="relative text-left">
      {picked.map((f) => (
        <input key={f} type="hidden" name={name} value={f} />
      ))}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        className="field-input flex items-center gap-2 text-left"
      >
        <span className={`min-w-0 flex-1 truncate ${picked.length ? "" : "text-black/60"}`}>
          {label}
        </span>
        <span aria-hidden="true" className="shrink-0 text-xs text-black/50">
          {open ? "▲" : "▼"}
        </span>
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-xl border border-white/15 bg-[#07090d] p-2 text-white shadow-2xl">
          <ul className="grid grid-cols-2 gap-0.5">
            {focusAreas.map((f) => {
              const on = picked.includes(f);
              return (
                <li key={f}>
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold hover:bg-white/10">
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggle(f)}
                      className="h-5 w-5 shrink-0 accent-[#c6ff3d]"
                    />
                    {f}
                  </label>
                </li>
              );
            })}
          </ul>
          <div className="mt-1 flex items-center justify-between border-t border-white/10 px-3 pt-2 text-sm">
            <button
              type="button"
              onClick={() => setPicked([])}
              className="text-white/70 underline-offset-4 hover:underline"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="font-bold text-lime underline-offset-4 hover:underline"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
