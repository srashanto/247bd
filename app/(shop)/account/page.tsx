"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import OrderCard from "@/components/OrderCard";
import { displayName, useAuth } from "@/lib/auth";
import { Order } from "@/lib/orders";
import { districts } from "@/lib/settings";
import { errorMessage, supabase } from "@/lib/supabase";

const input = "w-full border border-line bg-card px-3.5 py-3 text-[16px] outline-none placeholder:text-muted/70 focus:border-gold";

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.2 14.6 2.2 12 2.2 6.6 2.2 2.3 6.6 2.3 12s4.3 9.8 9.7 9.8c5.6 0 9.3-3.9 9.3-9.5 0-.6-.1-1.1-.2-1.6H12Z" />
  </svg>
);

function SignIn() {
  const db = supabase()!;
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function google() {
    const { error } = await db.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/account/` } });
    if (error) setMsg({ ok: false, text: errorMessage(error) });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    if (mode === "in") {
      const { error } = await db.auth.signInWithPassword({ email: email.trim(), password });
      if (error)
        setMsg({
          ok: false,
          text: error.message === "Invalid login credentials" ? "Wrong email or password." : error.message === "Email not confirmed" ? "Confirm your email first. Check your inbox for the link we sent." : error.message,
        });
    } else {
      const { data, error } = await db.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { name: name.trim() }, emailRedirectTo: `${location.origin}/account/` },
      });
      if (error) setMsg({ ok: false, text: error.message });
      else if (!data.session) setMsg({ ok: true, text: `Almost done. We sent a link to ${email.trim()}. Open it to confirm your account.` });
    }
    setBusy(false);
  }

  async function forgot() {
    if (!email.trim()) return setMsg({ ok: false, text: "Type your email above, then tap Forgot password." });
    const { error } = await db.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${location.origin}/account/` });
    setMsg(error ? { ok: false, text: errorMessage(error) } : { ok: true, text: "Check your email for a link to set a new password." });
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:py-14">
      <h1 className="text-3xl font-semibold">{mode === "in" ? "Sign in" : "Create an account"}</h1>
      <p className="mt-2 text-muted">Track every order, save your address for faster checkout, and keep your wishlist on any device.</p>

      <button onClick={google} className="mt-7 flex w-full items-center justify-center gap-3 border border-line bg-white py-3.5 text-[15px] font-semibold text-[#1f1f1f] hover:bg-[#f2f2f2]">
        <GoogleLogo /> Continue with Google
      </button>

      <div className="my-6 flex items-center gap-3 text-[13px] text-muted">
        <span className="h-px flex-1 bg-line" /> or with email <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={submit} className="space-y-4">
        {mode === "up" && (
          <label className="block text-[14px]">
            Full name
            <input required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={`${input} mt-1.5`} />
          </label>
        )}
        <label className="block text-[14px]">
          Email
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${input} mt-1.5`} />
        </label>
        <label className="block text-[14px]">
          Password
          <input
            type="password"
            required
            minLength={6}
            autoComplete={mode === "in" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${input} mt-1.5`}
          />
          {mode === "up" && <span className="mt-1 block text-[13px] text-muted">At least 6 characters</span>}
        </label>
        {msg && <p role="status" className={`text-[15px] ${msg.ok ? "text-uni" : "text-alert"}`}>{msg.text}</p>}
        <button disabled={busy} className="btn-gold w-full py-4 text-[14px] disabled:opacity-60">
          {busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}
        </button>
      </form>

      <div className="mt-5 flex flex-wrap justify-between gap-3 text-[14px]">
        <button onClick={() => { setMode(mode === "in" ? "up" : "in"); setMsg(null); }} className="font-semibold underline underline-offset-4">
          {mode === "in" ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>
        {mode === "in" && <button onClick={forgot} className="text-muted underline underline-offset-4">Forgot password</button>}
      </div>

      <p className="mt-10 border-t border-line pt-6 text-[14px] text-muted">
        You don&apos;t need an account to order. <Link href="/orders/" className="text-ink underline underline-offset-4">Track an order</Link> with its number and your phone.
      </p>
    </div>
  );
}

function NewPassword() {
  const db = supabase()!;
  const { doneRecovering } = useAuth();
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  return (
    <form
      className="mx-auto max-w-md px-4 py-14"
      onSubmit={async (e) => {
        e.preventDefault();
        const { error } = await db.auth.updateUser({ password: pw });
        if (error) setMsg(error.message);
        else doneRecovering();
      }}
    >
      <h1 className="text-3xl font-semibold">Set a new password</h1>
      <input type="password" minLength={6} required value={pw} onChange={(e) => setPw(e.target.value)} className={`${input} mt-6`} aria-label="New password" />
      {msg && <p className="mt-3 text-alert">{msg}</p>}
      <button className="btn-gold mt-5 w-full py-4 text-[14px]">Save password</button>
    </form>
  );
}

function AddressForm() {
  const { profile, saveProfile } = useAuth();
  const [f, setF] = useState({ name: "", phone: "", district: "Dhaka", area: "", address: "" });
  const [msg, setMsg] = useState("");
  useEffect(() => {
    if (profile)
      setF({ name: profile.name ?? "", phone: profile.phone ?? "", district: profile.district ?? "Dhaka", area: profile.area ?? "", address: profile.address ?? "" });
  }, [profile]);
  const set = (k: keyof typeof f, v: string) => setF((x) => ({ ...x, [k]: v }));

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const phone = f.phone.replace(/[\s-]/g, "");
        if (phone && !/^(\+?88)?01[3-9]\d{8}$/.test(phone)) return setMsg("Enter an 11-digit Bangladeshi mobile number.");
        const err = await saveProfile({ ...f, phone });
        setMsg(err ?? "Saved. We'll fill this in for you at checkout.");
      }}
      className="grid gap-4 sm:grid-cols-2"
    >
      <label className="text-[14px]">Full name<input value={f.name} onChange={(e) => set("name", e.target.value)} className={`${input} mt-1.5`} /></label>
      <label className="text-[14px]">Mobile number<input inputMode="tel" placeholder="01XXXXXXXXX" value={f.phone} onChange={(e) => set("phone", e.target.value)} className={`${input} mt-1.5`} /></label>
      <label className="text-[14px]">District
        <select value={f.district} onChange={(e) => set("district", e.target.value)} className={`${input} mt-1.5`}>
          {districts.map((d) => <option key={d}>{d}</option>)}
        </select>
      </label>
      <label className="text-[14px]">Area / Thana<input value={f.area} onChange={(e) => set("area", e.target.value)} className={`${input} mt-1.5`} /></label>
      <label className="text-[14px] sm:col-span-2">Full address<input placeholder="House, road, area" value={f.address} onChange={(e) => set("address", e.target.value)} className={`${input} mt-1.5`} /></label>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button className="btn-gold px-6 py-3 text-[13px]">Save address</button>
        {msg && <span className="text-[14px] text-muted">{msg}</span>}
      </div>
    </form>
  );
}

function Dashboard() {
  const db = supabase()!;
  const { user, profile, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    db.rpc("my_orders").then(({ data }) => setOrders((data as Order[]) ?? []));
  }, [db]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-gold">My account</p>
          <h1 className="mt-1 text-3xl font-semibold">Hi, {displayName(user, profile)}</h1>
          <p className="text-[14px] text-muted">{user?.email}</p>
        </div>
        <button onClick={signOut} className="btn-ghost px-5 py-2.5 text-[13px]">Sign out</button>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">My orders</h2>
        {!orders ? (
          <p className="mt-4 text-muted">Loading…</p>
        ) : orders.length === 0 ? (
          <div className="mt-4 bg-card p-8 text-center ring-1 ring-line">
            <p className="text-muted">No orders yet. Orders you place while signed in show up here.</p>
            <Link href="/products/" className="btn-gold mt-5 inline-block px-6 py-3">Start shopping</Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-4">{orders.map((o) => <OrderCard key={o.id} o={o} />)}</ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Delivery address</h2>
        <p className="mt-1 text-[14px] text-muted">Saved here, filled in for you at checkout.</p>
        <div className="mt-5"><AddressForm /></div>
      </section>

      <section className="mt-12 border-t border-line pt-6 text-[14px] text-muted">
        <Link href="/wishlist/" className="text-ink underline underline-offset-4">My wishlist</Link>
        <span className="mx-2">·</span>
        <Link href="/orders/" className="text-ink underline underline-offset-4">Track an order by number</Link>
      </section>
    </div>
  );
}

export default function AccountPage() {
  const { enabled, ready, user, recovering } = useAuth();
  if (!enabled)
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-3xl font-semibold">Accounts are coming soon</h1>
        <p className="mt-2 text-muted">You can still order without an account and track it with your order number.</p>
        <Link href="/orders/" className="btn-gold mt-6 inline-block px-6 py-3">Track an order</Link>
      </div>
    );
  if (!ready) return <p className="mx-auto max-w-md px-4 py-24 text-center text-muted">Loading…</p>;
  if (recovering && user) return <NewPassword />;
  return user ? <Dashboard /> : <SignIn />;
}
