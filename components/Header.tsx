import Link from "next/link";
import PinMark from "./PinMark";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-1.5 whitespace-nowrap font-display text-2xl text-white min-[400px]:gap-2 sm:text-3xl">
          <PinMark className="h-7 w-auto sm:h-8" />
          <span>
            Golf <span className="text-lime">Me</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 whitespace-nowrap text-sm font-semibold sm:flex" aria-label="Main">
          <Link href="/coaches" className="hover:text-lime">
            Find a coach
          </Link>
          <Link href="/courses" className="hover:text-lime">
            Find a course
          </Link>
          <Link href="/my-golf" className="hover:text-lime">
            My Golf
          </Link>
        </nav>
        <Link href="/for-coaches" className="pill-arrow rounded-lg border border-white/40 px-3 py-1.5 text-[13px] font-semibold hover:border-lime hover:text-lime sm:text-sm">
          For coaches
        </Link>
      </div>
    </header>
  );
}
