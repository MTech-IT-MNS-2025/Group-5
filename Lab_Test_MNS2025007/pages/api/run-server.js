import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    const { g, p, x } = req.body;

    const _g = BigInt(g);
    const _p = BigInt(p);
    const _x = BigInt(x);

    const wasmPath = path.join(process.cwd(), "public", "modexp_server.wasm");
    const buffer = fs.readFileSync(wasmPath);

    const wasm = await WebAssembly.instantiate(buffer, {
      env: {
        memory: new WebAssembly.Memory({ initial: 256 })
      }
    });

    const exp = wasm.instance.exports;

    // IMPORTANT: Use the correct exported name (modexp)
    const modexp = exp.modexp;

    if (!modexp) {
      console.error("EXPORTS:", Object.keys(exp));
      return res.status(500).json({ error: "modexp not exported from WASM" });
    }

    // random b in [2, p-2]
    const b = BigInt(Math.floor(Math.random() * (Number(p) - 3)) + 2);

    const y = modexp(_g, b, _p);     // g^b mod p
    const K = modexp(_x, b, _p);     // x^b mod p

    res.json({
      y: y.toString(),
      K: K.toString(),
      b: b.toString()
    });

  } catch (e) {
    console.error("SERVER ERROR:", e);
    res.status(500).json({ error: e.message });
  }
}

