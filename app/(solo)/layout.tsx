/**
 * Layout for a coach's own shareable page. There is no Golf Me menu and no links to the rest
 * of the site, so the page works as the coach's own booking page.
 */
export default function SoloLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <div className="flex-1">{children}</div>
      <footer className="border-t border-white/10 px-4 py-6 text-center text-xs uppercase tracking-[0.16em] text-white/45">
        Powered by <span className="font-display not-italic text-white/70">Golf Me</span>
      </footer>
    </>
  );
}
