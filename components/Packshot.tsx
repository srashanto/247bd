import { Gender, includedProducts, Product, PackShape } from "@/lib/products";

type Theme = { body: string; cap: string; mark: string; label: string; sheen: number };

/** One house look for the whole range: black for him, white for her, gold for everyone. */
const themes: Record<Gender, Theme> = {
  him: { body: "#131313", cap: "#262626", mark: "#ececec", label: "#dbb65f", sheen: 0.07 },
  her: { body: "#ebe7e2", cap: "#141414", mark: "#151515", label: "#9a7c2e", sheen: 0.45 },
  unisex: { body: "#c8ac56", cap: "#141414", mark: "#141414", label: "#3a2f10", sheen: 0.3 },
};

const FONT = "Archivo, Inter, sans-serif";

/** Big wordmark running up the pack, with the product name beside it. */
function Vertical({ x, y, w, h, name, t }: { x: number; y: number; w: number; h: number; name: string; t: Theme }) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const size = Math.min(w * 0.46, h / 3.3);
  const label = name.replace("|", " ");
  return (
    <g>
      <text
        x={cx - w * 0.07}
        y={cy}
        transform={`rotate(-90 ${cx - w * 0.07} ${cy})`}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size}
        fontWeight="800"
        fontFamily={FONT}
        letterSpacing="0.5"
        fill={t.mark}
      >
        247BD
      </text>
      <text
        x={cx + w * 0.3}
        y={cy}
        transform={`rotate(-90 ${cx + w * 0.3} ${cy})`}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={Math.max(4.2, Math.min(5.6, (h * 0.9) / label.length / 0.62))}
        fontWeight="700"
        fontFamily={FONT}
        fill={t.label}
      >
        {label.toUpperCase()}
      </text>
    </g>
  );
}

/** Horizontal wordmark for short, wide packs (jars, perfume). */
function Horizontal({ cx, y, size, name, t }: { cx: number; y: number; size: number; name: string; t: Theme }) {
  const label = name.replace("|", " ").toUpperCase();
  return (
    <g>
      <text x={cx} y={y} textAnchor="middle" fontSize={size} fontWeight="800" fontFamily={FONT} fill={t.mark}>
        247BD
      </text>
      <text x={cx} y={y + size * 0.62} textAnchor="middle" fontSize={Math.min(5.4, 60 / label.length)} fontWeight="700" fontFamily={FONT} fill={t.label}>
        {label}
      </text>
    </g>
  );
}

function Sheen({ x, y, h, t }: { x: number; y: number; h: number; t: Theme }) {
  return <rect x={x} y={y} width="4" height={h} rx="2" fill="#fff" opacity={t.sheen} />;
}

function Shape({ shape, label, t }: { shape: PackShape; label: string; t: Theme }) {
  switch (shape) {
    case "bottle":
      return (
        <>
          <rect x="38" y="12" width="24" height="16" rx="3" fill={t.cap} />
          <rect x="42" y="26" width="16" height="10" fill={t.body} />
          <rect x="24" y="34" width="52" height="102" rx="12" fill={t.body} />
          <Sheen x={28} y={42} h={86} t={t} />
          <Vertical x={24} y={40} w={52} h={92} name={label} t={t} />
        </>
      );
    case "pump":
      return (
        <>
          <rect x="40" y="13" width="32" height="7" rx="2" fill={t.cap} />
          <rect x="47" y="19" width="6" height="19" fill={t.cap} />
          <rect x="39" y="36" width="22" height="12" rx="2" fill={t.cap} />
          <rect x="26" y="46" width="48" height="90" rx="10" fill={t.body} />
          <Sheen x={30} y={54} h={74} t={t} />
          <Vertical x={26} y={50} w={48} h={82} name={label} t={t} />
        </>
      );
    case "spray":
      return (
        <>
          <rect x="40" y="6" width="20" height="9" rx="2" fill={t.cap} />
          <path d="M34 22 Q50 10 66 22 L66 36 L34 36 Z" fill={t.body} />
          <rect x="29" y="34" width="42" height="102" rx="6" fill={t.body} />
          <Sheen x={33} y={42} h={88} t={t} />
          <Vertical x={29} y={40} w={42} h={92} name={label} t={t} />
        </>
      );
    case "jar":
      return (
        <>
          <rect x="16" y="68" width="68" height="20" rx="4" fill={t.cap} />
          <rect x="19" y="86" width="62" height="50" rx="9" fill={t.body} />
          <Sheen x={23} y={92} h={38} t={t} />
          <Horizontal cx={50} y={114} size={17} name={label} t={t} />
        </>
      );
    case "tube":
      return (
        <>
          <rect x="21" y="8" width="58" height="8" rx="1.5" fill={t.body} />
          <path d="M23 15 H77 L67 114 H33 Z" fill={t.body} />
          <path d="M28 20 L32 20 L37 108 L34 108 Z" fill="#fff" opacity={t.sheen} />
          <rect x="34" y="112" width="32" height="24" rx="3" fill={t.cap} />
          <Vertical x={28} y={22} w={44} h={86} name={label} t={t} />
        </>
      );
    case "dropper":
      return (
        <>
          <ellipse cx="50" cy="20" rx="9" ry="12" fill={t.cap} />
          <rect x="37" y="30" width="26" height="18" rx="3" fill={t.cap} />
          <rect x="27" y="46" width="46" height="90" rx="11" fill={t.body} />
          <Sheen x={31} y={54} h={74} t={t} />
          <Vertical x={27} y={50} w={46} h={82} name={label} t={t} />
        </>
      );
    case "perfume":
      return (
        <>
          <rect x="35" y="14" width="30" height="28" rx="3" fill={t.cap} />
          <rect x="43" y="40" width="14" height="10" fill={t.cap} opacity="0.75" />
          <rect x="16" y="48" width="68" height="88" rx="10" fill={t.body} />
          <rect x="22" y="54" width="56" height="76" rx="7" fill="#fff" opacity={t.sheen * 0.35} />
          <Sheen x={21} y={56} h={72} t={t} />
          <Horizontal cx={50} y={98} size={17} name={label} t={t} />
        </>
      );
    case "trimmer":
      return (
        <>
          <rect x="33" y="8" width="34" height="16" rx="2" fill="#8a8a8a" />
          {[37, 42, 47, 52, 57, 62].map((x) => (
            <rect key={x} x={x} y="4" width="2" height="6" fill="#8a8a8a" />
          ))}
          <rect x="31" y="22" width="38" height="114" rx="19" fill={t.body} />
          <Sheen x={36} y={30} h={96} t={t} />
          <circle cx="50" cy="52" r="6" fill={t.label} />
          <text x="50" y="104" transform="rotate(-90 50 104)" textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="800" fontFamily={FONT} fill={t.mark}>
            247BD
          </text>
        </>
      );
    case "straightener":
      return (
        <>
          <rect x="31" y="8" width="17" height="112" rx="8" fill={t.body} />
          <rect x="52" y="8" width="17" height="112" rx="8" fill={t.body} />
          <rect x="35" y="14" width="9" height="56" rx="2" fill={t.label} opacity="0.85" />
          <rect x="56" y="14" width="9" height="56" rx="2" fill={t.label} opacity="0.85" />
          <rect x="31" y="102" width="38" height="34" rx="9" fill={t.body} />
          <text x="50" y="122" textAnchor="middle" fontSize="9" fontWeight="800" fontFamily={FONT} fill={t.mark}>247BD</text>
        </>
      );
    case "comb":
      return (
        <>
          <rect x="22" y="14" width="56" height="26" rx="6" fill="#a47148" />
          {[25, 33, 41, 49, 57, 65].map((x) => (
            <rect key={x} x={x} y="36" width="6" height="96" rx="3" fill="#a47148" />
          ))}
          <text x="50" y="31" textAnchor="middle" fontSize="9" fontWeight="800" fontFamily={FONT} fill="#3b2614">247BD</text>
        </>
      );
  }
}

function Single({ product }: { product: Product }) {
  return (
    <svg
      viewBox="0 0 100 142"
      className="h-full w-auto overflow-visible"
      style={product.gender === "him" ? { filter: "drop-shadow(0 0 0.6px rgba(255,255,255,0.35)) drop-shadow(0 0 14px rgba(219,182,95,0.10))" } : undefined}
      role="img"
      aria-label={product.name}
    >
      <ellipse cx="50" cy="138.5" rx="34" ry="3.5" fill="#000" opacity="0.55" />
      <Shape shape={product.pack.shape} label={product.label} t={themes[product.gender]} />
    </svg>
  );
}

/** Illustrated product pack. Combos show the products inside, standing together. */
export default function Packshot({ product, className = "", style }: { product: Product; className?: string; style?: React.CSSProperties }) {
  const inside = includedProducts(product);
  if (inside.length) {
    return (
      <div className={`flex items-end justify-center ${className}`} style={style} role="img" aria-label={product.name}>
        {inside.map((p, i) => (
          <div
            key={p.slug}
            style={{
              marginLeft: i ? "-4%" : 0,
              height: inside.length >= 3 ? (i === 1 ? "70%" : "60%") : i === 0 ? "92%" : "80%",
              zIndex: i === 1 ? 2 : 1,
            }}
          >
            <Single product={p} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className={`flex min-w-0 items-end justify-center ${className}`} style={style}>
      <Single product={product} />
    </div>
  );
}
