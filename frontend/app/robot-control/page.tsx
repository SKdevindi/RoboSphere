"use client";

import Link from "next/link";
import Sidebar from "../components/Sidebar";
import { useRobot } from "../context/RobotContext";

export default function RobotControlPage() {
  const {
    x,
    y,
    battery,
    speed,
    status,
    distance,
    activities,
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    stopRobot,
    clearActivities,
  } = useRobot();

  const obstacleX = 60;
  const obstacleY = 50;

  const obstacleDetected =
    status === "Obstacle Detected" || distance <= 10;

  return (
    <main className="flex min-h-screen bg-[#080D18] text-white">
      <Sidebar />

      <section className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Robot Control
            </h1>

            <p className="mt-2 text-gray-400">
              Control and monitor the RoboSphere virtual robot.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-lg bg-blue-600 px-5 py-3 hover:bg-blue-700"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Obstacle Warning */}
        {obstacleDetected && (
          <div className="mt-6 rounded-xl border border-yellow-500 bg-yellow-500/10 p-5">
            <div className="flex items-center gap-3">
              <span className="text-3xl">
                ⚠️
              </span>

              <div>
                <h2 className="font-bold text-yellow-400">
                  Obstacle Detected!
                </h2>

                <p className="mt-1 text-sm text-yellow-200">
                  Robot movement has been stopped to prevent a collision.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Virtual Environment */}
          <div className="rounded-2xl bg-[#121B2E] p-6">
            <h2 className="mb-4 text-xl font-semibold">
              Virtual Environment
            </h2>

            <div className="relative h-[400px] overflow-hidden rounded-xl border border-gray-700 bg-[#0D1424]">
              {/* Obstacle */}
              <div
                className="absolute text-5xl"
                style={{
                  left: `${obstacleX}%`,
                  top: `${obstacleY}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                🚧
              </div>

              {/* Robot */}
              <div
                className="absolute text-5xl transition-all duration-300"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                🤖
              </div>
            </div>

            <div className="mt-4 flex justify-between text-sm text-gray-400">
              <span>🤖 Virtual Robot</span>
              <span>🚧 Obstacle</span>
            </div>
          </div>

          {/* Control Panel */}
          <div className="rounded-2xl bg-[#121B2E] p-6">
            <h2 className="text-xl font-semibold">
              Control Panel
            </h2>

            <div className="mt-6 grid grid-cols-2 gap-4">
              {/* Battery */}
              <div className="rounded-xl bg-[#0D1424] p-4">
                <p className="text-sm text-gray-400">
                  Battery
                </p>

                <p className="mt-2 text-2xl font-bold">
                  🔋 {battery}%
                </p>
              </div>

              {/* Speed */}
              <div className="rounded-xl bg-[#0D1424] p-4">
                <p className="text-sm text-gray-400">
                  Speed
                </p>

                <p className="mt-2 text-2xl font-bold">
                  💨 {speed} m/s
                </p>
              </div>
            </div>

            {/* Distance */}
            <div
              className={`mt-4 rounded-xl border p-4 ${
                obstacleDetected
                  ? "border-yellow-500 bg-yellow-500/10"
                  : "border-transparent bg-[#0D1424]"
              }`}
            >
              <p className="text-sm text-gray-400">
                Distance Sensor
              </p>

              <p className="mt-2 text-2xl font-bold">
                📡 {distance} units
              </p>

              <p
                className={`mt-2 text-sm font-semibold ${
                  obstacleDetected
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}
              >
                {obstacleDetected
                  ? "⚠ Obstacle Near"
                  : "● Path Clear"}
              </p>
            </div>

            {/* Position */}
            <div className="mt-4 rounded-xl bg-[#0D1424] p-4">
              <p className="text-sm text-gray-400">
                Robot Position
              </p>

              <p className="mt-2 text-lg font-semibold">
                X: {x} | Y: {y}
              </p>
            </div>

            {/* Status */}
            <div className="mt-4 rounded-xl bg-[#0D1424] p-4">
              <p className="text-sm text-gray-400">
                Robot Status
              </p>

              <p
                className={`mt-2 font-semibold ${
                  obstacleDetected
                    ? "text-yellow-400"
                    : status === "Stopped"
                    ? "text-gray-400"
                    : "text-green-400"
                }`}
              >
                {status}
              </p>
            </div>

            {/* Controls */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <button
                onClick={moveUp}
                className="h-16 w-16 rounded-xl bg-blue-600 text-2xl transition hover:bg-blue-700"
              >
                ↑
              </button>

              <div className="flex gap-4">
                <button
                  onClick={moveLeft}
                  className="h-16 w-16 rounded-xl bg-blue-600 text-2xl transition hover:bg-blue-700"
                >
                  ←
                </button>

                <button
                  onClick={stopRobot}
                  className="h-16 w-20 rounded-xl bg-red-600 font-bold transition hover:bg-red-700"
                >
                  STOP
                </button>

                <button
                  onClick={moveRight}
                  className="h-16 w-16 rounded-xl bg-blue-600 text-2xl transition hover:bg-blue-700"
                >
                  →
                </button>
              </div>

              <button
                onClick={moveDown}
                className="h-16 w-16 rounded-xl bg-blue-600 text-2xl transition hover:bg-blue-700"
              >
                ↓
              </button>
            </div>
          </div>
        </div>

        {/* Activity History */}
        <div className="mt-8 rounded-2xl bg-[#121B2E] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Activity History
            </h2>

            {activities.length > 0 && (
              <button
                onClick={clearActivities}
                className="rounded-lg bg-gray-700 px-4 py-2 text-sm hover:bg-gray-600"
              >
                Clear History
              </button>
            )}
          </div>

          <div className="mt-4 space-y-3">
            {activities.length === 0 ? (
              <p className="text-gray-400">
                No robot activity yet.
              </p>
            ) : (
              activities.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg bg-[#0D1424] p-3 text-gray-300"
                >
                  <p>🤖 {item.action}</p>

                  <p className="mt-1 text-xs text-gray-500">
                    {item.time}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}