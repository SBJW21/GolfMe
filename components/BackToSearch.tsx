"use client";

export default function BackToSearch() {
  return (
    <button type="button" className="btn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
      Find a coach
    </button>
  );
}
