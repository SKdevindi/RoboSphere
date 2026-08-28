"use client";

import { useState } from "react";

export default function RobotControlPage() {
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);
  const [status, setStatus] = useState("Stopped");

  const moveUp = () => {
    setY((prev) => Math.max(prev - 10, 0));
    setStatus("Moving Forward");
  };

  const moveDown = () => {
    setY((prev) => Math.min(prev + 10, 90));
    setStatus("Moving Backward");
  };

  const moveLeft = () => {
    setX((prev) => Math.max(prev - 10, 0));
    setStatus("Turning Left");
  };

  const moveRight = () => {
    setX((prev) => Math.min(prev + 10, 90));
    setStatus("Turning Right");
  };

  const stopRobot = () => {
    setStatus("Stopped");
  };

  return (
    <main className="min-h-screen bg-[#080D18] text-white p-8">
      <h1 className="text-3xl font-bold">Robot Control</h1>

      <p className="mt-2 text-gray-400">
        Control the RoboSphere virtual robot.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-8">
        {/* Virtual Environment */}
        <div className="rounded-2xl bg-[#121B2E] p-6">
          <h2 className="text-xl font-semibold mb-4">
            Virtual Environment
          </h2>

          <div className="relative h-[400px] rounded-xl bg-[#0D1424] border border-gray-700 overflow-hidden">
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

        {/* Controls */}
        <div className="rounded-2xl bg-[#121B2E] p-6">
          <h2 className="text-xl font-semibold">Controls</h2>

          <p className="mt-4 text-gray-400">
            Status:{" "}
            <span className="text-green-400 font-semibold">
              {status}
            </span>
          </p>

          <div className="mt-10 flex flex-col items-center gap-4">
            <button
              onClick={moveUp}
              className="h-16 w-16 rounded-xl bg-blue-600 text-2xl hover:bg-blue-700"
            >
              ↑
            </button>

            <div className="flex gap-4">
              <button
                onClick={moveLeft}
                className="h-16 w-16 rounded-xl bg-blue-600 text-2xl hover:bg-blue-700"
              >
                ←
              </button>

              <button
                onClick={stopRobot}
                className="h-16 w-20 rounded-xl bg-red-600 font-bold hover:bg-red-700"
              >
                STOP
              </button>

              <button
                onClick={moveRight}
                className="h-16 w-16 rounded-xl bg-blue-600 text-2xl hover:bg-blue-700"
              >
                →
              </button>
            </div>

            <button
              onClick={moveDown}
              className="h-16 w-16 rounded-xl bg-blue-600 text-2xl hover:bg-blue-700"
            >
              ↓
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}