import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-display text-3xl text-white">
          Golf <span className="text-lime">Me</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm font-semibold">
          <Link href="/coaches" className="hover:text-lime">
            Find a coach
          </Link>
          <Link href="/learn" className="hover:text-lime">
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
