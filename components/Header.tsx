import Link from "next/link";
import PinMark from "./PinMark";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2 whitespace-nowrap font-display text-2xl text-white sm:text-3xl">
          <PinMark className="h-7 w-auto sm:h-8" />
          <span>
            Golf <span className="text-lime">Me</span>
          </span>
        </Link>
        <nav className="flex items-center gap-4 whitespace-nowrap text-sm font-semibold sm:gap-5">
          <Link href="/coaches" className="hover:text-lime">
            Find a coach
          </Link>
          <Link href="/learn" className="hidden hover:text-lime sm:inline">
            Learn
          </Link>
          <Link
            href="/for-coaches"
            className="rounded-lg border border-white/40 px-3 py-1.5 hover:border-lime hover:text-lime"
          >
            For coaches
          </Link>
        </nav>
      </div>
    </header>
  );
}
