"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export type Profile = {
  id: string;
  name: string | null;
  phone: string | null;
  district: string | null;
  area: string | null;
  address: string | null;
  wishlist: string[];
};

type AuthValue = {
  /** False when the store has no database connected, so accounts are off. */
  enabled: boolean;
  ready: boolean;
  user: User | null;
  profile: Profile | null;
  /** True after a password-reset link brought the customer back here. */
  recovering: boolean;
  saveProfile: (patch: Partial<Profile>) => Promise<string | null>;
  signOut: () => Promise<void>;
  doneRecovering: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function displayName(user: User | null, profile: Profile | null) {
  const meta = user?.user_metadata as { full_name?: string; name?: string } | undefined;
  return profile?.name || meta?.full_name || meta?.name || user?.email?.split("@")[0] || "";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const db = supabase();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(!db);
  const [recovering, setRecovering] = useState(false);

  useEffect(() => {
    if (!db) return;
    db.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) setReady(true);
    });
    const { data } = db.auth.onAuthStateChange((event, s) => {
      if (event === "PASSWORD_RECOVERY") setRecovering(true);
      setSession(s);
      if (!s) {
        setProfile(null);
        setReady(true);
      }
    });
    return () => data.subscription.unsubscribe();
  }, [db]);

  // Load the profile, creating it the first time a customer signs in.
  useEffect(() => {
    if (!db || !session) return;
    let alive = true;
    (async () => {
      const uid = session.user.id;
      const { data } = await db.from("profiles").select("id, name, phone, district, area, address, wishlist").eq("id", uid).maybeSingle();
      let p = data as Profile | null;
      if (!p) {
        const meta = session.user.user_metadata as { full_name?: string; name?: string };
        const { data: created } = await db
          .from("profiles")
          .upsert({ id: uid, name: meta?.full_name || meta?.name || null })
          .select("id, name, phone, district, area, address, wishlist")
          .single();
        p = created as Profile | null;
      }
      if (alive) {
        setProfile(p);
        setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [db, session]);

  const saveProfile = useCallback(
    async (patch: Partial<Profile>) => {
      if (!db || !session) return "Sign in first.";
      const { data, error } = await db
        .from("profiles")
        .upsert({ id: session.user.id, ...patch, updated_at: new Date().toISOString() })
        .select("id, name, phone, district, area, address, wishlist")
        .single();
      if (error) return error.message;
      setProfile(data as Profile);
      return null;
    },
    [db, session]
  );

  const value = useMemo<AuthValue>(
    () => ({
      enabled: Boolean(db),
      ready,
      user: session?.user ?? null,
      profile,
      recovering,
      saveProfile,
      signOut: async () => {
        await db?.auth.signOut();
      },
      doneRecovering: () => setRecovering(false),
    }),
    [db, ready, session, profile, recovering, saveProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
