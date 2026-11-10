"use client";

import { Children, useRef } from "react";

/** Sideways-scrolling row of cards with next and previous buttons on desktop. */
export default function ProductRail({ children }: { children: React.ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const move = (dir: number) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <div className="pp-rail">
      <div ref={track} className="pp-rail__track">{children}</div>
      {Children.count(children) > 4 && (
        <>
      <button aria-label="Previous" onClick={() => move(-1)} className="pp-rail__next pp-rail__next--prev">←</button>
      <button aria-label="Next" onClick={() => move(1)} className="pp-rail__next">→</button>
        </>
      )}
    </div>
  );
}
