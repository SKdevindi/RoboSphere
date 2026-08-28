"use client";

import Link from "next/link";
import { useState } from "react";

export default function ActivityHistoryPage() {
  const [activities, setActivities] = useState([
    {
      id: 1,
      action: "Robot moved forward",
      time: "10:05 AM",
      type: "movement",
    },
    {
      id: 2,
      action: "Robot moved right",
      time: "10:07 AM",
      type: "movement",
    },
    {
      id: 3,
      action: "Obstacle detected",
      time: "10:08 AM",
      type: "warning",
    },
    {
      id: 4,
      action: "Robot stopped",
      time: "10:09 AM",
      type: "stop",
    },
    {
      id: 5,
      action: "Battery level updated",
      time: "10:10 AM",
      type: "system",
    },
  ]);

  const clearHistory = () => {
    setActivities([]);
  };

  return (
    <main className="min-h-screen bg-[#080D18] p-8 text-white">
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
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-[#121B2E] p-6">
          <p className="text-gray-400">
            Total Activities
          </p>

          <p className="mt-2 text-3xl font-bold">
            {activities.length}
          </p>
        </div>

        <div className="rounded-2xl bg-[#121B2E] p-6">
          <p className="text-gray-400">
            Movement Events
          </p>

          <p className="mt-2 text-3xl font-bold text-green-400">
            {
              activities.filter(
                (activity) => activity.type === "movement"
              ).length
            }
          </p>
        </div>

        <div className="rounded-2xl bg-[#121B2E] p-6">
          <p className="text-gray-400">
            Warning Events
          </p>

          <p className="mt-2 text-3xl font-bold text-yellow-400">
            {
              activities.filter(
                (activity) => activity.type === "warning"
              ).length
            }
          </p>
        </div>
      </div>

      {/* Activity List */}
      <div className="mt-8 rounded-2xl bg-[#121B2E] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Recent Activities
          </h2>

          {activities.length > 0 && (
            <button
              onClick={clearHistory}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm hover:bg-red-700"
            >
              Clear History
            </button>
          )}
        </div>

        <div className="mt-6 space-y-4">
          {activities.length === 0 ? (
            <div className="rounded-xl bg-[#0D1424] p-6 text-center text-gray-400">
              No activity history available.
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between rounded-xl bg-[#0D1424] p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">
                    {activity.type === "movement"
                      ? "🤖"
                      : activity.type === "warning"
                      ? "⚠️"
                      : activity.type === "stop"
                      ? "🛑"
                      : "⚙️"}
                  </div>

                  <div>
                    <p className="font-semibold">
                      {activity.action}
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    activity.type === "movement"
                      ? "bg-green-500/20 text-green-400"
                      : activity.type === "warning"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : activity.type === "stop"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {activity.type}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}