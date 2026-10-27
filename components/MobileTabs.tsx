"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/coaches", label: "Find a coach", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8 8a8 8 0 0 1 16 0" },
  { href: "/courses", label: "Find a course", icon: "M6 21V3m0 1h11l-2.5 4L17 12H6" },
  { href: "/my-golf", label: "My Golf", icon: "M4 20V10m6 10V4m6 16v-7m4 7H2" },
];

export default function MobileTabs() {
  const path = usePathname();
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-white/10 bg-black/90 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden">
      {tabs.map((t) => {
        const on = path === t.href || path.startsWith(`${t.href}/`);
        return (
          <Link key={t.href} href={t.href} aria-current={on ? "page" : undefined} className={`flex flex-col items-center gap-1 px-1 pb-2.5 pt-2 text-[11px] font-bold ${on ? "text-lime" : "text-white/80"}`}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={t.icon} />
            </svg>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
