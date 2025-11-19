"use client";
import { useState } from "react";

export default function Home() {
  const [p, setP] = useState("");
  const [g, setG] = useState("");
  const [x, setX] = useState("");
  const [result, setResult] = useState(null);

  async function wasmModExp(g, a, p) {
    const wasmFile = await fetch("/compute.wasm");
    const buffer = await wasmFile.arrayBuffer();
    const module = await WebAssembly.instantiate(buffer);
    return module.instance.exports.modexp(g, a, p);
  }

  async function handleConnect() {
    const pInt = parseInt(p);
    const gInt = parseInt(g);

    const a = Math.floor(Math.random() * (pInt - 2)) + 1;

    const xValue = await wasmModExp(gInt, a, pInt);
    setX(xValue);

    const response = await fetch("http://localhost:5000/exchange", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ g: gInt, p: pInt, x: xValue, a })
    });

    const data = await response.json();
    setResult(data);
  }

  return (
    <main style={{ backgroundColor: "#b6c7e4", height: "100vh", padding: 80 }}>
      <h3>Enter the Value of p:</h3>
      <input value={p} onChange={e => setP(e.target.value)} />

      <h3>Enter the Value of g:</h3>
      <input value={g} onChange={e => setG(e.target.value)} />

      <br /><br />
      <button onClick={handleConnect}>CONNECT</button>

      <h3>Your Public Key x:</h3>
      <p>{x}</p>

      {result && (
        <div style={{ marginTop: 20, background: "white", width: 200, padding: 15 }}>
          <p>K = {result.K}</p>
          <p>y = {result.y}</p>
          <p>a = {result.a}</p>
        </div>
      )}
    </main>
  );
}

