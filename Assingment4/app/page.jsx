"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [wasmLoaded, setWasmLoaded] = useState(false);
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [output, setOutput] = useState("");
  const [cipherBytes, setCipherBytes] = useState(null); // no TypeScript type

  useEffect(() => {
    (async () => {
      const resp = await fetch("/rc4/rc4.wasm");
      const buf = await resp.arrayBuffer();
      const { instance } = await WebAssembly.instantiate(buf);

      window.wasm = instance.exports; // no TS casting
      setWasmLoaded(true);
    })();
  }, []);

  const encode = (str) => new TextEncoder().encode(str);
  const decode = (bytes) => new TextDecoder().decode(bytes);

  const toHex = (arr) =>
    Array.from(arr).map((x) => x.toString(16).padStart(2, "0")).join(" ");

  const fromHex = (hex) =>
    new Uint8Array(hex.split(" ").map((h) => parseInt(h, 16)));

  const runEncrypt = () => {
    const wasm = window.wasm;
    const mem = new Uint8Array(wasm.memory.buffer);

    const keyBytes = encode(key);
    const keyPtr = 512;
    mem.set(keyBytes, keyPtr);

    const ptBytes = encode(text);
    const dataPtr = 1024;
    mem.set(ptBytes, dataPtr);

    wasm.ksa(keyPtr, keyBytes.length);
    wasm.rc4(dataPtr, ptBytes.length);

    const encrypted = new Uint8Array(wasm.memory.buffer, dataPtr, ptBytes.length);

    setCipherBytes(new Uint8Array(encrypted));
    setOutput(toHex(encrypted)); // show ciphertext as hex
  };

  const runDecrypt = () => {
    if (!cipherBytes) return;

    const wasm = window.wasm;
    const mem = new Uint8Array(wasm.memory.buffer);

    const keyBytes = encode(key);
    const keyPtr = 512;
    mem.set(keyBytes, keyPtr);

    const dataPtr = 1024;
    mem.set(cipherBytes, dataPtr);

    wasm.ksa(keyPtr, keyBytes.length);
    wasm.rc4(dataPtr, cipherBytes.length);

    const decrypted = new Uint8Array(wasm.memory.buffer, dataPtr, cipherBytes.length);
    setOutput(decode(decrypted)); // output plaintext
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>RC4 Encryption using WebAssembly</h1>

      <div>Key:</div>
      <input
        style={{ width: 300 }}
        value={key}
        onChange={(e) => setKey(e.target.value)}
      />

      <div style={{ marginTop: 10 }}>Text:</div>
      <input
        style={{ width: 300 }}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div style={{ marginTop: 20 }}>
        <button onClick={runEncrypt} style={{ marginRight: 10 }}>
          Encrypt
        </button>
        <button onClick={runDecrypt}>Decrypt</button>
      </div>

      <div style={{ marginTop: 20 }}>
        <strong>Output:</strong>
        <div
          style={{
            marginTop: 10,
            padding: 10,
            background: "#222",
            color: "#fff",
            width: 400,
          }}
        >
          {output}
        </div>
      </div>
    </div>
  );
}