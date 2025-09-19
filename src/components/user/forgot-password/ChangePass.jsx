"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const ChangePass = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setError("");
    console.log("Password changed:", newPassword);
    setNewPassword("");
    setConfirmPassword("");
    router.push('/')


  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-20">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-xl text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          <span className="text-green-600">Change Password</span>
        </h2>
        <p className="text-gray-600 mb-6">
          Enter your new password and confirm it below
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full text-black border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full text-black border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />

          <button
            type="submit"

            className="w-full py-3 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-lg text-base font-medium hover:from-green-600 hover:to-lime-600"
          >
            Update Password
          </button>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>
    </main>
  );
};

export default ChangePass;
