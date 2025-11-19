Diffie–Hellman Key Exchange — Client + C Backend

🔐 Secure Key Exchange using Next.js + Teacher’s C Program (With MD5 Digest Steps)

This project implements a complete Diffie–Hellman Key Exchange (D–H) using:

Client (Browser) → calculates x = g^a mod p using JavaScript

Server (Next.js API) → executes teacher’s original C program (myProg.c) to compute:

y = g^b mod p

K = x^b mod p

Both sides derive the same shared secret key.

📁 Project Structure
client/
├── app/
│   ├── page.tsx                # Frontend UI + client logic
│   └── api/
│       └── dh/
│           └── route.ts        # API that executes C binary
├── myProg.c                    # Teacher’s C file
├── myProg_bin                  # Compiled executable
├── package.json
└── README.md

🚀 Setup & Running (Step-by-Step With Explanation)
1️⃣ Create project folder
cd ~
mkdir -p DH_LAB
cd DH_LAB


Purpose: Clean workspace for lab submission.

2️⃣ Create Next.js client app
npx create-next-app@latest client --no-eslint --no-tailwind --no-src-dir
cd client


Purpose:
Provides frontend + backend (API routes) together.

3️⃣ Add teacher's C program
cp ~/myProg.c ./myProg.c


Purpose:
Use original C code provided in the lab.

4️⃣ Compile C → Executable binary
gcc myProg.c -o myProg_bin
chmod +x myProg_bin


Purpose:
Binary can be executed directly by API using:

echo "base exp mod" | ./myProg_bin

5️⃣ Test the binary
./myProg_bin
# enter:
# 2 10 1000


Expected Output Example:

2^10 mod 1000 = 24


Purpose:
Ensures C program works before integrating with the API.

6️⃣ Create backend API (route.ts)

Location: app/api/dh/route.ts

Purpose:

Generates server secret b

Runs C binary to compute y and K

Sends output back to client

7️⃣ Create frontend UI (page.tsx)

Purpose:

Takes p and g

Generates client secret a

Computes x = g^a mod p

Calls backend API

Displays <g,p,x> and <y,K>

8️⃣ Run the project
npm run dev


Open:

http://localhost:3000

🧪 Demo Flow (In Browser)

Input:

p = 23
g = 5


Click Start Key Exchange

You will see:

Client secret a

Value of x = g^a mod p

API returns:

y = g^b mod p

K = x^b mod p
(computed using C program)

✔ Both sides share the same K.

📝 MD5 Digest Generation (Include This in Submission)

If your lab requires MD5 checksum of your project, use these commands:

🔵 MD5 of Entire Project Folder
cd ~
md5 DH_LAB
