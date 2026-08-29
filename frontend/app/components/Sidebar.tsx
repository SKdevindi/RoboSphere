"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

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

  return (
    <aside className="min-h-screen w-64 bg-[#0D1424] p-6 text-white">
      <div className="mb-10">
        <h1 className="text-2xl font-bold">
          🤖 RoboSphere
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Virtual Robot System
        </p>
      </div>

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
    </aside>
  );
}