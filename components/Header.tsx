import Link from "next/link";
import ExploreMenu from "./ExploreMenu";
import PinMark from "./PinMark";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-1.5 whitespace-nowrap font-display text-xl text-white min-[400px]:gap-2 min-[400px]:text-2xl sm:text-3xl">
          <PinMark className="h-6 w-auto min-[400px]:h-7 sm:h-8" />
          <span>
            Golf <span className="text-lime">Me</span>
          </span>
        </Link>
        <nav className="flex items-center gap-3 whitespace-nowrap text-[13px] font-semibold sm:gap-5 sm:text-sm">
          <Link href="/coaches" className="hover:text-lime">
            Find a coach
          </Link>
          <ExploreMenu />
          <Link href="/my-golf" className="hover:text-lime">
            My Golf
          </Link>
          <Link
            href="/for-coaches"
            className="pill-arrow hidden rounded-lg border border-white/40 px-3 py-1.5 hover:border-lime hover:text-lime sm:inline"
          >
            For coaches
          </Link>
        </nav>
      </div>
    </header>
  );
}
