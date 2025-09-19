"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Entered OTP:", otp);
    setOtp("");
    router.push('/change-pass')
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-20">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-xl text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          <span className="text-green-600">Verification Code</span>
        </h2>
        <p className="text-gray-600 mb-6">
          Enter the 6-digit code we sent to your registered email address
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <input
            type="text"
            placeholder="Enter Verification Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className="w-full text-black border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 tracking-widest text-center text-lg"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-lg text-base font-medium hover:from-green-600 hover:to-lime-600"
          >
            Verify
          </button>
        </form>

        {/* <p className="text-gray-500 text-sm mt-4">
          Didn’t receive the code?{" "}
          <button className="text-green-600 font-semibold hover:underline">
            Resend
          </button>
        </p> */}
      </div>
    </main>
  );
};

export default VerifyOtp;
