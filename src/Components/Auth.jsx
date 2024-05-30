import React, { useState } from "react";
import axios from "axios";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendOtp = async () => {
    try {
      // API call to send OTP to the provided email
      await axios.post("http://localhost:5000/api/send-otp", { email });
      setIsOtpSent(true);
      setMessage("OTP sent to your email!");
    } catch (error) {
      setMessage("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      // API call to verify the OTP
      await axios.post("/api/verify-otp", { email, otp });
      setMessage("OTP verified successfully!");
    } catch (error) {
      setMessage("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">
          User Authentication
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700">Gmail</label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            placeholder="Enter your Gmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {isOtpSent && (
          <div className="mb-4">
            <label className="block text-gray-700">OTP</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
              placeholder="Enter the OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
        )}
        <div className="flex items-center justify-between">
          {!isOtpSent ? (
            <button
              className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none"
              onClick={handleSendOtp}
            >
              Send OTP
            </button>
          ) : (
            <button
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none"
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </button>
          )}
        </div>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default Auth;
