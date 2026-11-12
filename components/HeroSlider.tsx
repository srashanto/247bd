"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { categoryHref } from "@/lib/seo";

type Slide = { key: string; img: string; pos: string; motion: string; kicker: string; lines: [string, string]; text: string; cta: string; href: string };

const slides: Slide[] = [
  {
    key: "strike", img: "/banner/kick.jpg", pos: "62% 50%", motion: "a",
    kicker: "247BD · Football store",
    lines: ["Strike", "like a pro."],
    text: "Long-stud boots, match balls and kit for every player. Cash on delivery all over Bangladesh.",
    cta: "Shop all gear", href: "/products/",
  },
  {
    key: "fast", img: "/banner/dribble.jpg", pos: "55% 50%", motion: "b",
    kicker: "New boots just landed",
    lines: ["Fast feet.", "Fresh boots."],
    text: "Meike long-stud boots in 4 colours, sizes EU 35 to 45. Pick your pair and order today.",
    cta: "Shop boots", href: categoryHref("boots"),
  },
  {
    key: "pay", img: "/banner/kick.jpg", pos: "78% 78%", motion: "c",
    kicker: "No advance. No stress.",
    lines: ["Play hard.", "Pay later."],
    text: "Order online, check your gear when it arrives, then pay. Help on WhatsApp if you are unsure about a size.",
    cta: "How it works", href: "/help/",
  },
];

/** Types `full` out letter by letter once `run` is true. */
function useTyped(full: string, run: boolean, delay: number, speed: number) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) { setN(0); return; }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(full.length); return; }
    let i = 0;
    let t: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      t = setInterval(() => { i += 1; setN(i); if (i >= full.length && t) clearInterval(t); }, speed);
    }, delay);
    return () => { clearTimeout(start); if (t) clearInterval(t); };
  }, [run, full, delay, speed]);
  return n;
}

function Copy({ s, active }: { s: Slide; active: boolean }) {
  const k = useTyped(s.kicker, active, 150, 28);
  const a = useTyped(s.lines[0], active, 500, 55);
  const b = useTyped(s.lines[1], active && a >= s.lines[0].length, 0, 55);
  const t = useTyped(s.text, active && b >= s.lines[1].length, 100, 14);
  const done = t >= s.text.length;
  const Tag = "p";
  return (
    <>
      <p className="pp-ban__kicker" aria-label={s.kicker}>
        <span aria-hidden>{s.kicker.slice(0, k)}</span>
        <span aria-hidden className="pp-ban__ghost">{s.kicker.slice(k)}</span>
      </p>
      <Tag className="pp-ban__h" aria-label={s.lines.join(" ")}>
        <span aria-hidden className="pp-ban__l1">{s.lines[0].slice(0, a)}{a < s.lines[0].length && <i className="pp-caret" />}</span>
        <span aria-hidden className="pp-ban__l2">{s.lines[1].slice(0, b)}{a >= s.lines[0].length && b < s.lines[1].length && <i className="pp-caret" />}</span>
        <span aria-hidden className="pp-ban__ghost">{s.lines[0]}<br />{s.lines[1]}</span>
      </Tag>
      <p className="pp-ban__text" aria-label={s.text}>
        <span aria-hidden>{s.text.slice(0, t)}</span>
        <span aria-hidden className="pp-ban__ghost">{s.text.slice(t)}</span>
        {b >= s.lines[1].length && <i className={`pp-caret pp-caret--sm ${done ? "pp-caret--blink" : ""}`} aria-hidden />}
      </p>
    </>
  );
}

export default function HeroSlider() {
  const [at, setAt] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setAt((n) => (n + 1) % slides.length), 9000);
    return () => clearTimeout(t);
  }, [at, paused]);

  return (
    <section className="pp-ban" aria-roledescription="carousel" aria-label="Featured" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {slides.map((s, i) => (
        <div key={s.key} className={`pp-ban__slide pp-ban__slide--${s.motion} ${i === at ? "is-on" : ""}`} aria-hidden={i !== at}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.img} alt="" style={{ objectPosition: s.pos }} loading={i === 0 ? "eager" : "lazy"} />
          <div className="pp-ban__shade" />
          <div className="pp-ban__streaks" aria-hidden />
          <div className="pp-container pp-ban__copy">
            <Copy s={s} active={i === at} />
            <div className="pp-slide__btns">
              <Link href={s.href} className="pp-pill pp-pill--punk" tabIndex={i === at ? 0 : -1}>{s.cta}</Link>
              <Link href="/products/" className="pp-pill pp-pill--ghost" tabIndex={i === at ? 0 : -1}>All products</Link>
            </div>
          </div>
        </div>
      ))}
      <div className="pp-ban__dots">
        {slides.map((s, i) => (
          <button key={s.key} aria-label={`Slide ${i + 1}`} aria-current={i === at} onClick={() => setAt(i)}>
            {i === at && <span className="pp-ban__prog" />}
          </button>
        ))}
      </div>
    </section>
  );
}
