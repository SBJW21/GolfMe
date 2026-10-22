export default function SampleNotice({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <p className="text-xs uppercase tracking-[0.16em] text-white/45">
      Sample coaches, reviews and prices shown while the platform is being built
    </p>
  );
}
