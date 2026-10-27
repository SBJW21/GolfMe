import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-8 text-sm text-white/60">
      <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl text-white">
            Golf <span className="text-lime">Me</span>
          </p>
          <p className="mt-2 max-w-xs">Compare Sydney golf coaches and book online.</p>
        </div>
        {[
          ["Play", [["/coaches", "Find a coach"], ["/courses", "Find a course"], ["/my-golf", "My Golf"]]],
          ["Learn", [["/learn", "Learn"], ["/blog", "Blog"], ["/golf-lessons", "Lessons by suburb"], ["/faq", "FAQ"]]],
          ["Coaches", [["/for-coaches", "For coaches"]]],
        ].map(([title, links]) => (
          <div key={title as string}>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">{title as string}</p>
            <ul className="mt-2 grid gap-1.5">
              {(links as string[][]).map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-lime">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-6 max-w-6xl text-xs text-white/45">&copy; 2026 Golf Me</p>
    </footer>
  );
}
