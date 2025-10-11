# 🚀 Post-Quantum Cryptography (PQC) Assignment

This repository contains three C programs demonstrating **post-quantum cryptography (PQC)** concepts using the [Open Quantum Safe (liboqs)](https://github.com/open-quantum-safe/liboqs) library alongside classical cryptography via OpenSSL.  

The tasks cover:
- Listing available PQC algorithms  
- Running a **Key Encapsulation Mechanism (KEM)** demo with Kyber512  
- Comparing **digital signatures** between PQC (Falcon-512) and classical (RSA, ECDSA) schemes  

---

## 📂 Repository Structure

| File | Description |
|------|-------------|
| **task1.c** | Lists all available **KEM** and **Signature** algorithms from liboqs, along with their key and ciphertext/signature sizes. |
| **task2.c** | Demonstrates a **KEM key exchange** using **Kyber512**. Measures and prints timings for key generation, encapsulation, and decapsulation. |
| **task3.c** | Implements **digital signature demos**: <br>• Falcon-512 (PQC)<br>• RSA-2048 (classical)<br>• ECDSA-P256 (classical). Shows key sizes and signature lengths. |
| **execution_cmds.md** | Compilation and execution commands for each task. |

---

## ⚙️ Requirements

- **liboqs**   
- **OpenSSL** 
- **GCC** 

---
##  INSTALLATION GUIDE FOR UBUNTU
- sudo apt update
- sudo apt install build-essential cmake git libssl-dev pkg-config
- git clone --recursive https://github.com/open-quantum-safe/liboqs.git
- cd liboqs
- mkdir build && cd build
- cmake -DCMAKE_BUILD_TYPE=Release ..
- make -j$(nproc)
- sudo make install

  ---


## 🛠️ Compilation & Execution

The commands are already provided in `execution_cmds.md`. For convenience:

### Task 1 – List Algorithms
```bash
gcc task1.c -o task1 -loqs -lcrypto -lssl
./task1
```

### Task 2 – Kyber512 KEM Demo
```bash
gcc task2.c -o task2 -loqs -lcrypto -lssl
./task2
```

### Task 3 – Signature Schemes (Falcon, RSA, ECDSA)
```bash
gcc Task3.c -o task3 -loqs -lcrypto -lssl
./task3
```

---

## 🎯 Learning Objectives

- Understand the difference between **PQC** and **classical cryptography**.  
- Explore **KEMs** (Kyber512) for secure key exchange.  
- Compare **digital signatures** across PQC and classical algorithms.  
- Gain hands-on experience with **liboqs** and **OpenSSL** integration.  


  ---
  
## 👤 Author
Dr. SowmyaDev Maity || Akshit || Meharvan || Sanket || Vaibhav
- 💡 Exploring Quantum-Safe Cryptography with liboqs
  
