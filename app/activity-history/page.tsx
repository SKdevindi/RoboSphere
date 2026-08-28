"use client";

import Link from "next/link";
import Sidebar from "../components/Sidebar";
import { useRobot } from "../context/RobotContext";

export default function ActivityHistoryPage() {
  const {
    activities,
    clearActivities,
    battery,
    speed,
    status,
  } = useRobot();

  return (
    <main className="flex min-h-screen bg-[#080D18] text-white">
      <Sidebar />

      <section className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Activity History
            </h1>

            <p className="mt-2 text-gray-400">
              View RoboSphere robot activity and system events.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-lg bg-blue-600 px-5 py-3 hover:bg-blue-700"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-[#121B2E] p-5">
            <p className="text-sm text-gray-400">
              Total Activities
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {activities.length}
            </h2>
          </div>

          <div className="rounded-xl bg-[#121B2E] p-5">
            <p className="text-sm text-gray-400">
              Robot Status
            </p>

            <h2 className="mt-2 text-xl font-bold text-green-400">
              {status}
            </h2>
          </div>

          <div className="rounded-xl bg-[#121B2E] p-5">
            <p className="text-sm text-gray-400">
              Battery
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              🔋 {battery}%
            </h2>
          </div>
        </div>

        {/* Activity List */}
        <div className="mt-8 rounded-2xl bg-[#121B2E] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Robot Activity
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Current speed: {speed} m/s
              </p>
            </div>

            {activities.length > 0 && (
              <button
                onClick={clearActivities}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-700"
              >
                Clear History
              </button>
            )}
          </div>

          <div className="mt-6 space-y-3">
            {activities.length === 0 ? (
              <div className="rounded-xl bg-[#0D1424] p-8 text-center">
                <p className="text-4xl">📋</p>

                <p className="mt-3 text-gray-400">
                  No activity recorded yet.
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Control the robot to create activity records.
                </p>
              </div>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between rounded-xl border border-gray-800 bg-[#0D1424] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                      🤖
                    </div>

                    <div>
                      <p className="font-medium text-gray-200">
                        {activity.action}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Robot RBS-001
                      </p>
                    </div>
                  </div>

                  <span className="text-sm text-gray-400">
                    {activity.time}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}