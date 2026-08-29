"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "http://127.0.0.1:8000";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (
        data.message !==
        "Login successful"
      ) {
        setMessage(data.message);
        return;
      }

      localStorage.setItem(
        "robosphere_token",
        data.access_token
      );

      localStorage.setItem(
        "robosphere_user",
        JSON.stringify(data.user)
      );

      router.push("/");
    } catch (error) {
      console.error(error);

      setMessage(
        "Login failed. Check backend connection."
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
            Login to your account
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-5"
        >
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
              className="mt-2 w-full rounded-xl border border-gray-700 bg-[#0D1424] px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>

          {message && (
            <div className="rounded-lg bg-red-500/10 p-3 text-center text-sm text-red-400">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-semibold transition hover:opacity-90 disabled:opacity-50"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-blue-400 hover:text-blue-300"
          >
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}