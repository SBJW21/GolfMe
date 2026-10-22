/**
 * Golf Me map pin with a flagstick inside it: a place on the map, and a pin on the green.
 */
export default function PinMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 40"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M16 0C7.7 0 1 6.5 1 14.6 1 25 16 40 16 40s15-15 15-25.4C31 6.5 24.3 0 16 0z"
        fill="#c6ff3d"
      />
      <path d="M13 7.5h2v17h-2z" fill="#000" />
      <path d="M15 7.5 25 11.5 15 15.5z" fill="#000" />
      <ellipse cx="14" cy="25" rx="5.2" ry="1.7" fill="#000" />
    </svg>
  );
}
