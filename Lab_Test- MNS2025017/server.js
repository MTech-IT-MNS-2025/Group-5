const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

// myProg se base^exp mod mod nikalna
function modexp(base, exp, mod) {
  return new Promise((resolve, reject) => {
    const cmd = `echo "${base} ${exp} ${mod}" | ./myProg`;
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error("modexp error:", error, stderr);
        return reject(error);
      }
      const match = stdout.match(/=\s*([0-9]+)/);
      if (!match) {
        console.error("Cannot parse result from:", stdout);
        console.error("Full output:", stdout);
        return reject(new Error("Parse error"));
      }
      resolve(Number(match[1]));
    });
  });
}

// POST /dh: client <g,p,x> bhejega, server <K,y> dega
app.post("/dh", async (req, res) => {
  try {
    const { g, p, x } = req.body;
    const gNum = Number(g);
    const pNum = Number(p);
    const xNum = Number(x);

    if (
      !Number.isFinite(gNum) ||
      !Number.isFinite(pNum) ||
      !Number.isFinite(xNum)
    ) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // b ← random in [1, p-1]
    const b = Math.floor(Math.random() * (pNum - 2)) + 1;

    // y = g^b mod p   (C program se)
    const y = await modexp(gNum, b, pNum);

    // K = x^b mod p   (C program se)
    const K = await modexp(xNum, b, pNum);

    res.json({ K, y });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

