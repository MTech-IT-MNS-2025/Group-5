// pages/api/messages.js
import { dbConnect } from "../../lib/dbConnect";
import Message from "../../models/Message";

export default async function handler(req, res) {
  try {
    // ✅ Ensure MongoDB connection
    await dbConnect();

    const { user1, user2 } = req.query;

    if (req.method === "GET") {
      if (!user1 || !user2) {
        return res.status(400).json({ error: "Missing user1 or user2" });
      }

      // ✅ Fetch both directions (user1 → user2 and user2 → user1)
      const messages = await Message.find({
        $or: [
          { sender: user1, receiver: user2 },
          { sender: user2, receiver: user1 },
        ],
      }).sort({ timestamp: 1 });

      return res.status(200).json(messages || []);
    }

    if (req.method === "POST") {
      const { sender, receiver, message } = req.body;

      if (!sender || !receiver || !message) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // ✅ Save new message to DB
      const newMessage = new Message({
        sender,
        receiver,
        message,
        timestamp: new Date(),
      });

      await newMessage.save();
      return res.status(201).json(newMessage);
    }

    // ❌ Invalid HTTP method
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("❌ Error in /api/messages:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

