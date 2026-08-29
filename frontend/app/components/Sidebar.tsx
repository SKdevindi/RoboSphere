"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/",
    },
    {
      name: "Robot Control",
      href: "/robot-control",
    },
    {
      name: "Sensors",
      href: "/sensors",
    },
    {
      name: "Activity History",
      href: "/activity-history",
    },
    {
      name: "Settings",
      href: "/settings",
    },
  ];

  const handleLogout = () => {
    // Remove saved login details
    localStorage.removeItem("robosphere_token");
    localStorage.removeItem("robosphere_user");

    // Go back to login page
    router.push("/login");
  };

  return (
    <aside className="flex min-h-screen w-64 flex-col bg-[#0D1424] p-6 text-white">
      {/* Logo */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold">
          🤖 RoboSphere
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Virtual Robot System
        </p>
      </div>

      {/* Navigation */}
      <nav className="space-y-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg p-3 transition ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "text-gray-400 hover:bg-[#121B2E] hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Robot Status */}
      <div className="mt-10 rounded-xl bg-[#121B2E] p-4">
        <p className="text-sm text-gray-400">
          Robot Status
        </p>

        <p className="mt-2 font-semibold text-green-400">
          ● Online
        </p>

        <p className="mt-1 text-sm text-gray-400">
          RBS-001
        </p>
      </div>

      {/* Logout */}
      <div className="mt-auto pt-6">
        <button
          onClick={handleLogout}
          className="w-full rounded-lg border border-red-500/40 bg-red-500/10 p-3 font-medium text-red-400 transition hover:bg-red-500 hover:text-white"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}