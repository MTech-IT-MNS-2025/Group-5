// pages/api/register.js
import bcrypt from "bcryptjs";
import { dbConnect } from "../../lib/dbConnect";
import User from "../../models/User";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  await dbConnect();

  const { username, password, pqcPublicKey } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  try {
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashed,
      pqcPublicKey: pqcPublicKey || null,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        username: newUser.username,
        pqcPublicKey: newUser.pqcPublicKey,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}