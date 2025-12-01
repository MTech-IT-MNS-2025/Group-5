// models/Message.js
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },

  // AES-GCM encrypted payload
  ciphertext: { type: String, required: true },
  iv: { type: String, required: true },
  tag: { type: String, required: true }, // we store "dummy" here but kept for schema clarity

  // Post-quantum KEM ciphertext (ML-KEM encapsulated key)
  kemCiphertext: { type: String, required: true },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);