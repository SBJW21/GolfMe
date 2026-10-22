/**
 * Layout for a coach's own shareable page. There is no Golf Me menu, so the page works as the
 * coach's own booking page. The only link out is the "Powered by Golf Me" mark in the footer.
 */
export default function SoloLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <div className="flex-1">{children}</div>
      <footer className="border-t border-white/10 px-4 py-4 text-center">
        <a
          href="/"
          target="_blank"
          rel="noopener"
          className="inline-flex items-baseline gap-1.5 text-[0.65rem] uppercase tracking-[0.16em] text-white/50 hover:text-white"
        >
          Powered by
          <span className="font-display text-sm normal-case tracking-normal text-white">
            Golf <span className="text-lime">Me</span>
          </span>
        </a>
      </footer>
    </>
  );
}
