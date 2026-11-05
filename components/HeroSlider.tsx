"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const IMG = "https://pahelapride.com/wp-content/themes/pahelapride/assets/img/hero";

const slides = [
  {
    key: "men",
    flip: false,
    img: `${IMG}/hero-men-780.webp`,
    big: [["LOOK", "sharp"], ["STAY", "confident"]],
    text: "Hair styling, hair care & skincare. 100% imported, delivered all over Bangladesh.",
    links: [
      ["Hair Care", "/hair-care/"],
      ["Skin Care", "/skin-care/"],
      ["Perfume", "/perfume/"],
    ],
  },
  {
    key: "women",
    flip: true,
    img: `${IMG}/hero-women-780.webp`,
    big: [["GLOW", "every day"], ["SHINE", "your way"]],
    text: "Hair care, skincare & perfume. 100% imported, delivered all over Bangladesh.",
    links: [
      ["Hair Care", "/hair-care/"],
      ["Skin Care", "/skin-care/"],
      ["Hair Style", "/hair-styling/"],
    ],
  },
];

export default function HeroSlider() {
  const [at, setAt] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = (n: number) => setAt((n + slides.length) % slides.length);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setAt((n) => (n + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <section className="pp-hero" aria-roledescription="carousel" aria-label="Featured" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="pp-hero__track" style={{ transform: `translateX(-${at * 100}%)` }}>
        {slides.map((s, i) => (
          <div key={s.key} className={`pp-slide ${s.flip ? "pp-slide--flip" : ""}`} aria-hidden={i !== at}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.img} alt="" className="pp-slide__model" loading={i === 0 ? "eager" : "lazy"} />
            <div className="pp-container">
              <div className="pp-slide__copy">
                {i === 0 ? (
                  <h1 className="pp-slide__h">
                    {s.big.map(([a, b]) => <span key={a}>{a} <em>{b}</em></span>)}
                  </h1>
                ) : (
                  <p className="pp-slide__h">
                    {s.big.map(([a, b]) => <span key={a}>{a} <em>{b}</em></span>)}
                  </p>
                )}
                <p className="pp-slide__text">{s.text}</p>
                <div className="pp-slide__btns">
                  <Link href="/products/" className="pp-pill pp-pill--punk" tabIndex={i === at ? 0 : -1}>Shop now</Link>
                  <Link href="/combos/" className="pp-pill pp-pill--ghost" tabIndex={i === at ? 0 : -1}>Shop combos</Link>
                </div>
                <div className="pp-slide__links">
                  {s.links.map(([label, href]) => <Link key={href} href={href} tabIndex={i === at ? 0 : -1}>{label}</Link>)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button aria-label="Previous slide" onClick={() => go(at - 1)} className="pp-hero__arrow" style={{ left: 16 }}>←</button>
      <button aria-label="Next slide" onClick={() => go(at + 1)} className="pp-hero__arrow" style={{ right: 16 }}>→</button>
      <div className="pp-hero__dots">
        {slides.map((s, i) => <button key={s.key} aria-label={`Slide ${i + 1}`} aria-current={i === at} onClick={() => go(i)} />)}
      </div>
    </section>
  );
}
