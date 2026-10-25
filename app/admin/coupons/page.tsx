"use client";

import { useCallback, useEffect, useState } from "react";
import { btn, btnGhost, field, useAdmin } from "@/components/admin/AdminShell";
import { Empty, PageTitle, Toast } from "@/components/admin/common";
import { Coupon, Tier } from "@/lib/settings";
import { errorMessage } from "@/lib/supabase";

const blank: Coupon = { code: "", type: "percent", value: 10, tiers: [], min_subtotal: 0, expires_at: null, usage_limit: null, active: true, note: "" };

function describe(c: Coupon) {
  if (c.type === "fixed") return `৳${c.value} off`;
  if (c.type === "percent") return `${c.value}% off`;
  return (c.tiers ?? []).map((t) => `৳${t.min}+ → ${t.percent}%`).join(", ");
}

export default function CouponsPage() {
  const { db } = useAdmin();
  const [list, setList] = useState<Coupon[] | null>(null);
  const [edit, setEdit] = useState<Coupon | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    const { data } = await db.from("coupons").select("*").order("created_at");
    setList((data as Coupon[]) ?? []);
  }, [db]);
  useEffect(() => {
    load();
  }, [load]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!edit) return;
    const c = {
      ...edit,
      code: edit.code.trim().toUpperCase(),
      value: edit.type === "tiered" ? null : Number(edit.value) || 0,
      tiers: edit.type === "tiered" ? (edit.tiers ?? []).filter((t) => t.min >= 0 && t.percent > 0).sort((a, b) => a.min - b.min) : null,
      min_subtotal: Number(edit.min_subtotal) || 0,
      usage_limit: edit.usage_limit ? Number(edit.usage_limit) : null,
      expires_at: edit.expires_at || null,
    };
    if (!/^[A-Z0-9_-]{3,30}$/.test(c.code)) return setToast("Use 3 to 30 letters or numbers for the code.");
    const { error } = isNew ? await db.from("coupons").insert(c) : await db.from("coupons").update(c).eq("code", edit.code);
    if (error) return setToast(error.code === "23505" ? "That code already exists." : errorMessage(error));
    setToast("Coupon saved");
    setEdit(null);
    load();
  }

  async function del(code: string) {
    if (!confirm(`Delete coupon ${code}?`)) return;
    const { error } = await db.from("coupons").delete().eq("code", code);
    if (error) return setToast(errorMessage(error));
    load();
  }

  const setT = (i: number, patch: Partial<Tier>) => setEdit((c) => c && { ...c, tiers: (c.tiers ?? []).map((t, n) => (n === i ? { ...t, ...patch } : t)) });

  return (
    <div>
      <PageTitle title="Coupons">
        <button onClick={() => { setEdit({ ...blank }); setIsNew(true); }} className={btn}>New coupon</button>
      </PageTitle>

      {edit && (
        <form onSubmit={save} className="mb-8 max-w-2xl space-y-4 bg-card p-5 ring-1 ring-line">
          <h2 className="font-semibold">{isNew ? "New coupon" : `Edit ${edit.code}`}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-[13px]">Code<input required disabled={!isNew} value={edit.code} onChange={(e) => setEdit({ ...edit, code: e.target.value.toUpperCase() })} className={`${field} mt-1 uppercase`} /></label>
            <label className="text-[13px]">Type
              <select value={edit.type} onChange={(e) => setEdit({ ...edit, type: e.target.value as Coupon["type"] })} className={`${field} mt-1`}>
                <option value="percent">Percent off</option>
                <option value="fixed">Fixed taka off</option>
                <option value="tiered">Tiered by cart subtotal</option>
              </select>
            </label>
          </div>
          {edit.type === "tiered" ? (
            <div>
              <p className="text-[13px]">Tiers: the highest tier the cart reaches applies</p>
              {(edit.tiers ?? []).map((t, i) => (
                <div key={i} className="mt-2 flex items-center gap-2 text-[14px]">
                  <span>Subtotal ৳</span>
                  <input type="number" min={0} value={t.min} onChange={(e) => setT(i, { min: Number(e.target.value) })} className={`${field} w-28`} aria-label="Minimum subtotal" />
                  <span>or more →</span>
                  <input type="number" min={0} max={100} value={t.percent} onChange={(e) => setT(i, { percent: Number(e.target.value) })} className={`${field} w-20`} aria-label="Percent off" />
                  <span>% off</span>
                  <button type="button" onClick={() => setEdit({ ...edit, tiers: (edit.tiers ?? []).filter((_, n) => n !== i) })} className="text-muted hover:text-alert">Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => setEdit({ ...edit, tiers: [...(edit.tiers ?? []), { min: 0, percent: 5 }] })} className={`${btnGhost} mt-3`}>Add tier</button>
            </div>
          ) : (
            <label className="block text-[13px]">{edit.type === "fixed" ? "Taka off" : "Percent off"}
              <input type="number" min={0} value={edit.value ?? 0} onChange={(e) => setEdit({ ...edit, value: Number(e.target.value) })} className={`${field} mt-1 w-40`} />
            </label>
          )}
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="text-[13px]">Minimum subtotal ৳<input type="number" min={0} value={edit.min_subtotal ?? 0} onChange={(e) => setEdit({ ...edit, min_subtotal: Number(e.target.value) })} className={`${field} mt-1`} /></label>
            <label className="text-[13px]">Use limit (blank = no limit)<input type="number" min={1} value={edit.usage_limit ?? ""} onChange={(e) => setEdit({ ...edit, usage_limit: e.target.value ? Number(e.target.value) : null })} className={`${field} mt-1`} /></label>
            <label className="text-[13px]">Expires<input type="date" value={edit.expires_at?.slice(0, 10) ?? ""} onChange={(e) => setEdit({ ...edit, expires_at: e.target.value ? `${e.target.value}T23:59:59+06:00` : null })} className={`${field} mt-1`} /></label>
          </div>
          <label className="block text-[13px]">Note<input value={edit.note ?? ""} onChange={(e) => setEdit({ ...edit, note: e.target.value })} className={`${field} mt-1`} /></label>
          <label className="flex items-center gap-2 text-[15px]">
            <input type="checkbox" checked={edit.active} onChange={(e) => setEdit({ ...edit, active: e.target.checked })} className="h-4 w-4 accent-[#c8ac56]" /> Active
          </label>
          <div className="flex gap-2">
            <button className={btn}>Save coupon</button>
            <button type="button" onClick={() => setEdit(null)} className={btnGhost}>Cancel</button>
          </div>
        </form>
      )}

      {!list ? (
        <p className="text-muted">Loading…</p>
      ) : list.length === 0 ? (
        <Empty>No coupons yet.</Empty>
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {list.map((c) => (
            <li key={c.code} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="font-semibold">
                  {c.code} {!c.active && <span className="ml-1 text-[12px] text-alert">inactive</span>}
                </p>
                <p className="text-[13px] text-muted">
                  {describe(c)} · used {c.used ?? 0}{c.usage_limit ? ` of ${c.usage_limit}` : ""} times
                  {c.expires_at ? ` · ends ${new Date(c.expires_at).toLocaleDateString("en-GB")}` : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEdit(c); setIsNew(false); }} className={btnGhost}>Edit</button>
                <button onClick={() => del(c.code)} className={`${btnGhost} text-alert`}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Toast msg={toast} onDone={() => setToast("")} />
    </div>
  );
}
