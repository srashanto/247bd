"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Art } from "./Packshot";

type Slide = { key: string; big: [string, string]; text: string; img?: string; href: string; cta: string; links: [string, string][] };

export default function HeroSlider() {
  const [at, setAt] = useState(0);
  const [paused, setPaused] = useState(false);

  const slides = useMemo<Slide[]>(() => {
    return [{
      key: "all",
      big: ["Everything", "football. 24/7."],
      text: "Boots, balls, kit and gear for every player. Pay cash on delivery anywhere in Bangladesh.",
      href: "/products/",
      cta: "Shop all gear",
      links: [],
    }];
  }, []);

  const go = (n: number) => setAt((n + slides.length) % slides.length);
  const cur = Math.min(at, slides.length - 1);

  useEffect(() => {
    if (paused || slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setAt((n) => (n + 1) % slides.length), 6500);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  return (
    <section className="pp-hero" aria-roledescription="carousel" aria-label="Featured" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="pp-hero__track" style={{ transform: `translateX(-${cur * 100}%)` }}>
        {slides.map((s, i) => (
          <div key={s.key} className="pp-slide" aria-hidden={i !== cur}>
            <div className="pp-container pp-slide__grid">
              <div className="pp-slide__copy">
                {i === 0 ? (
                  <h1 className="pp-slide__h">{s.big.map((b) => <span key={b}>{b}</span>)}</h1>
                ) : (
                  <p className="pp-slide__h">{s.big.map((b) => <span key={b}>{b}</span>)}</p>
                )}
                <p className="pp-slide__text">{s.text}</p>
                <div className="pp-slide__btns">
                  <Link href={s.href} className="pp-pill pp-pill--punk" tabIndex={i === cur ? 0 : -1}>{s.cta}</Link>
                  <Link href="/products/" className="pp-pill pp-pill--ghost" tabIndex={i === cur ? 0 : -1}>All products</Link>
                </div>
                {s.links.length > 0 && (
                  <div className="pp-slide__links">
                    {s.links.map(([label, href]) => <Link key={href} href={href} tabIndex={i === cur ? 0 : -1}>{label}</Link>)}
                  </div>
                )}
              </div>
              <div className="pp-slide__art">
                {s.img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.img} alt="" loading={i === 0 ? "eager" : "lazy"} />
                ) : (
                  <svg viewBox="0 0 200 160" className="h-full w-full p-10" aria-hidden><Art shape="ball" color="#c6ff00" /></svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <>
          <button aria-label="Previous slide" onClick={() => go(cur - 1)} className="pp-hero__arrow" style={{ right: 70 }}>←</button>
          <button aria-label="Next slide" onClick={() => go(cur + 1)} className="pp-hero__arrow" style={{ right: 16 }}>→</button>
          <div className="pp-hero__dots">
            {slides.map((s, i) => <button key={s.key} aria-label={`Slide ${i + 1}`} aria-current={i === cur} onClick={() => go(i)} />)}
          </div>
        </>
      )}
    </section>
  );
}
