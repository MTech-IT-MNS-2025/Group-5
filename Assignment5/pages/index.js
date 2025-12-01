// pages/index.js
import { useState } from "react";
import { useRouter } from "next/router";
import { generateKEMKeypair } from "../utils/crypto";
import { saveSecretKey } from "../utils/storage";

export default function AuthPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let body = { username, password };

      if (isRegister) {
        // Generate PQC keypair for this user
        const { publicKeyBase64, secretKeyBase64 } = await generateKEMKeypair();

        // Save secret key in IndexedDB (browser only)
        await saveSecretKey(secretKeyBase64);

        body.pqcPublicKey = publicKeyBase64;
      }

      const endpoint = isRegister ? "/api/register" : "/api/login";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      // Save username in localStorage for chat page
      if (typeof window !== "undefined") {
        localStorage.setItem("username", username);
      }

      router.push("/chat");
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>{isRegister ? "Register" : "Login"}</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          style={{ display: "block", marginBottom: 10 }}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          style={{ display: "block", marginBottom: 10 }}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">
          {isRegister ? "Register" : "Login"}
        </button>
      </form>

      <button
        style={{ marginTop: 10 }}
        onClick={() => setIsRegister((v) => !v)}
      >
        {isRegister ? "Already have an account? Login" : "Create new account"}
      </button>
    </div>
  );
}