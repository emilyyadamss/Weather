"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setStatus(`Already logged in as ${data.user.email}`);
    });
  }, []);

  async function signUp() {
    setStatus("Signing up...");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setStatus(error.message);
    else setStatus("Signed up! (If email confirm is on, check your inbox.)");
  }

  async function signIn() {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    console.log("signIn data:", data);
    console.log("signIn error:", error);
  
    const sessionRes = await supabase.auth.getSession();
    console.log("getSession:", sessionRes.data.session);
  }  

  async function signOut() {
    await supabase.auth.signOut();
    setStatus("Signed out");
  }

  return (
    <main style={{ padding: 24, maxWidth: 420 }}>
      <h1>Login</h1>

      <label>Email</label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: 12 }}
      />

      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 12 }}
      />

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={signUp}>Sign up</button>
        <button onClick={signIn}>Sign in</button>
        <button onClick={signOut}>Sign out</button>
      </div>

      <p style={{ marginTop: 12 }}>{status}</p>
    </main>
  );
}
