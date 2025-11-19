# Diffie–Hellman Key Exchange — Lab Test README

## 📌 1. Platform Used
**Platform:** macOS (Unix-based environment, equivalent to Ubuntu/Linux)

> Note: macOS terminal uses the same commands as Ubuntu/Linux, so all compilation  
> and MD5 commands run the same way.

---

## 📌 2. Software / Tools Used
The following tools were used in my implementation:

- **Node.js** — JavaScript runtime for the project  
- **Next.js** — Framework for frontend + backend API  
- **React** — UI rendering  
- **GCC** — To compile the teacher-provided C program (`myProg.c`)  
- **Teacher's C Program (`myProg.c`)** — Used for modular exponentiation on the backend  

> No additional tools like Emscripten, Docker, or WebAssembly were used.

---

## 📌 3. Commands to Run My Code

### ➤ **Step 1 — Install project dependencies**
```bash
npm install
➤ Step 2 — Compile the C program
bash
Copy code
gcc myProg.c -o myProg_bin
chmod +x myProg_bin   # make it executable
➤ Step 3 — (Optional) Test the C program manually
bash
Copy code
./myProg_bin
# input example:
# 2 10 1000
➤ Step 4 — Start the Next.js Application
bash
Copy code
npm run dev
➤ Step 5 — Open the project in browser
arduino
Copy code
http://localhost:3000
This runs the full client–server Diffie–Hellman key exchange.

📌 4. Command Used to Calculate the MD5 Digest (During Lab Test)
On macOS (used during my lab test):
bash
Copy code
tar -czf DH_LAB.tar.gz DH_LAB
md5 DH_LAB.tar.gz
