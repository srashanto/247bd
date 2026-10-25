import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-4xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted">This link may be old or mistyped. Try the shop instead.</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-gold px-6 py-3 font-semibold">Go to home</Link>
        <Link href="/products/" className="border border-ink px-6 py-3 font-semibold">Shop all</Link>
      </div>
    </div>
  );
}
