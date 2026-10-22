import PinMark from "@/components/PinMark";

/**
 * Layout for a coach's own shareable page. There is no Golf Me menu, so the page works as the
 * coach's own booking page. The only link out is the "Powered by Golf Me" mark in the footer.
 */
export default function SoloLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <div className="flex-1">{children}</div>
      <footer className="border-t border-white/10 px-4 py-6 text-center">
        <a
          href="/"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-white/55 hover:text-white"
        >
          Powered by
          <PinMark className="h-5 w-auto" />
          <span className="font-display text-xl normal-case tracking-normal text-white">
            Golf <span className="text-lime">Me</span>
          </span>
        </a>
      </footer>
    </>
  );
}
