"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "../components/Sidebar";
import { useRobot } from "../context/RobotContext";

export default function SettingsPage() {
  const {
    robotName,
    robotId,
    speedLimit,
    obstacleDetection,
    notifications,
    setRobotName,
    setRobotId,
    setSpeedLimit,
    setObstacleDetection,
    setNotifications,
    saveSettings,
  } = useRobot();

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveSettings();

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <main className="flex min-h-screen bg-[#080D18] text-white">
      <Sidebar />

      <section className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Settings
            </h1>

            <p className="mt-2 text-gray-400">
              Configure your RoboSphere virtual robot.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-lg bg-blue-600 px-5 py-3 hover:bg-blue-700"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Settings Cards */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Robot Configuration */}
          <div className="rounded-2xl border border-gray-800 bg-[#121B2E] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                🤖
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  Robot Configuration
                </h2>

                <p className="text-sm text-gray-400">
                  Manage robot information and movement limits.
                </p>
              </div>
            </div>

            {/* Robot Name */}
            <div className="mt-6">
              <label className="text-sm text-gray-400">
                Robot Name
              </label>

              <input
                type="text"
                value={robotName}
                onChange={(e) =>
                  setRobotName(e.target.value)
                }
                className="mt-2 w-full rounded-xl border border-gray-700 bg-[#0D1424] p-3 text-white outline-none transition focus:border-blue-500"
              />
            </div>

            {/* Robot ID */}
            <div className="mt-5">
              <label className="text-sm text-gray-400">
                Robot ID
              </label>

              <input
                type="text"
                value={robotId}
                onChange={(e) =>
                  setRobotId(e.target.value)
                }
                className="mt-2 w-full rounded-xl border border-gray-700 bg-[#0D1424] p-3 text-white outline-none transition focus:border-blue-500"
              />
            </div>

            {/* Maximum Speed */}
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-400">
                  Maximum Speed
                </label>

                <span className="text-sm font-semibold text-blue-400">
                  {speedLimit.toFixed(1)} m/s
                </span>
              </div>

              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={speedLimit}
                onChange={(e) =>
                  setSpeedLimit(
                    Number(e.target.value)
                  )
                }
                className="mt-4 w-full cursor-pointer"
              />

              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>0.1 m/s</span>
                <span>5.0 m/s</span>
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="rounded-2xl border border-gray-800 bg-[#121B2E] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-xl">
                ⚙️
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  System Settings
                </h2>

                <p className="text-sm text-gray-400">
                  Configure safety and notification options.
                </p>
              </div>
            </div>

            {/* Obstacle Detection */}
            <div className="mt-6 flex items-center justify-between rounded-xl border border-gray-800 bg-[#0D1424] p-4">
              <div className="pr-4">
                <p className="font-semibold">
                  Obstacle Detection
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  Stop the robot automatically when an obstacle is detected.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setObstacleDetection(
                    !obstacleDetection
                  )
                }
                className={`relative h-7 w-14 flex-shrink-0 rounded-full transition ${
                  obstacleDetection
                    ? "bg-blue-600"
                    : "bg-gray-700"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                    obstacleDetection
                      ? "left-8"
                      : "left-1"
                  }`}
                />
              </button>
            </div>

            {/* Notifications */}
            <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-800 bg-[#0D1424] p-4">
              <div className="pr-4">
                <p className="font-semibold">
                  Notifications
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  Show sensor warnings and robot system notifications.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setNotifications(
                    !notifications
                  )
                }
                className={`relative h-7 w-14 flex-shrink-0 rounded-full transition ${
                  notifications
                    ? "bg-blue-600"
                    : "bg-gray-700"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                    notifications
                      ? "left-8"
                      : "left-1"
                  }`}
                />
              </button>
            </div>

            {/* Safety Status */}
            <div className="mt-6 rounded-xl border border-gray-800 bg-[#0D1424] p-4">
              <p className="text-sm text-gray-400">
                Safety Status
              </p>

              <div className="mt-3 flex items-center justify-between">
                <span>
                  Obstacle Protection
                </span>

                <span
                  className={
                    obstacleDetection
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {obstacleDetection
                    ? "● Enabled"
                    : "● Disabled"}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span>
                  Notifications
                </span>

                <span
                  className={
                    notifications
                      ? "text-green-400"
                      : "text-gray-400"
                  }
                >
                  {notifications
                    ? "● Enabled"
                    : "● Disabled"}
                </span>
              </div>
            </div>
          </div>

          {/* Connection */}
          <div className="rounded-2xl border border-gray-800 bg-[#121B2E] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-xl">
                📡
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  Connection
                </h2>

                <p className="text-sm text-gray-400">
                  Current virtual robot connection information.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <span className="text-gray-400">
                  Robot Status
                </span>

                <span className="font-semibold text-green-400">
                  ● Online
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <span className="text-gray-400">
                  Connection Type
                </span>

                <span className="font-semibold">
                  Virtual
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">
                  System Mode
                </span>

                <span className="font-semibold text-blue-400">
                  Manual Control
                </span>
              </div>
            </div>
          </div>

          {/* Current Configuration */}
          <div className="rounded-2xl border border-gray-800 bg-[#121B2E] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-xl">
                💻
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  Current Configuration
                </h2>

                <p className="text-sm text-gray-400">
                  Current RoboSphere settings.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <span className="text-gray-400">
                  Robot
                </span>

                <span className="font-semibold">
                  {robotName}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <span className="text-gray-400">
                  Robot ID
                </span>

                <span className="font-semibold">
                  {robotId}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">
                  Maximum Speed
                </span>

                <span className="font-semibold text-blue-400">
                  {speedLimit.toFixed(1)} m/s
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={handleSave}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 font-semibold transition hover:opacity-90"
          >
            Save Settings
          </button>

          {saved && (
            <div className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-400">
              ✓ Settings saved successfully
            </div>
          )}
        </div>
      </section>
    </main>
  );
}