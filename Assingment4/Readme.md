# RC4 Encryption using WebAssembly (WASM) & Next.js

This project implements the **RC4 stream cipher** inside the browser using **WebAssembly (WASM)**.  
The core cryptographic logic (KSA + PRGA) is written using **WebAssembly Text Format (WAT)** and compiled to `.wasm`.  
The Next.js frontend loads this WASM module, interacts with WASM memory, and performs **Encrypt/Decrypt** operations.

## 📘 Course: Introduction to Cryptography (ITC)  
## 🧪 Lab Assignment – 4  
**Objective:**  
To understand how native C code can be compiled to WebAssembly (WASM) and executed in
the browser using JavaScript (Next.js).

# 🚀 Features

- Full RC4 implementation in WebAssembly (WAT → WASM)
- Next.js frontend to encrypt & decrypt messages
- Key + Plaintext inputs
- Hex-based ciphertext output
- Byte-level XOR encryption/decryption
- Fully browser-executed cryptography (no backend server)

# 📂 Project Structure

```
Assignment4/
│
├── wasm-src/
│   ├── rc4.wat
│   └── rc4.wasm
│   └── rc4.c
│   └── rc4.js
│
├── public/
│   └── rc4/
│       └── rc4.wasm
│       └── rc4.js
│
└── app/
│   └── page.jsx
│   └── layout.tsx
│   └── globals.css
└── next-env.d.ts
│
└── eslint.config.mjs
│
└── next.config.ts
│
└── package-lock.json
│
└── package.json
│
└── postcss.config.mjs
│
└── tsconfig.json
```

# 🧠 Architecture

### 1. RC4 algorithm runs inside WebAssembly  
### 2. WASM Memory Layout  
- 0–255 → S-box  
- 512 → Key bytes  
- 1024 → Plaintext/Ciphertext buffer  

### 3. Next.js Frontend  
- Accepts key + text  
- Writes data into WASM memory  
- Calls WASM functions  
- Reads encrypted/decrypted bytes  

# 🔧 Installation

```sh
git clone https://github.com/MTech-IT-MNS-2025/Group-5/edit/main/Assingment4
npm install
npm run dev
```

Visit: http://localhost:3000

# 🛠 Building WASM

```sh
wat2wasm rc4.wat -o rc4.wasm
cp rc4.wasm ../public/rc4/rc4.wasm
```

# 🔐 RC4 Summary

- KSA: Initializes + scrambles S-box  
- PRGA: Generates keystream + XOR  
- Symmetric cipher (encrypt = decrypt)  

# 🎓 Learning Outcomes

- WASM memory + buffers  
- WAT instructions  
- Manual RC4 crypto logic  
- Next.js + WASM integration  
- Browser-based encryption  

