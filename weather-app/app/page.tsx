"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Favorite = {
  id: string;
  user_id: string;
  label: string | null;
  city: string;
  country: string | null;
  created_at: string;
};

export default function Home() {
  const [email, setEmail] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function loadFavorites() {
    setErrorMsg("");
    const { data, error } = await supabase
      .from("favorite_locations")
      .select("id,user_id,label,city,country,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      //console.error("load error:", error);
      setErrorMsg(error.message);
      return;
    }
    setFavorites(data ?? []);
  }

  async function saveBoston() {
    setErrorMsg("");

    const { data: userRes, error: userErr } = await supabase.auth.getUser();
    if (userErr) {
      console.error("getUser error:", userErr);
      setErrorMsg(userErr.message);
      return;
    }
    const user = userRes.user;
    if (!user) {
      setErrorMsg("Not logged in");
      return;
    }

    const { data, error } = await supabase
      .from("favorite_locations")
      .insert({
        user_id: user.id,
        label: "Home",
        city: "Boston",
        country: "US",
      })
      .select()
      .single();

    if (error) {
      console.error("insert error:", error);
      setErrorMsg(error.message);
      return;
    }

    console.log("inserted row:", data);
    await loadFavorites();
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
    loadFavorites();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <div>Logged in as: {email ?? "NOT LOGGED IN"}</div>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button onClick={saveBoston}>Save Boston</button>
        <button onClick={loadFavorites}>Reload</button>
      </div>

      {errorMsg && <p style={{ marginTop: 12 }}>Error: {errorMsg}</p>}

      <h2 style={{ marginTop: 20 }}>Favorites</h2>
      <ul>
        {favorites.map((f) => (
          <li key={f.id}>
            {f.label ? `${f.label}: ` : ""}
            {f.city}
            {f.country ? `, ${f.country}` : ""} — {f.user_id}
          </li>
        ))}
      </ul>
    </main>
  );
}
