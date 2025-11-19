import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

let wasm;

async function loadWasm() {
  const bytes = fs.readFileSync("./compute.wasm");
  const result = await WebAssembly.instantiate(bytes);
  wasm = result.instance.exports;
}
loadWasm();

app.post("/exchange", (req, res) => {
  const { g, p, x, a } = req.body;

  const b = Math.floor(Math.random() * (p - 2)) + 1;

  const y = wasm.modexp(g, b, p);
  const K = wasm.modexp(x, b, p);

  console.log("SERVER Calculated ->", { y, K, b });

  res.json({ y, K, a });
});

app.listen(5000, () => console.log("Server running at http://localhost:5000"));

