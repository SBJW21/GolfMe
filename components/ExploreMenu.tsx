"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const items = [
  { href: "/learn", label: "Learn" },
  { href: "/courses", label: "Courses" },
  { href: "/blog", label: "Blog" },
];

export default function ExploreMenu() {
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

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex items-center gap-1 hover:text-lime"
      >
        Explore
        <span aria-hidden="true" className={`text-[9px] transition ${open ? "rotate-180" : ""}`}>
          &#9660;
        </span>
      </button>
      {open && (
        <ul className="absolute right-0 top-full z-40 mt-3 min-w-36 overflow-hidden rounded-xl border border-white/15 bg-[#07090d] py-1 shadow-2xl">
          {items.map((i) => (
            <li key={i.href}>
              <Link
                href={i.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm hover:bg-white/10 hover:text-lime"
              >
                {i.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
