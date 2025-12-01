// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Post-quantum public key (ML-KEM-768) stored as base64
  pqcPublicKey: { type: String, required: false },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);