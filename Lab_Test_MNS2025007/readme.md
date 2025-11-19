📘 Project / Lab Test Description

This project was created as part of the Introduction to Cryptography – Lab Test.
The objective was to implement the Diffie–Hellman Key Exchange (DHKE) using 

WebAssembly (WASM) compiled from a given C program (myProg.c)

------------------------------------------------------------

🖥️ Platform Used

Ubuntu 22.04

------------------------------------------------------------

🛠️ Software / Tools Used

NodeJS

NextJS

React

Emscripten (emcc)

WebAssembly (WASM)

------------------------------------------------------------

🚀 Commands to Run the Project


1️⃣ Install Dependencies

npm install


2️⃣ Build Browser-side WASM

emcc myProg.c -O3 \
 
  -s WASM=1 \
  -s WASM_BIGINT=1 \
  -s MODULARIZE=1 \
  -s 'EXPORT_NAME="createModexpModule"' \
  -s EXPORTED_FUNCTIONS='["_modexp"]' \
  -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' \
  -o public/modexp.js



3️⃣ Build Server-side WASM

emcc myProg.c -O3 \
 
  -s STANDALONE_WASM=1 \
  -s WASM_BIGINT=1 \
  -s EXPORTED_FUNCTIONS='["_modexp"]' \
  -s ERROR_ON_UNDEFINED_SYMBOLS=0 \
  --no-entry \
  -o public/modexp_server.wasm



4️⃣ Start Development Server

npm run dev


👉Open http://localhost:3000


------------------------------------------------------------


🔐 MD5 Digest Command Used During Lab Test

md5sum filename
