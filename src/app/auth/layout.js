"use client";

import Link from "next/link";
import { Provider } from "react-redux";
import store from "../lib/store";

export default function AuthLayout({ children }) {
  return (
    <Provider store={store}>
    <div className="min-h-screen bg-[#001219] text-white flex flex-col">
      <header className="p-4">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <span>Parainage</span>
          </Link>
          <div className="flex gap-4">
            <Link href="/auth/signin" className="hover:text-gray-300">
              Sign in
            </Link>
            <Link href="/auth/register" className="hover:text-gray-300">
              Register
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
    </div></Provider>
  );
}