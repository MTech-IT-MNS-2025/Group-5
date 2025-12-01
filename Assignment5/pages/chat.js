// pages/chat.js
import { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  encapsulate,
  decapsulate,
  aesEncrypt,
  aesDecrypt,
} from "../utils/crypto";
import {
  loadSecretKey,
  saveSentMessage,
  loadSentMessages,
} from "../utils/storage";

export default function ChatPage() {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(false);

  // -----------------------------
  // Init: username, secret key, socket
  // -----------------------------
  useEffect(() => {
    const storedUsername =
      typeof window !== "undefined" ? localStorage.getItem("username") : null;

    if (!storedUsername) {
      window.location.href = "/";
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

      newSocket.on("receive_message", async (packet) => {
        try {
          const sk = await loadSecretKey();
          if (!sk) return;

          const viewObj = await decryptPacketForReceiver(
            packet,
            storedUsername,
            sk
          );

          if (viewObj) {
            setMessages((prev) => [...prev, viewObj]);
          }
        } catch (err) {
          console.error("Error decrypting received packet:", err);
        }
      });

      setSocket(newSocket);
    };

    setupSocket();

    return () => {
      if (socket) socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------
  // Fetch + merge history on recipient change
  // -----------------------------
  useEffect(() => {
    const fetchHistory = async () => {
      if (!username || !recipient) return;

      setLoadingHistory(true);
      setError("");

      try {
        const sk = await loadSecretKey();
        if (!sk) {
          setError("No PQC secret key in browser. Please re-register.");
          setLoadingHistory(false);
          return;
        }

        const res = await fetch(
          `/api/messages?user1=${encodeURIComponent(
            username
          )}&user2=${encodeURIComponent(recipient)}`
        );
        const data = await res.json();

        const decrypted = [];
        for (const msg of data) {
          try {
            const viewObj = await decryptPacketForReceiver(
              msg,
              username,
              sk
            );
            if (viewObj) decrypted.push(viewObj);
          } catch (err) {
            console.warn("Skipping undecryptable message:", err);
          }
        }

        const localSent = await loadSentMessages(username, recipient);
        const localFormatted = localSent.map((m) => ({
          sender: m.sender,
          receiver: m.receiver,
          text: m.text,
          fromSelf: true,
          timestamp: m.timestamp || new Date().toISOString(),
        }));

        const combined = [...decrypted, ...localFormatted];
        combined.sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        setMessages(combined);
      } catch (err) {
        console.error("Error loading history:", err);
        setError("Failed to load history.");
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [recipient, username]);

  // -----------------------------
  // Helper: decrypt packet where viewer is receiver
  // -----------------------------
  async function decryptPacketForReceiver(packet, viewerUsername, viewerSecretKey) {
    const { sender, receiver, ciphertext, iv, kemCiphertext, timestamp } =
      packet;

    if (receiver !== viewerUsername) return null;

    const sharedSecretBase64 = await decapsulate(
      kemCiphertext,
      viewerSecretKey
    );
    const plainText = await aesDecrypt(
      ciphertext,
      iv,
      sharedSecretBase64
    );

    return {
      sender,
      receiver,
      text: plainText,
      fromSelf: false,
      timestamp: timestamp || new Date().toISOString(),
    };
  }

  // -----------------------------
  // Send message (encrypt + send + store)
  // -----------------------------
  const sendMessage = async () => {
    setError("");
    if (!message.trim() || !recipient) return;
    if (!socket) {
      setError("Socket not connected.");
      return;
    }

    try {
      // Fetch recipient PQC public key
      const res = await fetch(
        `/api/publicKey?username=${encodeURIComponent(recipient)}`
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch recipient key");
      }

      const { pqcPublicKey } = data;

      // KEM encapsulation
      const { kemCiphertextBase64, sharedSecretBase64 } = await encapsulate(
        pqcPublicKey
      );

      // AES-GCM encrypt
      const { ciphertextBase64, ivBase64 } = await aesEncrypt(
        message,
        sharedSecretBase64
      );

      const packet = {
        sender: username,
        receiver: recipient,
        ciphertext: ciphertextBase64,
        iv: ivBase64,
        tag: "dummy",
        kemCiphertext: kemCiphertextBase64,
      };

      // socket relay
      socket.emit("send_message", packet);

      // store encrypted in DB
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(packet),
      });

      // local plaintext copy for this sender
      const now = new Date().toISOString();
      const localMsg = {
        sender: username,
        receiver: recipient,
        text: message,
        fromSelf: true,
        timestamp: now,
      };

      setMessages((prev) => [...prev, localMsg]);

      await saveSentMessage({
        id: `${username}-${recipient}-${Date.now()}`,
        sender: username,
        receiver: recipient,
        text: message,
        timestamp: now,
      });

      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err.message || "Failed to send message.");
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Welcome, {username}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        placeholder="Recipient username"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="border p-2 w-full mb-4 rounded-lg"
      />

      <div className="border p-4 h-96 overflow-y-auto bg-gray-50 rounded-lg mb-4">
        {loadingHistory && (
          <p className="text-gray-500 mb-2">Loading history...</p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 ${
              msg.fromSelf ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block px-3 py-2 rounded-lg ${
                msg.fromSelf ? "bg-green-200" : "bg-blue-200"
              }`}
            >
              <strong>{msg.fromSelf ? "You" : msg.sender}:</strong>{" "}
              {msg.text}
            </span>
          </div>
        ))}

        {messages.length === 0 && !loadingHistory && (
          <p className="text-gray-400">No messages yet.</p>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 flex-1 rounded-lg"
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