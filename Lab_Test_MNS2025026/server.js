const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

// SERVER-RANDOM b
function randomB(p) {
  return Math.floor(Math.random() * (p - 2)) + 2;
}

// Import WASM for modexp
const MyProgModule = require("./myProg.js");

let wasm;

MyProgModule().then(instance => {
  wasm = instance;
  console.log("WASM Loaded on Server");
});

// Handle DH request
app.post("/dh", (req, res) => {
  const { g, p, x } = req.body;

  const b = randomB(p);
  const y = wasm._modexp(g, b, p);   // g^b mod p
  const K = wasm._modexp(x, b, p);   // x^b mod p

  res.json({ K, y });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});