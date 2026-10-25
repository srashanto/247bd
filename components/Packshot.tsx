import { includedProducts, Pack, Product } from "@/lib/products";

/** Pick dark or light ink for text sitting on a colour. */
function inkOn(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "#1F2A2E" : "#F3F5F2";
}

function Label({ x, y, w, h, text, color, bg }: { x: number; y: number; w: number; h: number; text: string; color: string; bg?: string }) {
  const lines = text.split("|");
  const cx = x + w / 2;
  const fs = lines.some((l) => l.length > 8) ? 6.6 : 7.6;
  const start = y + h / 2 - ((lines.length - 1) * (fs + 1.5)) / 2 + 4;
  return (
    <g>
      {bg && <rect x={x} y={y} width={w} height={h} rx={3} fill={bg} />}
      <text x={cx} y={y + 8.5} textAnchor="middle" fontSize="6" fontWeight="800" fill={color} opacity="0.75" fontFamily="var(--font-display)">
        247
      </text>
      {lines.map((l, i) => (
        <text
          key={i}
          x={cx}
          y={start + 3 + i * (fs + 1.5)}
          textAnchor="middle"
          fontSize={fs}
          fontWeight="700"
          fill={color}
          fontFamily="var(--font-display)"
        >
          {l}
        </text>
      ))}
    </g>
  );
}

function Shape({ pack, label }: { pack: Pack; label: string }) {
  const { shape, body, accent } = pack;
  const ink = inkOn(body);

  switch (shape) {
    case "bottle":
      return (
        <>
          <rect x="38" y="12" width="24" height="16" rx="3" fill={accent} />
          <rect x="42" y="26" width="16" height="10" fill={body} />
          <rect x="24" y="34" width="52" height="102" rx="13" fill={body} />
          <rect x="29" y="40" width="5" height="88" rx="2.5" fill="#fff" opacity="0.18" />
          <Label x={30} y={66} w={40} h={40} text={label} color={ink} />
        </>
      );
    case "pump":
      return (
        <>
          <rect x="40" y="14" width="32" height="7" rx="3" fill={accent} />
          <rect x="47" y="20" width="6" height="18" fill={accent} />
          <rect x="39" y="36" width="22" height="12" rx="3" fill={accent} />
          <rect x="26" y="46" width="48" height="90" rx="11" fill={body} />
          <rect x="31" y="52" width="5" height="76" rx="2.5" fill="#fff" opacity="0.2" />
          <Label x={30} y={74} w={40} h={40} text={label} color={ink} />
        </>
      );
    case "spray":
      return (
        <>
          <rect x="31" y="8" width="38" height="30" rx="9" fill={accent} />
          <rect x="29" y="36" width="42" height="100" rx="7" fill={body} />
          <rect x="34" y="42" width="5" height="88" rx="2.5" fill="#fff" opacity="0.2" />
          <Label x={30} y={70} w={40} h={40} text={label} color={ink} />
        </>
      );
    case "jar":
      return (
        <>
          <rect x="16" y="66" width="68" height="20" rx="5" fill={accent} />
          <rect x="19" y="84" width="62" height="52" rx="11" fill={body} />
          <rect x="24" y="90" width="5" height="40" rx="2.5" fill="#fff" opacity="0.2" />
          <Label x={28} y={88} w={44} h={44} text={label} color={ink} />
        </>
      );
    case "tube":
      return (
        <>
          <rect x="21" y="8" width="58" height="9" rx="2" fill={accent} opacity="0.85" />
          <path d="M23 15 H77 L67 114 H33 Z" fill={body} />
          <path d="M28 20 L33 20 L38 108 L35 108 Z" fill="#fff" opacity="0.2" />
          <rect x="34" y="112" width="32" height="24" rx="4" fill={accent} />
          <Label x={30} y={42} w={40} h={44} text={label} color={ink} />
        </>
      );
    case "dropper":
      return (
        <>
          <ellipse cx="50" cy="20" rx="9" ry="12" fill={accent} />
          <rect x="37" y="30" width="26" height="18" rx="3" fill={accent} />
          <rect x="27" y="46" width="46" height="90" rx="12" fill={body} />
          <rect x="32" y="52" width="5" height="76" rx="2.5" fill="#fff" opacity="0.22" />
          <Label x={30} y={76} w={40} h={40} text={label} color={ink} />
        </>
      );
    case "perfume":
      return (
        <>
          <rect x="35" y="14" width="30" height="28" rx="5" fill={accent} />
          <rect x="43" y="40" width="14" height="10" fill={accent} opacity="0.7" />
          <rect x="16" y="48" width="68" height="88" rx="16" fill={body} />
          <rect x="22" y="54" width="56" height="76" rx="12" fill="#fff" opacity="0.12" />
          <rect x="22" y="56" width="5" height="70" rx="2.5" fill="#fff" opacity="0.28" />
          <Label x={28} y={72} w={44} h={44} text={label} color={ink} />
        </>
      );
    case "trimmer":
      return (
        <>
          <rect x="33" y="8" width="34" height="16" rx="3" fill={accent} />
          {[37, 42, 47, 52, 57, 62].map((x) => (
            <rect key={x} x={x} y="4" width="2" height="6" fill={accent} />
          ))}
          <rect x="31" y="22" width="38" height="114" rx="19" fill={body} />
          <rect x="36" y="30" width="4" height="96" rx="2" fill="#fff" opacity="0.18" />
          <circle cx="50" cy="66" r="6" fill={accent} />
          <rect x="44" y="96" width="12" height="3" rx="1.5" fill={accent} opacity="0.7" />
        </>
      );
    case "straightener":
      return (
        <>
          <rect x="31" y="8" width="17" height="112" rx="8" fill={body} />
          <rect x="52" y="8" width="17" height="112" rx="8" fill={body} />
          <rect x="35" y="14" width="9" height="56" rx="3" fill={accent} />
          <rect x="56" y="14" width="9" height="56" rx="3" fill={accent} />
          <rect x="31" y="104" width="38" height="32" rx="10" fill={body} />
          <circle cx="50" cy="118" r="4" fill={accent} />
        </>
      );
    case "comb":
      return (
        <>
          <rect x="22" y="14" width="56" height="26" rx="8" fill={body} />
          {[25, 33, 41, 49, 57, 65].map((x) => (
            <rect key={x} x={x} y="36" width="6" height="96" rx="3" fill={body} />
          ))}
          <rect x="26" y="18" width="40" height="4" rx="2" fill="#fff" opacity="0.22" />
        </>
      );
  }
}

function Single({ product }: { product: Product }) {
  return (
    <svg viewBox="0 0 100 142" className="h-full w-auto overflow-visible" role="img" aria-label={product.name}>
      <ellipse cx="50" cy="138" rx="32" ry="3.5" fill="#1F2A2E" opacity="0.13" />
      <Shape pack={product.pack} label={product.label} />
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
            className="h-full"
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
    <div className={`flex items-end justify-center ${className}`} style={style}>
      <Single product={product} />
    </div>
  );
}
