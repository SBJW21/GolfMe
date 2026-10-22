export default function Stars({
  rating,
  count,
}: {
  rating: number | null;
  count?: number;
}) {
  if (rating === null) {
    return <span className="text-sm text-white/60">No reviews yet</span>;
  }
  const rounded = Math.round(rating);
  return (
    <span
      className="inline-flex items-center gap-1 text-sm"
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
    >
      <span className="text-lime" aria-hidden="true">
        {"★".repeat(rounded)}
        <span className="text-white/25">{"★".repeat(5 - rounded)}</span>
      </span>
      <span className="font-semibold">{rating.toFixed(1)}</span>
      {typeof count === "number" && (
        <span className="text-white/60">({count})</span>
      )}
    </span>
  );
}
