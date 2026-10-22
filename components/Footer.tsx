import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-8 text-sm text-white/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; 2026 Golf Me</p>
        <nav className="flex gap-5">
          <Link href="/coaches" className="hover:text-lime">
            Find a coach
          </Link>
          <Link href="/learn" className="hover:text-lime">
            Learn
          </Link>
          <Link href="/for-coaches" className="hover:text-lime">
            For coaches
          </Link>
        </nav>
      </div>
    </footer>
  );
}
