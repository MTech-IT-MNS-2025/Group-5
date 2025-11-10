// pages/index.js
import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = isRegister ? "/api/register" : "/api/login";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("username", username);
      router.push("/chat");
    } else {
      setError(data.error || "Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="app-title">🔐 ChatterBox</h1>
        <h3>{isRegister ? "Create an account" : "Welcome back!"}</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        <p onClick={() => setIsRegister(!isRegister)} className="toggle">
          {isRegister
            ? "Already have an account? Log in"
            : "Don’t have an account? Register"}
        </p>
      </div>

      <style jsx>{`
        .login-container {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea, #764ba2);
          font-family: Inter, sans-serif;
        }
        .login-box {
          width: 360px;
          background: white;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          text-align: center;
        }
        input {
          width: 100%;
          margin-bottom: 15px;
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 1rem;
        }
        button {
          width: 100%;
          padding: 12px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          border: none;
          color: white;
          font-size: 1rem;
          border-radius: 8px;
          cursor: pointer;
        }
        button:hover {
          transform: scale(1.03);
        }
        .error {
          color: red;
          margin-top: 10px;
        }
        .toggle {
          margin-top: 10px;
          color: #0070f3;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
