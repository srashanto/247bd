"use client";

import { useEffect, useState } from "react";
import { btn, field, useAdmin } from "@/components/admin/AdminShell";
import { PageTitle, Toast } from "@/components/admin/common";
import { defaultSettings, Settings } from "@/lib/settings";
import { errorMessage } from "@/lib/supabase";

export default function SettingsPage() {
  const { db } = useAdmin();
  const [s, setS] = useState<Settings | null>(null);
  const [admins, setAdmins] = useState<string[]>([]);
  const [newAdmin, setNewAdmin] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    db.from("settings").select("data").eq("id", 1).maybeSingle().then(({ data }) => setS({ ...defaultSettings, ...(data?.data ?? {}) }));
    db.from("admins").select("email").then(({ data }) => setAdmins((data ?? []).map((a) => a.email)));
  }, [db]);

  if (!s) return <p className="text-muted">Loading…</p>;
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setS({ ...s, [k]: v });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await db.from("settings").upsert({ id: 1, data: s, updated_at: new Date().toISOString() });
    setBusy(false);
    setToast(error ? errorMessage(error) : "Settings saved. The store updates right away.");
  }

  async function addAdmin(e: React.FormEvent) {
    e.preventDefault();
    const email = newAdmin.trim().toLowerCase();
    if (!email) return;
    const { error } = await db.from("admins").insert({ email });
    if (error) return setToast(errorMessage(error));
    setAdmins([...admins, email]);
    setNewAdmin("");
    setToast(`${email} can now sign in, once you create that user in Supabase → Authentication.`);
  }

  async function removeAdmin(email: string) {
    if (admins.length <= 1) return setToast("Keep at least one admin.");
    if (!confirm(`Remove ${email} as admin?`)) return;
    const { error } = await db.from("admins").delete().eq("email", email);
    if (error) return setToast(errorMessage(error));
    setAdmins(admins.filter((a) => a !== email));
  }

  const L = "block text-[13px] font-medium text-ink/85";
  const num = (k: "deliveryInsideDhaka" | "deliveryOutsideDhaka" | "freeDeliveryOver") => (
    <input type="number" min={0} value={s[k]} onChange={(e) => set(k, Number(e.target.value))} className={`${field} mt-1`} />
  );

  return (
    <div className="max-w-3xl">
      <PageTitle title="Settings" />
      <form onSubmit={save} className="space-y-6">
        <section className="space-y-4 bg-card p-5 ring-1 ring-line">
          <h2 className="font-semibold">Delivery</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className={L}>Inside Dhaka ৳{num("deliveryInsideDhaka")}</label>
            <label className={L}>Outside Dhaka ৳{num("deliveryOutsideDhaka")}</label>
            <label className={L}>Free delivery over ৳ (0 = off){num("freeDeliveryOver")}</label>
          </div>
        </section>

        <section className="space-y-4 bg-card p-5 ring-1 ring-line">
          <h2 className="font-semibold">Payment</h2>
          <label className="flex items-center gap-2 text-[15px]">
            <input type="checkbox" checked={s.advancePayment} onChange={(e) => set("advancePayment", e.target.checked)} className="h-4 w-4 accent-[#c8ac56]" />
            Customers must pay the delivery charge in advance to confirm an order
          </label>
          <div className="grid gap-4 sm:grid-cols-3">
            {(["bkash", "nagad", "rocket"] as const).map((m) => (
              <label key={m} className={L}>{m === "bkash" ? "bKash" : m === "nagad" ? "Nagad" : "Rocket"} number
                <input value={s.paymentNumbers[m]} onChange={(e) => set("paymentNumbers", { ...s.paymentNumbers, [m]: e.target.value })} className={`${field} mt-1`} />
              </label>
            ))}
          </div>
        </section>

        <section className="space-y-4 bg-card p-5 ring-1 ring-line">
          <h2 className="font-semibold">Store messages</h2>
          <label className={L}>Scrolling announcement bar (one message per line)
            <textarea rows={4} value={s.announcements.join("\n")} onChange={(e) => set("announcements", e.target.value.split("\n").map((x) => x.trim()).filter(Boolean))} className={`${field} mt-1`} />
          </label>
          <label className={L}>Coupon notice on product pages
            <input value={s.couponNotice} onChange={(e) => set("couponNotice", e.target.value)} className={`${field} mt-1`} />
          </label>
          <label className={L}>Footer tagline
            <input value={s.tagline} onChange={(e) => set("tagline", e.target.value)} className={`${field} mt-1`} />
          </label>
        </section>

        <section className="space-y-4 bg-card p-5 ring-1 ring-line">
          <h2 className="font-semibold">Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={L}>Phone<input value={s.phone} onChange={(e) => set("phone", e.target.value)} className={`${field} mt-1`} /></label>
            <label className={L}>WhatsApp (with 880, no +)<input value={s.whatsapp} onChange={(e) => set("whatsapp", e.target.value.replace(/\D/g, ""))} className={`${field} mt-1`} /></label>
            <label className={L}>Email<input value={s.email} onChange={(e) => set("email", e.target.value)} className={`${field} mt-1`} /></label>
            <label className={L}>Facebook page link<input value={s.facebook} onChange={(e) => set("facebook", e.target.value)} className={`${field} mt-1`} /></label>
            <label className={`${L} sm:col-span-2`}>Address<input value={s.address} onChange={(e) => set("address", e.target.value)} className={`${field} mt-1`} /></label>
          </div>
        </section>

        <button disabled={busy} className={`${btn} py-3.5`}>{busy ? "Saving…" : "Save settings"}</button>
      </form>

      <section className="mt-10 bg-card p-5 ring-1 ring-line">
        <h2 className="font-semibold">Admins</h2>
        <p className="mt-1 text-[13px] text-muted">People who can open this panel. Each one also needs a user in Supabase → Authentication → Users.</p>
        <ul className="mt-3 divide-y divide-line">
          {admins.map((a) => (
            <li key={a} className="flex items-center justify-between py-2 text-[15px]">
              {a}
              <button onClick={() => removeAdmin(a)} className="text-[13px] text-muted hover:text-alert">Remove</button>
            </li>
          ))}
        </ul>
        <form onSubmit={addAdmin} className="mt-3 flex gap-2">
          <input type="email" value={newAdmin} onChange={(e) => setNewAdmin(e.target.value)} placeholder="email@example.com" className={field} aria-label="New admin email" />
          <button className={btn}>Add</button>
        </form>
      </section>
      <Toast msg={toast} onDone={() => setToast("")} />
    </div>
  );
}
