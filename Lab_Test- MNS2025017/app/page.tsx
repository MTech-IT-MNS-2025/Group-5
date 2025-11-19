"use client";

import { useState } from "react";

// Same algorithm as myProg.c, but in JavaScript
function modexpJS(base: number, exp: number, mod: number): number {
  let result = 1;
  base = base % mod;
  while (exp > 0) {
    if (exp & 1) {
      result = (result * base) % mod;
    }
    base = (base * base) % mod;
    exp = exp >> 1;
  }
  return result;
}

export default function Home() {
  const [p, setP] = useState("23");
  const [g, setG] = useState("5");
  const [a, setA] = useState("");
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [K, setK] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCompute = async () => {
    setError("");
    setLoading(true);
    setK("");
    setY("");
    setX("");
    setA("");

    try {
      const pNum = Number(p);
      const gNum = Number(g);
      if (!Number.isFinite(pNum) || !Number.isFinite(gNum) || pNum <= 2) {
        setError("Invalid p or g");
        setLoading(false);
        return;
      }

      // Client side: random a ∈ Z_p*
      const aRand = Math.floor(Math.random() * (pNum - 2)) + 1;
      setA(String(aRand));

      // x = g^a mod p (JS version of myProg.c)
      const xVal = modexpJS(gNum, aRand, pNum);
      setX(String(xVal));

      // <g,p,x> backend ko bhejo (Next API route)
      const response = await fetch("/api/dh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ g: gNum, p: pNum, x: xVal }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error((data as any).error || "Server error");
      }

      const data = await response.json();
      setK(String((data as any).K));
      setY(String((data as any).y));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        background: "#0f172a",
        color: "white",
        padding: "1rem",
      }}
    >
      <div
        style={{
          padding: "1.5rem",
          borderRadius: "0.75rem",
          background: "#020617",
          width: "100%",
          maxWidth: "520px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
        }}
      >
        <h1
          style={{
            fontSize: "1.5rem",
            marginBottom: "0.5rem",
            fontWeight: 600,
          }}
        >
          Diffie–Hellman Key Exchange
        </h1>
        <p
          style={{
            fontSize: "0.9rem",
            opacity: 0.8,
            marginBottom: "1rem",
          }}
        >
          Client: a, x = g^a mod p (JS, same as myProg.c) • API: b, y, K computed
          by C program myProg.c via /api/dh
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            marginBottom: "1rem",
          }}
        >
          <label>
            p (prime):{" "}
            <input
              type="number"
              value={p}
              onChange={(e) => setP(e.target.value)}
              style={{
                width: "100%",
                padding: "0.4rem",
                borderRadius: "0.4rem",
                border: "1px solid #1e293b",
                background: "#020617",
                color: "white",
              }}
            />
          </label>
          <label>
            g (generator):{" "}
            <input
              type="number"
              value={g}
              onChange={(e) => setG(e.target.value)}
              style={{
                width: "100%",
                padding: "0.4rem",
                borderRadius: "0.4rem",
                border: "1px solid #1e293b",
                background: "#020617",
                color: "white",
              }}
            />
          </label>

          <button
            onClick={handleCompute}
            disabled={loading}
            style={{
              marginTop: "0.5rem",
              padding: "0.5rem 0.75rem",
              borderRadius: "0.5rem",
              border: "none",
              cursor: loading ? "wait" : "pointer",
              background: "#22c55e",
              color: "#020617",
              fontWeight: 600,
            }}
          >
            {loading ? "Computing..." : "Start Key Exchange"}
          </button>
        </div>

        {error && (
          <p
            style={{
              marginBottom: "0.75rem",
              color: "#f97373",
              fontSize: "0.85rem",
            }}
          >
            Error: {error}
          </p>
        )}

        <div
          style={{
            borderTop: "1px solid #1e293b",
            paddingTop: "0.75rem",
            marginTop: "0.75rem",
            fontSize: "0.9rem",
          }}
        >
          <h2
            style={{
              fontSize: "1rem",
              marginBottom: "0.5rem",
              fontWeight: 600,
            }}
          >
            Values
          </h2>
          <p>
            <strong>Client → API:</strong>{" "}
            {x ? `< g = ${g}, p = ${p}, x = ${x} >` : "-"}
          </p>
          <p>
            <strong>API (C program) → Client:</strong>{" "}
            {K || y ? `< K = ${K}, y = ${y} >` : "-"}
          </p>
          <p>
            <strong>Client secret a:</strong> {a || "-"}
          </p>
        </div>
      </div>
    </main>
  );
}

