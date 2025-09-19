"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/redux/reducer/user/userSlice";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, userInfo } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token || userInfo) {
      router.push("/dashboard");
    }
  }, [router, userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(email, password));
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <main className="flex min-h-screen bg-gray-50 items-center justify-center px-4 py-20">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-center text-black mb-10">
          Welcome Back to <span className="text-green-600">Orium Admin</span>
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Your Email"
            className="w-full text-black border px-4 py-2 mb-4 rounded focus:outline-none"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Your Password"
            className="w-full text-black border px-4 py-2 mb-2 rounded focus:outline-none"
            required
          />
          <div className="flex items-center justify-between mb-4 text-sm">
            <Link href="/reset-pass" className="text-green-600 font-semibold">
              Forgot Your Password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-lime-400 text-white py-2 rounded font-semibold"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </main>
  );
};

export default Login;
