import Link from "next/link";
import { CircleDollarSign } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#001219] text-white">
      <header className="p-4">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <CircleDollarSign size={32} />
            <span>Sponsorship</span>
          </Link>
          <div className="flex gap-4">
            <Link
              href="/auth/signin"
              className="px-4 py-2 rounded hover:bg-[#002633] transition-colors"
            >
              Sign in
            </Link>
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
        <h1 className="text-5xl font-bold mb-6">Welcome to Sponsorship</h1>
        <p className="text-xl text-gray-400 mb-8">
          Connect with sponsors and manage your partnerships efficiently.
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
        </div>
      </main>
    </div>
  );
}