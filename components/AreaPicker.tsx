"use client";

import { useRef, useState } from "react";
import { areas, OTHER_AREA_ID } from "@/lib/areas";
import {
  AREA_CELLS,
  AREA_POINTS,
  BOTANY_PATH,
  HARBOUR_PATH,
  LAND_PATH,
  MAP_HEIGHT,
  MAP_WIDTH,
  RIVERS,
} from "@/lib/mapData";
import PinMark from "./PinMark";

const WATER = "#07101c";
const LAND = "#141c0d";
const LIME = "198,255,61";

// The mouse pointer turns into a golf flag. The tip of the pole is the click point.
const FLAG_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">' +
  '<path d="M7 5v34" stroke="#000" stroke-width="5.5" stroke-linecap="round"/>' +
  '<path d="M7 5v34" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>' +
  '<path d="M9 6l20 7.5L9 21z" fill="#c6ff3d" stroke="#000" stroke-width="2.5" stroke-linejoin="round"/>' +
  '<circle cx="7" cy="39" r="2.6" fill="#fff" stroke="#000" stroke-width="1.5"/></svg>';
const FLAG_CURSOR = `url("data:image/svg+xml,${encodeURIComponent(FLAG_SVG)}") 7 39, crosshair`;

// Where each name sits next to its dot: [x offset, y offset, anchor]. Crowded areas get nudged.
const LABEL_SPOTS: Record<string, [number, number, "start" | "middle" | "end"]> = {
  paddington: [9, 4, "start"],
  "sydney-cbd": [-9, 4, "end"],
  alexandria: [0, 19, "middle"],
  bondi: [9, 4, "start"],
  coogee: [9, 4, "start"],
  manly: [9, 4, "start"],
  mosman: [9, 4, "start"],
  balmain: [-9, 4, "end"],
  "lane-cove": [-9, -4, "end"],
  marrickville: [-9, 4, "end"],
  "dee-why": [9, 4, "start"],
  "mona-vale": [9, 4, "start"],
  rockdale: [0, 19, "middle"],
};

function labelFor(id: string) {
  if (id === "") return "Anywhere in Sydney";
  if (id === OTHER_AREA_ID) return "Other Sydney areas";
  return areas.find((a) => a.id === id)?.label ?? "Anywhere in Sydney";
}

function coachText(n: number) {
  if (n === 0) return "No coaches here yet";
  return `${n} ${n === 1 ? "coach" : "coaches"}`;
}

/**
 * Area picker. Looks like a field, opens a pop-out map of Sydney where the cursor is a flag.
 * Click an area to choose it. On a touch screen, tap to preview and tap Choose to confirm.
 * A plain list is available inside the pop-out for anyone who prefers it.
 * The chosen area is sent with the form as a hidden field.
 */
export default function AreaPicker({
  name,
  defaultValue = "",
  counts,
}: {
  name: string;
  defaultValue?: string;
  counts: Record<string, number>;
}) {
  const [value, setValue] = useState(defaultValue);
  const [hover, setHover] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pointerType = useRef("mouse");

  function open() {
    dialogRef.current?.showModal();
    // On a small screen the map is wider than the screen, so start centred on the harbour.
    const el = scrollRef.current;
    const hub = AREA_POINTS["sydney-cbd"];
    if (el && hub) {
      el.scrollLeft = (hub[0] / MAP_WIDTH) * el.scrollWidth - el.clientWidth / 2;
      el.scrollTop = (hub[1] / MAP_HEIGHT) * el.scrollHeight - el.clientHeight / 2;
    }
  }

  function close() {
    dialogRef.current?.close();
  }

  function choose(id: string) {
    setValue(id);
    close();
  }

  function onCellClick(id: string) {
    if (pointerType.current !== "mouse" && preview !== id) {
      setPreview(id);
      return;
    }
    choose(id);
  }

  const shown = hover ?? preview ?? value;
  const shownCount = counts[shown] ?? 0;
  const confirmable = preview !== null && preview !== value;

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-label={`Area: ${labelFor(value)}. Open the map to choose`}
        className="field-input flex items-center gap-2 text-left"
      >
        <PinMark className="h-5 w-auto shrink-0" />
        <span className="min-w-0 flex-1 truncate">{labelFor(value)}</span>
        <span className="shrink-0 text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-black/50">
          Map
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="area-map-title"
        onClose={() => {
          setHover(null);
          setPreview(null);
          setTip(null);
        }}
        className="m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 text-left text-white backdrop:bg-black/75 backdrop:backdrop-blur-sm"
      >
        <div
          className="flex h-full items-center justify-center sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="pop-in flex max-h-full w-full max-w-5xl flex-col overflow-hidden border border-white/15 bg-[#07090d] shadow-2xl sm:rounded-3xl">
            <div className="flex items-start justify-between gap-4 px-5 pb-3 pt-5">
              <div>
                <h2
                  id="area-map-title"
                  className="font-display text-[clamp(1.7rem,5vw,2.4rem)]"
                >
                  Where do you want lessons?
                </h2>
                <p className="mt-1 text-sm text-white/70">
                  <span className="hidden sm:inline">
                    Move the flag over the map and click your area.
                  </span>
                  <span className="sm:hidden">Tap your area, then tap Choose.</span>
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close map"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/25 text-xl leading-none hover:border-lime hover:text-lime"
              >
                &times;
              </button>
            </div>

            <div
              ref={scrollRef}
              className="relative min-h-0 flex-1 overflow-auto border-y border-white/10"
              style={{ background: `linear-gradient(90deg, ${LAND} 50%, ${WATER} 50%)` }}
              onPointerDown={(e) => {
                pointerType.current = e.pointerType;
              }}
              onPointerMove={(e) => {
                if (e.pointerType === "mouse") setTip({ x: e.clientX, y: e.clientY });
              }}
              onPointerLeave={() => setTip(null)}
            >
              <svg
                viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                role="group"
                aria-label="Map of Sydney. Each shape is an area you can choose."
                className="block h-auto w-[900px] max-w-none md:mx-auto md:h-[min(calc(100dvh-17rem),760px)] md:w-auto md:max-w-full"
                style={{ cursor: FLAG_CURSOR }}
              >
                <defs>
                  <clipPath id="gm-land">
                    <path d={LAND_PATH} />
                  </clipPath>
                  <pattern id="gm-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M60 0H0V60" fill="none" stroke="#fff" strokeOpacity="0.045" />
                  </pattern>
                </defs>

                <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill={WATER} />
                <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#gm-grid)" />
                <path d={LAND_PATH} fill={LAND} stroke={`rgba(${LIME},0.55)`} strokeWidth="2" />

                <g clipPath="url(#gm-land)">
                  {areas.map((a) => {
                    const d = AREA_CELLS[a.id];
                    if (!d) return null;
                    const isSelected = value === a.id;
                    const isActive = shown === a.id;
                    const has = (counts[a.id] ?? 0) > 0;
                    const fill = isSelected
                      ? `rgba(${LIME},0.4)`
                      : isActive
                        ? `rgba(${LIME},0.24)`
                        : has
                          ? `rgba(${LIME},0.07)`
                          : "rgba(255,255,255,0)";
                    return (
                      <path
                        key={a.id}
                        d={d}
                        role="button"
                        tabIndex={0}
                        aria-label={`${a.label}. ${coachText(counts[a.id] ?? 0)}`}
                        aria-pressed={isSelected}
                        fill={fill}
                        stroke={isActive ? `rgb(${LIME})` : "rgba(255,255,255,0.16)"}
                        strokeWidth={isActive ? 2 : 1}
                        strokeLinejoin="round"
                        className="outline-none transition-[fill] duration-150"
                        onPointerEnter={(e) => {
                          if (e.pointerType === "mouse") setHover(a.id);
                        }}
                        onPointerLeave={(e) => {
                          if (e.pointerType === "mouse") setHover(null);
                        }}
                        onFocus={() => setHover(a.id)}
                        onBlur={() => setHover(null)}
                        onClick={() => onCellClick(a.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            choose(a.id);
                          }
                        }}
                      />
                    );
                  })}
                </g>

                {/* Water drawn over the land: harbour, bays and rivers. */}
                <g style={{ pointerEvents: "none" }}>
                  {RIVERS.map((r, i) => (
                    <path
                      key={i}
                      d={r.d}
                      fill="none"
                      stroke={WATER}
                      strokeWidth={r.w}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ))}
                  <path d={BOTANY_PATH} fill={WATER} stroke={`rgba(${LIME},0.4)`} strokeWidth="1.5" />
                  <path d={HARBOUR_PATH} fill={WATER} stroke={`rgba(${LIME},0.4)`} strokeWidth="1.5" />

                  {areas.map((a) => {
                    const p = AREA_POINTS[a.id];
                    if (!p) return null;
                    const has = (counts[a.id] ?? 0) > 0;
                    return (
                      <g key={a.id}>
                        {has && (
                          <circle
                            cx={p[0]}
                            cy={p[1]}
                            r="6"
                            fill={`rgb(${LIME})`}
                            className="animate-ping [transform-box:fill-box] origin-center motion-reduce:animate-none"
                            opacity="0.5"
                          />
                        )}
                        <circle
                          cx={p[0]}
                          cy={p[1]}
                          r={has ? 5 : 3}
                          fill={has ? `rgb(${LIME})` : "rgba(255,255,255,0.35)"}
                          stroke="#000"
                          strokeWidth="1.5"
                        />
                      </g>
                    );
                  })}

                  {areas.map((a) => {
                    const p = AREA_POINTS[a.id];
                    if (!p) return null;
                    const [dx, dy, anchor] = LABEL_SPOTS[a.id] ?? [0, -10, "middle"];
                    return (
                      <text
                        key={`t-${a.id}`}
                        x={p[0] + dx}
                        y={p[1] + dy}
                        textAnchor={anchor}
                        fontSize="11.5"
                        fontWeight="700"
                        fill="#fff"
                        fillOpacity="0.82"
                        stroke="#000"
                        strokeWidth="3.5"
                        strokeLinejoin="round"
                        paintOrder="stroke"
                      >
                        {a.label.split(",")[0]}
                      </text>
                    );
                  })}

                  <text
                    x={MAP_WIDTH - 26}
                    y={MAP_HEIGHT / 2}
                    fill="#fff"
                    fillOpacity="0.22"
                    fontSize="15"
                    letterSpacing="9"
                    textAnchor="middle"
                    transform={`rotate(90 ${MAP_WIDTH - 26} ${MAP_HEIGHT / 2})`}
                  >
                    PACIFIC OCEAN
                  </text>
                </g>
              </svg>

              {hover && tip && (
                <div
                  className="pointer-events-none fixed z-50 max-w-[16rem] rounded-xl border border-lime/60 bg-black/90 px-3 py-2 text-sm shadow-lg"
                  style={{ left: tip.x + 18, top: tip.y + 18 }}
                >
                  <p className="font-bold">{labelFor(hover)}</p>
                  <p className="text-xs text-white/65">{coachText(counts[hover] ?? 0)}</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
              <div className="min-w-0">
                <p className="truncate font-bold">
                  {shown === "" && !hover && !preview
                    ? "Anywhere in Sydney"
                    : labelFor(shown)}
                </p>
                <p className="text-xs text-white/60">
                  {shown === "" ? "All areas" : coachText(shownCount)}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                {confirmable && (
                  <button
                    type="button"
                    className="btn !px-5 !py-2 !text-sm"
                    onClick={() => choose(preview as string)}
                  >
                    Choose
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-ghost !px-4 !py-2 !text-sm"
                  onClick={() => choose("")}
                >
                  Anywhere in Sydney
                </button>
              </div>
            </div>

            <details className="border-t border-white/10 px-5 py-3 text-sm">
              <summary className="cursor-pointer text-white/70">Prefer a list?</summary>
              <select
                value={value}
                onChange={(e) => choose(e.target.value)}
                aria-label="Choose an area from a list"
                className="field-input mt-3"
              >
                <option value="">Anywhere in Sydney</option>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
                <option value={OTHER_AREA_ID}>Other Sydney areas</option>
              </select>
            </details>
          </div>
        </div>
      </dialog>
    </>
  );
}
