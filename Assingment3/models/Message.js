// models/Message.js
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  message: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);

