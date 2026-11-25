"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    if (regNo === "2023-ARID-001" && password === "1234") {
      localStorage.setItem("student", JSON.stringify({ regNo, name: "Ayesha Khan" }));
      router.push("/dashboard");
    } else {
      setError("Invalid Registration No ya Password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-3xl font-bold text-green-700 text-center">UIMS</h1>
        <p className="text-center text-gray-500 mb-6">Student Portal Login</p>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Registration No (2023-ARID-001)"
          value={regNo}
          onChange={(e) => setRegNo(e.target.value)}
        />
        <input
          type="password"
          className="w-full border p-2 rounded mb-4"
          placeholder="Password (1234)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-green-700 text-white p-2 rounded hover:bg-green-800">
          Login
        </button>
      </form>
    </div>
  );
}