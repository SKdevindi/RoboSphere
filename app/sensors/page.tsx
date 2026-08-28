"use client";

import Link from "next/link";
import Sidebar from "../components/Sidebar";
import { useRobot } from "../context/RobotContext";

export default function SensorsPage() {
  const {
    battery,
    speed,
    distance,
    temperature,
    refreshSensors,
  } = useRobot();

  return (
    <main className="flex min-h-screen bg-[#080D18] text-white">
      <Sidebar />

      <section className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Sensor Monitoring
            </h1>

            <p className="mt-2 text-gray-400">
              Monitor RoboSphere virtual robot sensor values.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-lg bg-blue-600 px-5 py-3 hover:bg-blue-700"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Sensor Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {/* Distance */}
          <div className="rounded-2xl border border-gray-800 bg-[#121B2E] p-6">
            <p className="text-sm text-gray-400">
              Distance Sensor
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              📡 {distance}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              units
            </p>

            <p
              className={`mt-4 text-sm font-semibold ${
                distance < 15
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            >
              {distance < 15
                ? "⚠ Obstacle Near"
                : "● Clear"}
            </p>
          </div>

          {/* Temperature */}
          <div className="rounded-2xl border border-gray-800 bg-[#121B2E] p-6">
            <p className="text-sm text-gray-400">
              Temperature
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              🌡️ {temperature}°C
            </h2>

            <p
              className={`mt-4 text-sm font-semibold ${
                temperature >= 38
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            >
              {temperature >= 38
                ? "⚠ High"
                : "● Normal"}
            </p>
          </div>

          {/* Battery */}
          <div className="rounded-2xl border border-gray-800 bg-[#121B2E] p-6">
            <p className="text-sm text-gray-400">
              Battery
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              🔋 {battery}%
            </h2>

            <p
              className={`mt-4 text-sm font-semibold ${
                battery <= 20
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            >
              {battery <= 20
                ? "⚠ Low Battery"
                : "● Normal"}
            </p>
          </div>

          {/* Speed */}
          <div className="rounded-2xl border border-gray-800 bg-[#121B2E] p-6">
            <p className="text-sm text-gray-400">
              Speed
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              ⚡ {speed} m/s
            </h2>

            <p
              className={`mt-4 text-sm font-semibold ${
                speed === 0
                  ? "text-gray-400"
                  : "text-green-400"
              }`}
            >
              {speed === 0
                ? "● Stopped"
                : "● Moving"}
            </p>
          </div>
        </div>

        {/* Sensor Status */}
        <div className="mt-8 rounded-2xl border border-gray-800 bg-[#121B2E] p-6">
          <h2 className="text-xl font-semibold">
            Sensor Status
          </h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <span className="text-gray-300">
                Distance Sensor
              </span>

              <span className="font-semibold text-green-400">
                ● Active
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <span className="text-gray-300">
                Temperature Sensor
              </span>

              <span className="font-semibold text-green-400">
                ● Active
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <span className="text-gray-300">
                Battery Monitor
              </span>

              <span className="font-semibold text-green-400">
                ● Active
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300">
                Speed Sensor
              </span>

              <span className="font-semibold text-green-400">
                ● Active
              </span>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-8">
          <button
            onClick={refreshSensors}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold transition hover:opacity-90"
          >
            Refresh Sensor Data
          </button>
        </div>
      </section>
    </main>
  );
}