// pages/index.js
import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;
    localStorage.setItem("username", trimmed);
    router.push("/chat");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <form onSubmit={handleSubmit} style={{ width: 360, padding: 24, border: "1px solid #ddd", borderRadius: 8 }}>
        <h2>Login</h2>
        <div style={{ marginBottom: 12 }}>
          <label>Your username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. alice"
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </div>
        <button type="submit" style={{ width: "100%", padding: 10 }}>Continue to chat</button>
      </form>
    </div>
  );
}

