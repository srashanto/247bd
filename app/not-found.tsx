import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <div className="text-6xl">🤔</div>
      <h1 className="mt-4 text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-slate-500">The page you are looking for does not exist.</p>
      <Link href="/" className="mt-6 inline-block rounded-xl bg-brand-600 px-6 py-3 font-bold text-white">
        Back to home
      </Link>
    </div>
  );
}
