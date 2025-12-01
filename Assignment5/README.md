# My Chat App — Secure Messaging with PQC

A simple but secure real-time chat application built using **Next.js**, **Socket.io**, and **Post-Quantum Cryptography (PQC)**.  
Users can register, generate cryptographic key pairs, log in, and securely exchange encrypted messages.

## 🚀 Features

- 🔐 User Registration + Login  
- 🗝️ Key Pair Generation  
- 🤝 Shared Secret Key Derivation  
- 💬 Real-Time Messaging  
- 📦 Local Storage Helpers  
- 🔧 Modular Utilities  

## 📁 Project Structure

```
my-chat-app/
├── models/
│   ├── User.js
│   └── Message.js
├── utils/
│   ├── crypto.js
│   └── storage.js
├── pages/
│   ├── api/
│   ├── chat.js
│   └── ...
├── public/
├── package.json
├── .env.local
└── README.md
```

## 🛠️ Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | Next.js (React) |
| Backend | Next.js API routes |
| Realtime | Socket.io |
| Database | (MongoDB / Test DB) |
| Crypto | PQC wrappers + WebCrypto |

## ⚙️ Setup Instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Create `.env.local`
```
MONGO_URI=mongodb://localhost:27017/mychat
JWT_SECRET=your-secret
```

### 3. Run development server
```bash
npm run dev
```

### 4. Visit
```
http://localhost:3000
```

## 🔐 Security Model

1. PQC key pair generated during registration  
2. Public key stored on server  
3. Private key stays on device  
4. All messages encrypted end‑to‑end  

## 🧩 Known Issues

- Multi-device login unsupported  
- Credential validation improvements needed  


