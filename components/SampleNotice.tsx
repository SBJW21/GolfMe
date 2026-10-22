export default function SampleNotice({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <p className="rounded-lg border border-lime/40 bg-lime/10 px-3 py-2 text-sm text-lime">
      Sample coaches, reviews and prices are shown while the platform is being built.
    </p>
  );
}
