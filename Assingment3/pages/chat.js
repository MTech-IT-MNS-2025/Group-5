// pages/chat.js
import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function ChatPage() {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Initialize socket connection once
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      window.location.href = "/login";
      return;
    }

    setUsername(storedUsername);

    const setupSocket = async () => {
      await fetch("/api/socket");
      const newSocket = io({ path: "/api/socket.io" });

      newSocket.on("connect", () => {
        console.log("🟢 Socket connected:", newSocket.id);
        newSocket.emit("register_user", storedUsername);
      });

      newSocket.on("receive_message", (msg) => {
        console.log("📩 Received:", msg);
        setMessages((prev) => [...prev, msg]);
      });

      setSocket(newSocket);
    };

    setupSocket();

    return () => {
      socket?.disconnect();
    };
  }, []);

  // Load chat history
  useEffect(() => {
    if (username && recipient) {
      fetch(`/api/messages?user1=${username}&user2=${recipient}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setMessages(data);
        })
        .catch((err) => console.error("Error fetching messages:", err));
    }
  }, [recipient]);

  const sendMessage = () => {
    if (!message.trim() || !recipient) return;

    const newMsg = { sender: username, receiver: recipient, message };
    socket.emit("send_message", newMsg);
    setMessages((prev) => [...prev, newMsg]);
    setMessage("");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Welcome, {username}</h2>

      <input
        type="text"
        placeholder="Recipient username"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="border p-2 w-full mb-4 rounded-lg"
      />

      <div className="border p-4 h-96 overflow-y-auto bg-gray-50 rounded-lg mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`my-2 ${
              msg.sender === username ? "text-right" : "text-left"
            }`}
          >
            <p
              className={`inline-block p-2 rounded-lg ${
                msg.sender === username
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              <strong>{msg.sender}:</strong> {msg.message}
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 flex-grow rounded-lg"
        />
        <button
          onClick={sendMessage}
          disabled={!socket}
          className={`px-4 py-2 rounded-lg text-white ${
            socket ? "bg-green-500 hover:bg-green-600" : "bg-gray-400"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
}

