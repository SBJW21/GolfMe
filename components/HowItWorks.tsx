"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type Step = { title: string; text: string };

/**
 * The three steps. They fade in one after another when scrolled into view, then the
 * highlight moves from step to step with a progress bar. Hover, focus or tap a step to
 * jump to it. Animation is switched off for people who prefer reduced motion.
 */
const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribeReduced(onChange: () => void) {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function subscribeNever() {
  return () => {};
}

export default function HowItWorks({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
  // False on the server and first render, so the content is never hidden without JavaScript.
  const mounted = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
  const armed = mounted && !reduce;

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  const hidden = armed && !visible;
  const autoplay = (visible || !armed) && !paused && !reduce;

  return (
    <div ref={ref} className="grid gap-4 md:grid-cols-3">
      {steps.map((s, i) => {
        const on = active === i;
        return (
          <div
            key={s.title}
            tabIndex={0}
            onClick={() => setActive(i)}
            onMouseEnter={() => {
              setActive(i);
              setPaused(true);
            }}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => {
              setActive(i);
              setPaused(true);
            }}
            onBlur={() => setPaused(false)}
            style={{ transitionDelay: hidden || !visible ? "0ms" : `${i * 140}ms` }}
            className={`glass relative cursor-default overflow-hidden rounded-2xl p-5 transition duration-500 ${
              hidden ? "translate-y-5 opacity-0" : "translate-y-0 opacity-100"
            } ${on ? "!border-lime/70 md:-translate-y-1" : ""}`}
          >
            <span className="absolute inset-x-0 top-0 h-[3px] bg-white/10">
              {on && (
                <span
                  key={`${active}-${autoplay}`}
                  className={`block h-full origin-left bg-lime ${
                    autoplay ? "step-bar" : ""
                  }`}
                  onAnimationEnd={() => setActive((a) => (a + 1) % steps.length)}
                />
              )}
            </span>
            <p
              className={`font-display origin-left text-4xl transition duration-500 ${
                on ? "scale-125 text-lime" : "scale-100 text-lime/60"
              }`}
            >
              {i + 1}
            </p>
            <h3 className="mt-2 text-lg font-bold">{s.title}</h3>
            <p className="mt-1 text-sm text-white/80">{s.text}</p>
          </div>
        );
      })}
    </div>
  );
}
