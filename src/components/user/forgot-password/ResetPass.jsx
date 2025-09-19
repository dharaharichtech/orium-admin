"use client";

import React, { useState } from "react";

const ResetPass = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-20">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-xl text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          <span className="text-green-600">Reset Password</span>
        </h2>
        <p className="text-gray-600 mb-6">
          Send Email to reset your password
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <input
            type="text"
            placeholder="Enter Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-black border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-lg text-base font-medium hover:from-green-600 hover:to-lime-600"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
};

export default ResetPass;
