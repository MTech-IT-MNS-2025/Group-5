// pages/api/socket.js
import { Server } from "socket.io";

let io;
const connectedUsers = {}; // username -> socket.id

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("🔐 Initializing Socket.io server...");

    io = new Server(res.socket.server, {
      path: "/api/socket.io",
      addTrailingSlash: false,
      cors: { origin: "*", methods: ["GET", "POST"] },
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("🟢 User connected:", socket.id);

      socket.on("register_user", (username) => {
        connectedUsers[username] = socket.id;
        console.log(`📌 Registered user: ${username} → ${socket.id}`);
      });

      socket.on("send_message", (packet) => {
        const { sender, receiver } = packet;
        console.log(`📩 Encrypted packet from ${sender} → ${receiver}`);

        const targetSocket = connectedUsers[receiver];
        if (targetSocket) {
          io.to(targetSocket).emit("receive_message", packet);
        } else {
          console.log(`⚠️ ${receiver} is offline.`);
        }
      });

      socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);

        for (const username in connectedUsers) {
          if (connectedUsers[username] === socket.id) {
            delete connectedUsers[username];
            break;
          }
        }
      });
    });
  } else {
    // socket server already running
  }

  res.end();
}