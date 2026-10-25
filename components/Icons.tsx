type P = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

export const SearchIcon = ({ className = "h-5 w-5" }: P) => (
  <svg {...base} className={className}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const BagIcon = ({ className = "h-5 w-5" }: P) => (
  <svg {...base} className={className}><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
);
export const HeartIcon = ({ className = "h-5 w-5", filled = false }: P & { filled?: boolean }) => (
  <svg {...base} className={className} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
  </svg>
);
export const MenuIcon = ({ className = "h-6 w-6" }: P) => (
  <svg {...base} className={className}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const CloseIcon = ({ className = "h-6 w-6" }: P) => (
  <svg {...base} className={className}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const TruckIcon = ({ className = "h-5 w-5" }: P) => (
  <svg {...base} className={className}><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.5" /><circle cx="17" cy="17.5" r="1.5" /></svg>
);
export const CashIcon = ({ className = "h-5 w-5" }: P) => (
  <svg {...base} className={className}><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></svg>
);
export const ReturnIcon = ({ className = "h-5 w-5" }: P) => (
  <svg {...base} className={className}><path d="M9 14 4 9l5-5" /><path d="M4 9h10a6 6 0 0 1 0 12h-3" /></svg>
);
export const ChatIcon = ({ className = "h-5 w-5" }: P) => (
  <svg {...base} className={className}><path d="M4 18V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8l-4 4Z" /></svg>
);
export const CheckIcon = ({ className = "h-4 w-4" }: P) => (
  <svg {...base} className={className}><path d="m5 12 4 4 10-10" /></svg>
);
export const TrashIcon = ({ className = "h-4 w-4" }: P) => (
  <svg {...base} className={className}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></svg>
);
