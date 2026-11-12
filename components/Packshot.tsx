import { PackShape, Product } from "@/lib/products";

/** Lighten (amt > 0) or darken (amt < 0) a #rrggbb colour. */
function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const target = amt < 0 ? 0 : 255;
  const k = Math.abs(amt);
  r = Math.round((target - r) * k + r);
  g = Math.round((target - g) * k + g);
  b = Math.round((target - b) * k + b);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

const byCategory: Record<string, PackShape> = {
  boots: "boot",
  footballs: "ball",
  jerseys: "jersey",
  socks: "sock",
  "shin-guards": "shin",
  gloves: "glove",
  bags: "bag",
  training: "cone",
  accessories: "sock",
};

export function shapeFor(product: Pick<Product, "category" | "pack">): PackShape {
  return product.pack?.shape ?? byCategory[product.category] ?? "ball";
}

const INK = "#0b1410";

export function Art({ shape, color }: { shape: PackShape; color: string }) {
  const c = color;
  const d = shade(c, -0.28);
  const l = shade(c, 0.35);
  switch (shape) {
    case "boot":
      return (
        <>
          <ellipse cx="100" cy="142" rx="80" ry="6" fill="#000" opacity=".35" />
          <path d="M22 62c10-4 22-6 30-4l34 34c14 10 44 12 74 18 12 3 18 9 18 16v4H30c-8 0-12-5-12-12V74c0-6 1-10 4-12z" fill={c} />
          <path d="M18 104h160c0 6 0 10 0 14v4c0 4-3 6-7 6H30c-8 0-12-5-12-12z" fill={d} />
          <path d="M58 64l34 32M70 60l30 30M48 76l32 26" stroke={l} strokeWidth="4" strokeLinecap="round" />
          <path d="M118 98c18 4 36 6 52 12" stroke={l} strokeWidth="5" strokeLinecap="round" fill="none" />
          <g fill="#e9efe9"><rect x="34" y="128" width="10" height="10" rx="2" /><rect x="62" y="128" width="10" height="10" rx="2" /><rect x="104" y="128" width="10" height="10" rx="2" /><rect x="132" y="128" width="10" height="10" rx="2" /><rect x="158" y="128" width="10" height="10" rx="2" /></g>
        </>
      );
    case "ball":
      return (
        <>
          <ellipse cx="100" cy="146" rx="52" ry="6" fill="#000" opacity=".35" />
          <circle cx="100" cy="78" r="62" fill="#f4f6f3" stroke={d} strokeWidth="3" />
          <path d="M100 52l25 18-10 29H85L75 70z" fill={INK} />
          <path d="M100 52V18M125 70l32-12M115 99l20 28M85 99l-20 28M75 70L43 58" stroke={INK} strokeWidth="4" />
          <path d="M100 18l22 6M100 18l-22 6M157 58l4 24M157 58l-12-18M135 127l-24 12M135 127l20-16M65 127l24 12M65 127l-20-16M43 58l-4 24M43 58l12-18" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        </>
      );
    case "jersey":
      return (
        <>
          <path d="M70 16l-44 20-14 36 26 12 8-16v76h108V68l8 16 26-12-14-36-44-20c-6 12-16 18-30 18s-24-6-30-18z" fill={c} stroke={d} strokeWidth="3" strokeLinejoin="round" />
          <path d="M70 16c6 12 16 18 30 18s24-6 30-18" fill="none" stroke={l} strokeWidth="6" />
          <rect x="86" y="62" width="28" height="34" rx="3" fill={l} opacity=".85" />
        </>
      );
    case "shorts":
      return (
        <>
          <path d="M40 30h120l14 100h-62l-12-52-12 52H26z" fill={c} stroke={d} strokeWidth="3" strokeLinejoin="round" />
          <rect x="40" y="30" width="120" height="16" fill={d} />
          <path d="M160 46l10 84" stroke={l} strokeWidth="5" />
        </>
      );
    case "sock":
      return (
        <>
          <path d="M70 10h46v84c0 8 4 14 12 18l28 12c10 4 12 16 4 22-4 3-10 4-16 2l-56-20c-12-4-18-12-18-24z" fill={c} stroke={d} strokeWidth="3" strokeLinejoin="round" />
          <rect x="70" y="10" width="46" height="14" fill={d} />
          <rect x="70" y="34" width="46" height="8" fill={l} />
          <rect x="70" y="50" width="46" height="8" fill={l} />
        </>
      );
    case "shin":
      return (
        <>
          <path d="M72 14h56c10 0 16 6 16 16v70c0 26-18 42-44 46-26-4-44-20-44-46V30c0-10 6-16 16-16z" fill={c} stroke={d} strokeWidth="3" />
          <path d="M72 46h56M70 76h60M74 106h52" stroke={l} strokeWidth="6" strokeLinecap="round" />
        </>
      );
    case "glove":
      return (
        <>
          <path d="M58 150V96l-16-24c-4-8 6-16 12-10l12 14V34c0-10 14-10 14 0V22c0-10 14-10 14 0v4c0-10 14-10 14 0v10c0-10 14-10 14 0v70l-8 44z" fill={c} stroke={d} strokeWidth="3" strokeLinejoin="round" />
          <rect x="56" y="130" width="72" height="20" rx="4" fill={d} />
          <path d="M80 44v40M94 36v48M108 40v44" stroke={l} strokeWidth="5" strokeLinecap="round" />
        </>
      );
    case "bag":
      return (
        <>
          <path d="M72 34c0-16 12-24 28-24s28 8 28 24" fill="none" stroke={d} strokeWidth="7" />
          <rect x="44" y="32" width="112" height="116" rx="20" fill={c} stroke={d} strokeWidth="3" />
          <rect x="62" y="82" width="76" height="46" rx="8" fill={d} />
          <path d="M60 58h80" stroke={l} strokeWidth="5" strokeLinecap="round" />
        </>
      );
    case "cone":
      return (
        <>
          <ellipse cx="100" cy="134" rx="78" ry="14" fill={d} />
          <path d="M78 28h44l40 104H38z" fill={c} stroke={d} strokeWidth="3" strokeLinejoin="round" />
          <path d="M66 64h68M54 98h92" stroke={l} strokeWidth="10" />
        </>
      );
    case "band":
      return (
        <>
          <path d="M26 60c50-16 98-16 148 0v44c-50-16-98-16-148 0z" fill={c} stroke={d} strokeWidth="3" strokeLinejoin="round" />
          <text x="100" y="92" textAnchor="middle" fontFamily="Barlow Condensed, sans-serif" fontWeight="800" fontSize="34" fill={INK}>C</text>
        </>
      );
    case "pump":
      return (
        <>
          <rect x="88" y="52" width="24" height="88" rx="6" fill={c} stroke={d} strokeWidth="3" />
          <rect x="96" y="22" width="8" height="34" fill="#e9efe9" />
          <rect x="66" y="12" width="68" height="14" rx="7" fill={d} />
          <path d="M112 120c24 0 34-10 40-26" fill="none" stroke="#e9efe9" strokeWidth="4" strokeLinecap="round" />
        </>
      );
  }
}

/** Drawn product art, used when a product has no photo yet. */
export default function Packshot({ product, className = "", style }: { product: Product; className?: string; style?: React.CSSProperties }) {
  const color = product.pack?.color ?? product.colors?.[0]?.hex ?? "#c6ff00";
  return (
    <div className={`flex min-w-0 items-center justify-center ${className}`} style={style}>
      <svg viewBox="0 0 200 160" className="h-full w-full" role="img" aria-label={product.name}>
        <Art shape={shapeFor(product)} color={color} />
      </svg>
    </div>
  );
}
