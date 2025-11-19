# 🔑 Diffie-Hellman Shared Secret Key Establishment

This project demonstrates the **Diffie-Hellman key exchange protocol** implemented between a **Client** (Next.js frontend) and a **Server** (Node.js backend). The core mathematical operation, **modular exponentiation ($g^a \bmod p$)**, is computed efficiently using **WebAssembly (WASM)** compiled from C code.



---

## ✨ Features

* **Secure Key Exchange:** Implements the classic Diffie-Hellman algorithm to establish a shared secret key ($K$) over an insecure channel.
* **Performance Optimization:** Utilizes **WebAssembly (WASM)** for high-performance modular exponentiation, leveraging C's efficiency in both the client and server environments.
* **Full-Stack Implementation:** Separate Client and Server components built with modern JavaScript frameworks.

---

## 💻 Tech Stack

### 🚀 Platform
* **Ubuntu 22.04 LTS**

### 🧰 Software / Tools
| Component | Technology | Description |
| :--- | :--- | :--- |
| **Server** | **Node.js** with **Express.js** | Handles key exchange logic and serves as the backend API. |
| **Client** | **Next.js** with **React** | Interactive frontend for inputting parameters and displaying results. |
| **WASM Compiler** | **Emscripten** | Used to compile the C source code into a `.wasm` module. |
| **Core Logic** | **C Language** | Contains the efficient implementation of the modular exponentiation function (`modexp`). |
| **WASM Module** | **WebAssembly** | The compiled binary format used for high-speed computation. |
| **Glue Code** | **JavaScript** | Handles communication and integration between Node/Next.js and the WASM module. |

---

## ▶ Installation & Setup

### **1. Prerequisites**

* **Node.js** (npm)
* **Emscripten** (for compiling C to WASM)

### **2. Directory Structure**

The project structure is assumed to be:

        DiffieHellmanProject/
        │
        ├── wasm/
        │   ├── myProg.c
        │   └── compute.wasm        <-- generated only this
        │
        ├── server/
        │   ├── server.js
        │   └── package.json
        │
        └── client-next/
            ├── app/page.jsx
            └── public/compute.wasm

### **3. Compile C to WebAssembly**

Navigate to the `wasm` directory and run the Emscripten command:

```bash
cd DiffieHellmanProject/wasm
emcc myProg.c -O3 -s STANDALONE_WASM -s EXPORTED_FUNCTIONS='["_modexp"]' -o compute.wasm


### **4. Copy WASM to Required Folders**


### **5. Run Backend Server**

    cd DiffieHellmanProject/server
    npm install
    node server.js
    

### **6. Run Frontend Client

    cd DiffieHellmanProject/client-next
    npm install
    npm run dev

🧪 Usage Instructions

    1. Open your browser and navigate to: http://localhost:3000
    2. Enter values for a large prime number (p) and a generator (g).
    3. Click CONNECT.

🔐 MD5 Digest Command (For Lab Testing)

    md5sum <DiffieHellmanProject>
