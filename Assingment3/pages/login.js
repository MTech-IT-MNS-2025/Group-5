// pages/login.js
import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem("username", username);
      router.push("/chat");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold mb-4 text-center">Login to Chat</h2>
        <input
          type="text"
          placeholder="Enter your username"
          className="border rounded-lg p-2 w-full mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full">
          Login
        </button>
      </form>
    </div>
  );
}

