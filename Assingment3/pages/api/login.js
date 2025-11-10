// pages/api/login.js
import bcrypt from "bcryptjs";
import { dbConnect } from "../../lib/dbConnect";
import User from "../../models/User";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  await dbConnect();

  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "Missing username or password" });

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    return res.status(200).json({ message: "Login successful", username });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
