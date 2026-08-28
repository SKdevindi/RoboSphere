"use client";

import Link from "next/link";
import { useState } from "react";

export default function SettingsPage() {
  const [robotName, setRobotName] = useState("RoboSphere Robot");
  const [robotId, setRobotId] = useState("RBS-001");
  const [speedLimit, setSpeedLimit] = useState(1.2);
  const [obstacleDetection, setObstacleDetection] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const saveSettings = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-[#080D18] p-8 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>

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

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Robot Settings */}
        <div className="rounded-2xl bg-[#121B2E] p-6">
          <h2 className="text-xl font-semibold">
            🤖 Robot Configuration
          </h2>

          <div className="mt-6">
            <label className="text-sm text-gray-400">
              Robot Name
            </label>

            <input
              type="text"
              value={robotName}
              onChange={(e) => setRobotName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-700 bg-[#0D1424] p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="mt-5">
            <label className="text-sm text-gray-400">
              Robot ID
            </label>

            <input
              type="text"
              value={robotId}
              onChange={(e) => setRobotId(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-700 bg-[#0D1424] p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="mt-5">
            <label className="text-sm text-gray-400">
              Maximum Speed (m/s)
            </label>

            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={speedLimit}
              onChange={(e) =>
                setSpeedLimit(Number(e.target.value))
              }
              className="mt-2 w-full rounded-xl border border-gray-700 bg-[#0D1424] p-3 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* System Settings */}
        <div className="rounded-2xl bg-[#121B2E] p-6">
          <h2 className="text-xl font-semibold">
            ⚙️ System Settings
          </h2>

          <div className="mt-6 flex items-center justify-between rounded-xl bg-[#0D1424] p-4">
            <div>
              <p className="font-semibold">
                Obstacle Detection
              </p>

              <p className="text-sm text-gray-400">
                Stop the robot when an obstacle is detected.
              </p>
            </div>

            <input
              type="checkbox"
              checked={obstacleDetection}
              onChange={(e) =>
                setObstacleDetection(e.target.checked)
              }
              className="h-5 w-5"
            />
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl bg-[#0D1424] p-4">
            <div>
              <p className="font-semibold">
                Notifications
              </p>

              <p className="text-sm text-gray-400">
                Show system and sensor warnings.
              </p>
            </div>

            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) =>
                setNotifications(e.target.checked)
              }
              className="h-5 w-5"
            />
          </div>

          {/* System Information */}
          <div className="mt-6 rounded-xl bg-[#0D1424] p-4">
            <p className="text-sm text-gray-400">
              System
            </p>

            <p className="mt-2 font-semibold">
              RoboSphere Virtual Robot System
            </p>

            <p className="mt-2 text-sm text-green-400">
              ● Online
            </p>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={saveSettings}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 font-semibold hover:opacity-90"
        >
          Save Settings
        </button>

        {saved && (
          <p className="text-green-400">
            ✓ Settings saved successfully
          </p>
        )}
      </div>
    </main>
  );
}