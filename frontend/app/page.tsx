"use client";

import Sidebar from "./components/Sidebar";
import { useRobot } from "./context/RobotContext";

export default function Home() {
  const {
    x,
    y,
    battery,
    speed,
    status,
    distance,
    temperature,
    activities,
  } = useRobot();

  return (
    <main className="flex min-h-screen bg-[#080D18] text-white">
      <Sidebar />

      <section className="flex-1 p-8">
        <h2 className="text-3xl font-bold">Dashboard</h2>

        <p className="mt-2 text-gray-400">
          Welcome to your RoboSphere control system.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Virtual Robot Environment */}
          <div className="rounded-2xl bg-[#121B2E] p-6 lg:col-span-2">
            <h3 className="text-xl font-semibold">
              Virtual Robot Environment
            </h3>

            <div className="relative mt-4 h-60 overflow-hidden rounded-xl bg-[#0D1424]">
              {/* Obstacle */}
              <div
                className="absolute text-5xl"
                style={{
                  left: "60%",
                  top: "50%",
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
                }}
              >
                🤖
              </div>
            </div>
          </div>

          {/* Robot Information */}
          <div className="rounded-2xl bg-[#121B2E] p-6">
            <h3 className="mb-6 text-xl font-semibold">
              Robot Information
            </h3>

            <div className="space-y-4 text-gray-300">
              <p>
                Robot ID:{" "}
                <span className="font-semibold text-white">
                  RBS-001
                </span>
              </p>

              <p>
                Status:{" "}
                <span className="font-semibold text-green-400">
                  {status}
                </span>
              </p>

              <p>
                Mode:{" "}
                <span className="font-semibold text-white">
                  Manual
                </span>
              </p>

              <p>
                Battery:{" "}
                <span className="font-semibold text-white">
                  {battery}%
                </span>
              </p>

              <p>
                Speed:{" "}
                <span className="font-semibold text-white">
                  {speed} m/s
                </span>
              </p>

              <p>
                Position:{" "}
                <span className="font-semibold text-white">
                  X: {x}, Y: {y}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Sensor Cards */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl bg-[#121B2E] p-5">
            <p className="text-sm text-gray-400">
              Battery
            </p>

            <h3 className="mt-2 text-2xl font-bold">
              🔋 {battery}%
            </h3>

            <p
              className={`mt-2 text-sm ${
                battery <= 20
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            >
              {battery <= 20 ? "Low Battery" : "Normal"}
            </p>
          </div>

          <div className="rounded-xl bg-[#121B2E] p-5">
            <p className="text-sm text-gray-400">
              Speed
            </p>

            <h3 className="mt-2 text-2xl font-bold">
              ⚡ {speed} m/s
            </h3>

            <p className="mt-2 text-sm text-green-400">
              {speed === 0 ? "Stopped" : "Moving"}
            </p>
          </div>

          <div className="rounded-xl bg-[#121B2E] p-5">
            <p className="text-sm text-gray-400">
              Distance
            </p>

            <h3 className="mt-2 text-2xl font-bold">
              📡 {distance} units
            </h3>

            <p
              className={`mt-2 text-sm ${
                distance < 15
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            >
              {distance < 15 ? "Obstacle Near" : "Clear"}
            </p>
          </div>

          <div className="rounded-xl bg-[#121B2E] p-5">
            <p className="text-sm text-gray-400">
              Temperature
            </p>

            <h3 className="mt-2 text-2xl font-bold">
              🌡️ {temperature}°C
            </h3>

            <p
              className={`mt-2 text-sm ${
                temperature >= 38
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            >
              {temperature >= 38 ? "High" : "Normal"}
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6 rounded-2xl bg-[#121B2E] p-6">
          <h3 className="text-xl font-semibold">
            Recent Activity
          </h3>

          <div className="mt-4 space-y-3">
            {activities.length === 0 ? (
              <p className="text-gray-400">
                No recent robot activity.
              </p>
            ) : (
              activities.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between rounded-lg bg-[#0D1424] p-3"
                >
                  <span className="text-gray-300">
                    🤖 {activity.action}
                  </span>

                  <span className="text-xs text-gray-500">
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