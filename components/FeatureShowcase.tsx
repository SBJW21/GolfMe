"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PinMark from "./PinMark";
import { groups } from "./featureShowcaseData";
import "./FeatureShowcase.css";

const categories = ["Learn", "Play", "Track", "Improve"];
const destinations = [
  ["/coaches", "/coaches", "/coaches"],
  ["/courses", "/courses", "/courses"],
  ["/my-golf/shots", "/my-golf/shots", "/my-golf/rounds"],
  ["/my-golf/rounds", "/my-golf/rounds", "/my-golf"],
];

function FeatureIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    search: <><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></>,
    "calendar-days": <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-14 4h2m4 0h2m-8 3h2"/></>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
    flag: <><path d="M5 22V3c5-4 9 4 14 0v10c-5 4-9-4-14 0"/></>,
    map: <><path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5zm6-2v16m6-14v16"/></>,
    "cloud-sun": <><circle cx="8" cy="8" r="4"/><path d="M8 1V0M1 8H0m3-5L1 1m18 19H8a4 4 0 0 1 0-8 5 5 0 0 1 9-1 4.5 4.5 0 0 1 2 9"/></>,
    crosshair: <><circle cx="12" cy="12" r="8"/><path d="M12 1v6m0 10v6M1 12h6m10 0h6"/></>,
    ruler: <><path d="m2 16 14-14 6 6L8 22 2 16zm4-4 3 3m1-7 3 3m1-7 3 3"/></>,
    "clipboard-list": <><rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 2h6v4H9zM9 11h6m-6 5h6"/></>,
    history: <><path d="M3 11a9 9 0 1 1 2 7M3 4v7h7m2-5v6l4 3"/></>,
    flame: <><path d="M13 2c2 7 7 8 7 13a8 8 0 0 1-16 0c0-3 2-6 4-8 0 4 2 5 3 5 2-3 2-6 2-10z"/></>,
    video: <><rect x="2" y="5" width="14" height="14" rx="2"/><path d="m16 10 6-4v12l-6-4"/></>,
  };
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function ScreenVisual({ category }: { category: number }) {
  return <div className="gm-visual">
    {category === 0 && <><Image unoptimized className="gm-coach" src="/coaches/matt-grenot.jpg" alt="Matt Grenot" width={45} height={45}/><span className="gm-visual-label">Matt Grenot · Balgowlah</span></>}
    {category === 1 && <span className="gm-visual-label">Your next round starts here</span>}
    {category === 2 && <><div className="gm-score-cells">{[5, 3, 6].map((score, i) => <span key={i}>HOLE {i + 1}<b>{score}</b></span>)}</div><span className="gm-visual-label">Sample scorecard</span></>}
    {category === 3 && <><svg viewBox="0 0 210 110" role="img" aria-label="Example scores: 101, 97, then 94"><path d="M25 38 L105 55 L185 70" fill="none" stroke="#c6ff3d" strokeWidth="3"/><g fill="#c6ff3d"><circle cx="25" cy="38" r="4"/><circle cx="105" cy="55" r="4"/><circle cx="185" cy="70" r="4"/></g><g fill="white" fontSize="12"><text x="15" y="27">101</text><text x="97" y="44">97</text><text x="177" y="59">94</text></g></svg><span className="gm-visual-label">Recent scores · Example</span></>}
  </div>;
}

export default function FeatureShowcase() {
  const [category, setCategory] = useState(0);
  const [feature, setFeature] = useState(0);
  const current = groups[category][feature];
  return <div className="showcase">
    <section className="gm-section" aria-labelledby="golfme-features-heading">
      <h2 id="golfme-features-heading">GET MORE FROM<br/><span>YOUR GAME.</span></h2>
      <p className="gm-intro">Find your coach. Know your course. Make every round count.</p>
      <div className="gm-tabs" role="group" aria-label="Explore GolfMe features">
        {categories.map((name, i) => <button key={name} type="button" className="gm-tab" aria-pressed={category === i} onClick={() => { setCategory(i); setFeature(0); }}>{name.toUpperCase()}</button>)}
      </div>
      <div className="gm-grid">
        <div className="gm-features" role="group" aria-label={`${categories[category]} features`}>
          {groups[category].map((item, i) => <button key={item.title} type="button" className="gm-feature" aria-pressed={feature === i} aria-controls="golfme-phone-preview" onClick={() => setFeature(i)}>
            <span className="gm-icon"><FeatureIcon name={item.icon}/></span>
            <span><strong>{item.title}</strong><p>{item.text}</p></span>
          </button>)}
        </div>
        <div className="gm-stage">
          <div className="gm-phone">
            <div className="gm-top" aria-hidden="true"><span>9:41</span><span className="gm-island"/><span>● ▰</span></div>
            <div className="gm-brand" aria-label="Golf Me"><PinMark/><span>Golf <em>Me</em></span></div>
            <div id="golfme-phone-preview" className="gm-screen" aria-live="polite" aria-atomic="true">
              <div className="gm-screen-title">{current.screen}</div>
              <div className="gm-small">{current.sub}</div>
              <ScreenVisual category={category}/>
              <div className="gm-panel"><b>{current.panel}</b>
                {current.number && <div className="gm-number">{current.number}</div>}
                {current.streak && <div className="gm-streak" aria-label="Four weeks played"><i/><i/><i/><i/><i/></div>}
                {current.rows.map(row => <div className="gm-mini-row" key={row}>{row}</div>)}
              </div>
              <Link href={destinations[category][feature]} className="gm-screen-cta">{current.cta} ↗</Link>
            </div>
            <span className="gm-preview-label">Illustrative preview · sample content</span>
            <div className="gm-homebar" aria-hidden="true"/>
          </div>
        </div>
      </div>
    </section>
  </div>;
}
