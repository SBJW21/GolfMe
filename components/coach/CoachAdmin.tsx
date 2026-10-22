"use client";

import { useState } from "react";
import FadeScroll from "./FadeScroll";
import VideoPlaceholder from "@/components/VideoPlaceholder";
import { formatAud } from "@/lib/pricing";
import { hubEarnings, hubLearnVideos, hubStudents } from "@/lib/coachHub";

const TABS = ["Students", "Video hub", "Earnings", "Settings"] as const;
type Tab = (typeof TABS)[number];

const initials = (n: string) => n.split(" ").map((x) => x[0]).join("");

export default function CoachAdmin() {
  const [tab, setTab] = useState<Tab>("Students");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(hubStudents[0].id);
  const [shareTo, setShareTo] = useState(hubStudents[0].name);
  const [shared, setShared] = useState("");
  const [upload, setUpload] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState("");
  const [prefs, setPrefs] = useState({
    search: true,
    booking: true,
    reminder: true,
    daily: false,
  });

  const list = hubStudents.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));
  const student = hubStudents.find((s) => s.id === sel) ?? hubStudents[0];

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`rounded-full border px-4 py-2 text-sm font-bold ${
              tab === t ? "border-lime bg-lime text-black" : "border-white/25 hover:border-lime"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === "Students" && (
          <div className="grid gap-4 md:grid-cols-[320px_1fr]">
            <div className="glass rounded-2xl p-3">
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search students"
                className="mb-2 w-full rounded-xl border border-white/20 bg-black/70 px-3 py-2.5 text-sm"
              />
              <FadeScroll maxClass="max-h-60" fadeFrom="#141414">
                {list.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSel(s.id)}
                    className={`flex w-full items-center gap-2.5 rounded-lg border px-2 py-1.5 text-left ${
                      s.id === sel ? "border-lime/60 bg-lime/10" : "border-transparent hover:bg-white/5"
                    }`}
                  >
                    <span className="font-display flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime text-sm text-black">
                      {initials(s.name)}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold">{s.name}</span>
                    <span className="shrink-0 text-xs text-white/55">{s.suburb}</span>
                  </button>
                ))}
              </FadeScroll>
            </div>
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-4">
                <span className="font-display flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-lime text-2xl text-black">
                  {initials(student.name)}
                </span>
                <div>
                  <p className="text-xl font-bold">{student.name}</p>
                  <p className="text-sm text-white/70">
                    {student.suburb} &middot; {student.lessons} lessons with you
                  </p>
                </div>
              </div>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                {[
                  ["Handicap", student.handicap],
                  ["Next lesson", student.next],
                  ["Goal", student.goal],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs uppercase tracking-[0.14em] text-white/50">{k}</dt>
                    <dd className="mt-0.5 font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-white/50">About {student.name.split(" ")[0]}</p>
              <p className="mt-1 text-white/85">{student.bio}</p>

              <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-white/50">
                Contact {student.name.split(" ")[0]}
              </p>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={`Write a quick message to ${student.name.split(" ")[0]}`}
                className="mt-2 w-full rounded-xl border border-white/20 bg-black/70 px-3 py-2.5 text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  setNote("");
                  setSent(`Preview only. In the live version this goes to ${student.name.split(" ")[0]}.`);
                }}
                className="pill-arrow mt-2 rounded-full bg-lime px-4 py-1.5 text-sm font-semibold text-black"
              >
                Message
              </button>
              {sent && <p className="mt-2 text-sm text-lime">{sent}</p>}
            </div>
          </div>
        )}

        {tab === "Video hub" && (
          <div className="grid gap-4">
            <div className="glass rounded-2xl p-5">
              <p className="font-bold">Upload a video</p>
              <p className="mt-1 text-sm text-white/70">
                Swing reviews and drills for one student. It appears under My videos on their My Golf page.
              </p>
              <label className="mt-3 block cursor-pointer rounded-xl border-2 border-dashed border-lime/50 p-6 text-center text-sm hover:bg-lime/5">
                <span className="font-semibold text-lime">{upload || "Choose a video file"}</span>
                <input type="file" accept="video/*" className="sr-only" onChange={(e) => setUpload(e.target.files?.[0]?.name ?? "")} />
              </label>
              {upload && <p className="mt-2 text-sm text-lime">Preview only. In the live version this uploads and notifies the student.</p>}
            </div>
            <div className="glass rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold">Share from Learn</p>
                  <p className="mt-1 text-sm text-white/70">Pick a video and send it to a student.</p>
                </div>
                <label className="text-sm text-white/75">
                  Send to{" "}
                  <select
                    value={shareTo}
                    onChange={(e) => setShareTo(e.target.value)}
                    className="ml-1 rounded-xl border border-white/20 bg-black/70 px-3 py-2"
                  >
                    {hubStudents.map((s) => (
                      <option key={s.id}>{s.name}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {hubLearnVideos.map((v) => (
                  <div key={v}>
                    <VideoPlaceholder title={v} label="Sample" />
                    <button
                      type="button"
                      onClick={() => setShared(`"${v}" ready to share with ${shareTo.split(" ")[0]}. Preview only.`)}
                      className="pill-arrow mt-2 rounded-full bg-lime px-4 py-1.5 text-sm font-semibold text-black"
                    >
                      Share
                    </button>
                  </div>
                ))}
              </div>
              {shared && <p className="mt-3 text-sm text-lime">{shared}</p>}
            </div>
          </div>
        )}

        {tab === "Earnings" && (
          <div className="grid gap-4">
            <p className="text-xs uppercase tracking-[0.16em] text-white/45">Sample figures</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["This month so far", formatAud(hubEarnings.monthCents)],
                ["Lessons taken", String(hubEarnings.monthLessons)],
                ["Next payout", hubEarnings.nextPayout],
              ].map(([k, v]) => (
                <div key={k} className="glass rounded-2xl p-5">
                  <p className="font-display text-3xl text-lime">{v}</p>
                  <p className="mt-1 text-sm text-white/75">{k}</p>
                </div>
              ))}
            </div>
            <div className="glass rounded-2xl p-5">
              <p className="font-bold">Past payouts</p>
              <p className="mt-1 text-sm text-white/70">Paid monthly for lessons that have taken place.</p>
              <ul className="mt-2 divide-y divide-white/10">
                {hubEarnings.payouts.map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-2.5 text-sm">
                    <span>
                      <span className="font-semibold">{p.month}</span>
                      <span className="text-white/60"> &middot; {p.lessons} lessons</span>
                    </span>
                    <span className="font-semibold">{formatAud(p.cents)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {tab === "Settings" && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="glass rounded-2xl p-5">
              <p className="font-bold">Your public page</p>
              <p className="mt-1 text-sm text-white/70">Share this link on Instagram or your own site.</p>
              <p className="mt-3 rounded-xl border border-white/20 bg-black/70 px-3 py-2.5 text-sm text-lime">
                golfme.com.au/c/matt-grenot
              </p>
            </div>
            <div className="glass rounded-2xl p-5">
              <p className="font-bold">Notifications and visibility</p>
              <ul className="mt-3 space-y-3 text-sm">
                {(
                  [
                    ["search", "Show me in coach search"],
                    ["booking", "Email me when a student books"],
                    ["reminder", "Remind students 24 hours before"],
                    ["daily", "Text me my schedule each morning"],
                  ] as const
                ).map(([k, label]) => (
                  <li key={k} className="flex items-center justify-between gap-3">
                    <span>{label}</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={prefs[k]}
                      aria-label={label}
                      onClick={() => setPrefs((p) => ({ ...p, [k]: !p[k] }))}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition ${prefs[k] ? "bg-lime" : "bg-white/20"}`}
                    >
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-black transition-all ${prefs[k] ? "left-[22px]" : "left-0.5 !bg-white"}`} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass rounded-2xl p-5 md:col-span-2">
              <p className="font-bold">Payout details</p>
              <p className="mt-1 text-sm text-white/70">Bank details are added securely through Stripe. Coming soon.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
