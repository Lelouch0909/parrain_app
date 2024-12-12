"use client";

import Link from "next/link";
import { Provider } from "react-redux";
import store from "./lib/store";

export default function Home() {
  return (
    <Provider store={store}>
    <div className="min-h-screen bg-[#001219] text-white">
      <header className="p-4">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <span>Parainage</span>
          </Link>
          <div className="flex gap-4">
            <Link
              href="/auth/signin"
              className="px-4 py-2 rounded hover:bg-[#002633] transition-colors"
            >
              Sign in
            </Link>
            {/* <Link
              href="/auth/register"
              className="px-4 py-2 rounded hover:bg-[#002633] transition-colors"
            >
              Register As CTO
            </Link> */}
            <Link
              href="/auth/register"
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Register
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold mb-6">Bienvenue Au Parainage 2024/2025</h1>
        <p className="text-xl text-gray-400 mb-8">
          Veuillez vous connecter pour continuer.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/auth/register"
            className="px-6 py-3 rounded bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/auth/signin"
            className="px-6 py-3 rounded border border-gray-700 hover:bg-[#002633] transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register/cto"
            className="px-6 py-3 rounded border border-gray-700 hover:bg-[#002633] transition-colors"
          >
            Register As CTO
          </Link>
        </div>
      </main>
    </div>
    </Provider>
  );
}
