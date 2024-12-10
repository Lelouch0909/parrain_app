"use client";

import { useState } from "react";
import Link from "next/link";
import { CircleDollarSign } from "lucide-react";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign in logic here
    console.log("Sign in:", formData);
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <CircleDollarSign size={48} />
        </div>
        <h1 className="text-3xl font-bold mb-2">Sponsorship</h1>
        <p className="text-gray-400">
          Connectez-vous directement à votre compte ou avec Google.
        </p>
      </div>

      <div className="bg-[#002633] rounded-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full p-3 rounded bg-[#001219] border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full p-3 rounded bg-[#001219] border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded transition duration-200"
          >
            Sign In
          </button>

          <div className="text-center">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#002633] text-gray-400">Or with</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-[#001219] hover:bg-[#001824] text-white py-3 rounded border border-gray-700 transition duration-200"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5"
            />
            Google
          </button>
        </form>
      </div>
    </div>
  );
}