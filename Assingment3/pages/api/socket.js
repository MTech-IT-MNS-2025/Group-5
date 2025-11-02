// pages/api/socket.js
import { Server } from "socket.io";
import mongoose from "mongoose";
import { dbConnect } from "../../lib/dbConnect.js";
import Message from "../../models/Message.js";

let users = {};

export default async function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("🚀 Starting Socket.io server...");

    // ✅ Connect MongoDB once
    if (mongoose.connection.readyState === 0) {
      await dbConnect();
      console.log("✅ MongoDB connected for Socket.io");
    }

    const io = new Server(res.socket.server, {
      path: "/api/socket.io",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("🟢 Connected:", socket.id);

      // Register user
      socket.on("register_user", (username) => {
        users[username] = socket.id;
        console.log(`✅ ${username} registered (${socket.id})`);
        console.log("👥 Active users:", users);
      });

      // Send message
      socket.on("send_message", async ({ sender, receiver, message }) => {
        console.log(`📩 ${sender} → ${receiver}: ${message}`);

        try {
          // Save to MongoDB
          await Message.create({ sender, receiver, message });

          // Send to receiver if online
          const receiverSocketId = users[receiver];
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("receive_message", { sender, message });
            console.log(`✅ Delivered to ${receiver}`);
          } else {
            console.log(`⚠️ ${receiver} not online`);
          }
        } catch (error) {
          console.error("❌ DB error saving message:", error);
        }
      });

      // Handle disconnect
      socket.on("disconnect", () => {
        for (const [name, id] of Object.entries(users)) {
          if (id === socket.id) delete users[name];
        }
        console.log("🔴 Disconnected:", socket.id);
        console.log("👥 Remaining users:", users);
      });
    });
  } else {
    console.log("⚙️ Socket.io already running");
  }

  res.end();
}

