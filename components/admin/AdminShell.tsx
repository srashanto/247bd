"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { backendEnabled, errorMessage, supabase } from "@/lib/supabase";
import { Logo } from "@/components/Header";

type AdminValue = { db: SupabaseClient; email: string };
const AdminContext = createContext<AdminValue | null>(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside AdminShell");
  return ctx;
}

const nav = [
  { href: "/admin/", label: "Dashboard" },
  { href: "/admin/orders/", label: "Orders" },
  { href: "/admin/products/", label: "Products" },
  { href: "/admin/coupons/", label: "Coupons" },
  { href: "/admin/settings/", label: "Settings" },
];

export const field = "w-full border border-line bg-card px-3 py-2.5 text-[15px] outline-none focus:border-gold";
export const btn = "btn-gold px-4 py-2.5 text-[13px] disabled:opacity-50";
export const btnGhost = "border border-line px-4 py-2.5 text-[13px] font-semibold uppercase tracking-wider hover:border-ink disabled:opacity-50";

function Setup() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <Logo />
      <h1 className="mt-8 text-3xl font-semibold">Connect the admin panel</h1>
      <p className="mt-3 text-[16px] leading-relaxed text-ink/85">
        The store is running without a database, so orders only reach you on WhatsApp. To manage orders, products, stock and
        coupons here, connect a free Supabase project:
      </p>
      <ol className="mt-6 list-decimal space-y-3 pl-5 text-[15px] leading-relaxed text-ink/85 marker:text-gold">
        <li>Create a project at supabase.com.</li>
        <li>Open SQL Editor, paste the file <code className="text-gold-2">supabase/schema.sql</code> from the GitHub repo, and run it.</li>
        <li>Under Authentication → Users, add a user with the admin email listed in that file and a password.</li>
        <li>
          In the GitHub repo, open Settings → Secrets and variables → Actions → Variables, and add{" "}
          <code className="text-gold-2">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="text-gold-2">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> from
          Supabase Project Settings → API.
        </li>
        <li>Run the deploy again from the Actions tab, then sign in here.</li>
      </ol>
    </div>
  );
}

function Login({ db }: { db: SupabaseClient }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const { error } = await db.auth.signInWithPassword({ email: email.trim(), password });
    if (error) setMsg(error.message === "Invalid login credentials" ? "Wrong email or password." : error.message);
    setBusy(false);
  }

  async function reset() {
    if (!email.trim()) return setMsg("Enter your email first, then tap Forgot password.");
    const { error } = await db.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${location.origin}/admin/` });
    setMsg(error ? errorMessage(error) : "Check your email for a link to set a new password.");
  }

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <form onSubmit={signIn} className="w-full max-w-sm">
        <Logo />
        <h1 className="mt-6 text-2xl font-semibold">Admin sign in</h1>
        <label className="mt-6 block text-[14px]">
          Email
          <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={`${field} mt-1.5`} />
        </label>
        <label className="mt-4 block text-[14px]">
          Password
          <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={`${field} mt-1.5`} />
        </label>
        {msg && <p className="mt-4 text-[14px] text-alert">{msg}</p>}
        <button disabled={busy} className={`${btn} mt-6 w-full py-3.5`}>{busy ? "Signing in…" : "Sign in"}</button>
        <button type="button" onClick={reset} className="mt-4 text-[14px] text-muted underline underline-offset-4">Forgot password</button>
      </form>
    </div>
  );
}

function NewPassword({ db, done }: { db: SupabaseClient; done: () => void }) {
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <form
        className="w-full max-w-sm"
        onSubmit={async (e) => {
          e.preventDefault();
          const { error } = await db.auth.updateUser({ password: pw });
          if (error) setMsg(error.message);
          else done();
        }}
      >
        <h1 className="text-2xl font-semibold">Set a new password</h1>
        <input type="password" minLength={8} required value={pw} onChange={(e) => setPw(e.target.value)} className={`${field} mt-5`} aria-label="New password" />
        {msg && <p className="mt-3 text-alert">{msg}</p>}
        <button className={`${btn} mt-5 w-full py-3.5`}>Save password</button>
      </form>
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const db = supabase();
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [recovery, setRecovery] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    if (!db) return;
    db.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = db.auth.onAuthStateChange((event, s) => {
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
      setSession(s);
    });
    return () => data.subscription.unsubscribe();
  }, [db]);

  useEffect(() => {
    if (!db || !session) return setIsAdmin(null);
    db.rpc("is_admin").then(({ data }) => setIsAdmin(Boolean(data)));
  }, [db, session]);

  if (!backendEnabled || !db) return <Setup />;
  if (session === undefined) return <p className="p-8 text-muted">Loading…</p>;
  if (recovery && session) return <NewPassword db={db} done={() => setRecovery(false)} />;
  if (!session) return <Login db={db} />;
  if (isAdmin === null) return <p className="p-8 text-muted">Checking access…</p>;
  if (!isAdmin)
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">This account isn&apos;t an admin</h1>
        <p className="mt-2 text-muted">{session.user.email} can&apos;t open the admin panel. Sign in with the admin email.</p>
        <button onClick={() => db.auth.signOut()} className={`${btn} mt-6`}>Sign out</button>
      </div>
    );

  const active = (href: string) => (href === "/admin/" ? pathname === "/admin" || pathname === "/admin/" : pathname.startsWith(href.slice(0, -1)));

  return (
    <AdminContext.Provider value={{ db, email: session.user.email ?? "" }}>
      <div className="min-h-screen lg:grid lg:grid-cols-[220px_1fr]">
        <aside className="no-print border-b border-line bg-[#070707] lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between px-5 py-4 lg:block lg:py-6">
            <Link href="/admin/" className="flex items-baseline gap-2">
              <Logo className="text-[22px]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Admin</span>
            </Link>
            <button className="text-[13px] font-semibold uppercase tracking-wider lg:hidden" onClick={() => setMenu((v) => !v)} aria-expanded={menu}>
              Menu
            </button>
          </div>
          <nav className={`${menu ? "block" : "hidden"} px-3 pb-4 lg:block`}>
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setMenu(false)}
                className={`block px-3 py-2.5 text-[15px] ${active(n.href) ? "bg-card text-gold-2" : "text-ink/80 hover:text-ink"}`}
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-6 border-t border-line px-3 pt-4 text-[13px] text-muted">
              <p className="truncate">{session.user.email}</p>
              <a href="/" target="_blank" className="mt-2 block hover:text-ink">View store ↗</a>
              <button onClick={() => db.auth.signOut()} className="mt-2 hover:text-ink">Sign out</button>
            </div>
          </nav>
        </aside>
        <main className="min-w-0 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </AdminContext.Provider>
  );
}
