import { useEffect, useState } from "react";

export default function Home() {
  const [p, setP] = useState("");
  const [g, setG] = useState("");
  const [a, setA] = useState(null);
  const [x, setX] = useState(null);
  const [serverY, setServerY] = useState(null);
  const [serverK, setServerK] = useState(null);
  const [finalK, setFinalK] = useState(null);
  const [modexpFn, setModexpFn] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/modexp.js";
    script.onload = async () => {
      const module = await window.createModexpModule();
      const fn = module.cwrap(
        "modexp",
        "bigint",
        ["bigint", "bigint", "bigint"]
      );
      setModexpFn(() => fn);
      setReady(true);
    };
    document.body.appendChild(script);
  }, []);

  const runDH = async () => {
    if (!ready) {
      alert("WASM not ready");
      return;
    }

    // Convert to BigInt
    const _p = BigInt(p);
    const _g = BigInt(g);

    // Random a in [2, p-2]
    const randA = Math.floor(Math.random() * (Number(p) - 3)) + 2;
    const _a = BigInt(randA);
    setA(_a.toString());

    // Client computes x = g^a mod p
    const _x = modexpFn(_g, _a, _p);
    setX(_x.toString());

    // Send to server
    const resp = await fetch("/api/run-server", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        g: g,
        p: p,
        x: _x.toString()
      })
    });

    const data = await resp.json();

    setServerY(data.y);
    setServerK(data.K);

    // Client computes final shared key K' = y^a mod p
    const clientK = modexpFn(BigInt(data.y), _a, _p);
    setFinalK(clientK.toString());
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Diffie-Hellman Demo</h2>

      <input
        placeholder="p"
        value={p}
        onChange={(e) => setP(e.target.value)}
      />
      <input
        placeholder="g"
        value={g}
        onChange={(e) => setG(e.target.value)}
      />

      <button onClick={runDH}>Run</button>

      <p>a : {a}</p>
      <p>x : {x}</p>

      <p>y : {serverY}</p>
      <p>K : {serverK}</p>

      
    </div>
  );
}

