# Diffie–Hellman shared secret key between client and server. — Lab Test Project

This project implements the Diffie–Hellman key exchange using:

- WebAssembly (WASM) generated from a C program (`myProg.c`)
- Node.js backend server
- Simple HTML + JavaScript frontend
- Same `_modexp` C logic used both on client and server

The following README explains the complete setup and run instructions exactly as performed during the lab test.

---

## 1. Platform Used

**Platform:** macOS (Unix-based, equivalent to Ubuntu/Linux)

All commands (npm, emcc, MD5, server) run the same on macOS and Linux.

---

## 2. Software / Tools Used

### ✔ Node.js  
Used to run the backend and manage dependencies.

### ✔ Emscripten (emcc)  
Used to compile the teacher-provided C program (`myProg.c`) into WebAssembly.

### ✔ Teacher's C Program  
Contains the modular exponentiation function `_modexp`.

### ✔ Simple HTML + JavaScript  
Used to build the frontend UI.

### ✔ `http-server` (optional)  
Used to serve the frontend during testing.

_No Next.js, React or Docker were used._

---

## 3. Folder Structure (Final Project)

```
myproject/
│── index.html
│── myProg.c
│── myProg.js
│── myProg.wasm
│── package.json
│── package-lock.json
│── server.js
│── node_modules/
```

---

## 4. Commands Used (Executed in Correct Order)

### ➤ Step 1 — Initialize the Node project

```bash
npm init -y
```

### ➤ Step 2 — Install dependencies

```bash
npm install express@5 cors
```

### ➤ Step 3 — Compile the C file to WebAssembly

```bash
emcc myProg.c -O3 -o myProg.js   -sEXPORTED_FUNCTIONS='["_modexp"]'   -sEXPORTED_RUNTIME_METHODS='["cwrap","ccall"]'   -sWASM=1   -sMODULARIZE=1   -sEXPORT_ALL   -sEXPORT_NAME=MyProgModule   -sERROR_ON_UNDEFINED_SYMBOLS=0
```

This generates:
- `myProg.js`
- `myProg.wasm`

---

## 5. Running the Backend Server

Start the backend using Node:

```bash
node server.js
```

Server starts at:

```
http://localhost:3000
```

---

## 6. Running the Frontend

Start the backend using:

### Local static server

```bash
npx http-server .
```

This serves your project at a URL like:

```
http://127.0.0.1:8080
```

---

## 7. Complete Diffie–Hellman Workflow

### Client-side steps (index.html):
1. User enters `p` and `g`
2. Browser generates private key `a`
3. WASM calculates:
   ```
   x = g^a mod p
   ```
4. Sends `{ g, p, x }` to backend
5. Receives `{ K, y }`
6. Displays:
   - Shared key **K**
   - Server public value **y**
   - Client private key **a**

### Server-side steps (server.js):
1. Receives `{ g, p, x }`
2. Generates private key `b`
3. Calculates using WASM:
   ```
   y = g^b mod p
   K = x^b mod p
   ```
4. Sends `{ K, y }` back to client

---

## 8. Status

✔ Fully working Diffie–Hellman implementation  
✔ Same WASM logic reused in frontend + backend  
✔ Correct output of `K`, `y`, and `a`   

---

## 9. Acknowledgment

This project demonstrates classical cryptography principles implemented using modern tools like WebAssembly and Node.js in a clean and simple manner.
