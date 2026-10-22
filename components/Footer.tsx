import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-8 text-sm text-white/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; 2026 Golf Me</p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/coaches" className="hover:text-lime">
            Find a coach
          </Link>
          <Link href="/golf-lessons" className="hover:text-lime">
            Suburbs
          </Link>
          <Link href="/courses" className="hover:text-lime">
            Courses
          </Link>
          <Link href="/blog" className="hover:text-lime">
            Blog
          </Link>
          <Link href="/learn" className="hover:text-lime">
            Learn
          </Link>
          <Link href="/faq" className="hover:text-lime">
            FAQ
          </Link>
          <Link href="/for-coaches" className="hover:text-lime">
            For coaches
          </Link>
        </nav>
      </div>
    </footer>
  );
}
