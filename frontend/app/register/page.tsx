"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (
        data.message !==
        "User registered successfully"
      ) {
        setMessage(data.message);
        return;
      }

      setMessage(
        "Registration successful!"
      );

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      console.error(error);

      setMessage(
        "Registration failed. Check backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080D18] px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-[#121B2E] p-8 shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            RoboSphere
          </h1>

          <p className="mt-2 text-gray-400">
            Create your account
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="mt-8 space-y-5"
        >
          <div>
            <label className="text-sm text-gray-300">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
              className="mt-2 w-full rounded-xl border border-gray-700 bg-[#0D1424] px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              className="mt-2 w-full rounded-xl border border-gray-700 bg-[#0D1424] px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              minLength={6}
              className="mt-2 w-full rounded-xl border border-gray-700 bg-[#0D1424] px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Minimum 6 characters"
            />
          </div>

          {message && (
            <div className="rounded-lg bg-[#0D1424] p-3 text-center text-sm text-blue-300">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-semibold transition hover:opacity-90 disabled:opacity-50"
          >
            {loading
              ? "Creating account..."
              : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-400 hover:text-blue-300"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}