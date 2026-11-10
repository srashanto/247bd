"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  { key: "kick", img: "/banner/kick.jpg", pos: "62% 50%", lines: ["Everything", "football. 24/7."], text: "Boots, balls, kit and gear for every player. Pay cash on delivery anywhere in Bangladesh.", cta: "Shop all gear", href: "/products/" },
  { key: "run", img: "/banner/dribble.jpg", pos: "55% 50%", lines: ["Own the", "pitch."], text: "Pick your size, pay when it arrives, and get help on WhatsApp if you are unsure.", cta: "See the boots", href: "/products/" },
];

/** Types `full` out letter by letter once `run` is true. */
function useTyped(full: string, run: boolean, delay: number) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) { setN(0); return; }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(full.length); return; }
    let i = 0;
    let t: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      t = setInterval(() => { i += 1; setN(i); if (i >= full.length) clearInterval(t); }, 55);
    }, delay);
    return () => { clearTimeout(start); clearInterval(t); };
  }, [run, full, delay]);
  return n;
}

function Headline({ lines, active, big }: { lines: string[]; active: boolean; big: boolean }) {
  const a = useTyped(lines[0], active, 250);
  const b = useTyped(lines[1], active && a >= lines[0].length, 0);
  const done = b >= lines[1].length;
  const Tag = big ? "h1" : "p";
  return (
    <Tag className="pp-ban__h" aria-label={lines.join(" ")}>
      <span aria-hidden>{lines[0].slice(0, a)}{!(a >= lines[0].length) && <i className="pp-caret" />}</span>
      <span aria-hidden className="pp-ban__h2">{lines[1].slice(0, b)}{a >= lines[0].length && <i className={`pp-caret ${done ? "pp-caret--blink" : ""}`} />}</span>
      {/* reserves the final height so nothing jumps while typing */}
      <span aria-hidden className="pp-ban__ghost">{lines[0]}<br />{lines[1]}</span>
    </Tag>
  );
}

export default function HeroSlider() {
  const [at, setAt] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setAt((n) => (n + 1) % slides.length), 8000);
    return () => clearTimeout(t);
  }, [at, paused]);

  return (
    <section className="pp-ban" aria-roledescription="carousel" aria-label="Featured" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {slides.map((s, i) => (
        <div key={s.key} className={`pp-ban__slide ${i === at ? "is-on" : ""}`} aria-hidden={i !== at}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.img} alt="" style={{ objectPosition: s.pos }} loading={i === 0 ? "eager" : "lazy"} />
          <div className="pp-ban__shade" />
          <div className="pp-container pp-ban__copy">
            <Headline lines={s.lines} active={i === at} big={i === 0} />
            <p className="pp-ban__text">{s.text}</p>
            <div className="pp-slide__btns">
              <Link href={s.href} className="pp-pill pp-pill--punk" tabIndex={i === at ? 0 : -1}>{s.cta}</Link>
              <Link href="/products/" className="pp-pill pp-pill--ghost" tabIndex={i === at ? 0 : -1}>All products</Link>
            </div>
          </div>
        </div>
      ))}
      <div className="pp-ban__dots">
        {slides.map((s, i) => <button key={s.key} aria-label={`Slide ${i + 1}`} aria-current={i === at} onClick={() => setAt(i)} />)}
      </div>
    </section>
  );
}
