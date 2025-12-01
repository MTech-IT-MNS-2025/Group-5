// pages/api/publicKey.js
import { dbConnect } from "../../lib/dbConnect";
import User from "../../models/User";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await dbConnect();

  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: "Missing username" });
  }

  try {
    const user = await User.findOne({ username }).lean();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.pqcPublicKey) {
      return res.status(404).json({ error: "PQC public key not set" });
    }

    return res.status(200).json({
      username: user.username,
      pqcPublicKey: user.pqcPublicKey,
    });
  } catch (err) {
    console.error("Public key API error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}