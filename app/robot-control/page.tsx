"use client";

import { useState } from "react";

export default function RobotControlPage() {
  // Robot states
  const [x, setX] = useState(20);
  const [y, setY] = useState(50);
  const [status, setStatus] = useState("Stopped");
  const [battery, setBattery] = useState(100);
  const [speed, setSpeed] = useState(0);
  const [activity, setActivity] = useState<string[]>([]);

  // Obstacle position
  const obstacleX = 60;
  const obstacleY = 50;

  // Calculate distance between robot and obstacle
  const distance = Math.round(
    Math.sqrt(
      Math.pow(x - obstacleX, 2) +
      Math.pow(y - obstacleY, 2)
    )
  );

  // Check for obstacle
  const isObstacle = (newX: number, newY: number) => {
    const distanceX = Math.abs(newX - obstacleX);
    const distanceY = Math.abs(newY - obstacleY);

    return distanceX < 12 && distanceY < 12;
  };

  // Add activity
  const addActivity = (message: string) => {
    setActivity((prev) => [message, ...prev]);
  };

  // Move Forward
  const moveUp = () => {
    if (battery <= 0) {
      setStatus("🔋 Battery Empty");
      addActivity("Movement failed - battery empty");
      return;
    }

    const newY = Math.max(y - 10, 0);

    if (isObstacle(x, newY)) {
      setStatus("⚠️ Obstacle Detected");
      setSpeed(0);
      addActivity("Obstacle detected");
      return;
    }

    setY(newY);
    setBattery((prev) => Math.max(prev - 1, 0));
    setSpeed(1.2);
    setStatus("Moving Forward");
    addActivity("Robot moved forward");
  };

  // Move Backward
  const moveDown = () => {
    if (battery <= 0) {
      setStatus("🔋 Battery Empty");
      addActivity("Movement failed - battery empty");
      return;
    }

    const newY = Math.min(y + 10, 90);

    if (isObstacle(x, newY)) {
      setStatus("⚠️ Obstacle Detected");
      setSpeed(0);
      addActivity("Obstacle detected");
      return;
    }

    setY(newY);
    setBattery((prev) => Math.max(prev - 1, 0));
    setSpeed(1.2);
    setStatus("Moving Backward");
    addActivity("Robot moved backward");
  };

  // Move Left
  const moveLeft = () => {
    if (battery <= 0) {
      setStatus("🔋 Battery Empty");
      addActivity("Movement failed - battery empty");
      return;
    }

    const newX = Math.max(x - 10, 0);

    if (isObstacle(newX, y)) {
      setStatus("⚠️ Obstacle Detected");
      setSpeed(0);
      addActivity("Obstacle detected");
      return;
    }

    setX(newX);
    setBattery((prev) => Math.max(prev - 1, 0));
    setSpeed(1.2);
    setStatus("Moving Left");
    addActivity("Robot moved left");
  };

  // Move Right
  const moveRight = () => {
    if (battery <= 0) {
      setStatus("🔋 Battery Empty");
      addActivity("Movement failed - battery empty");
      return;
    }

    const newX = Math.min(x + 10, 90);

    if (isObstacle(newX, y)) {
      setStatus("⚠️ Obstacle Detected");
      setSpeed(0);
      addActivity("Obstacle detected");
      return;
    }

    setX(newX);
    setBattery((prev) => Math.max(prev - 1, 0));
    setSpeed(1.2);
    setStatus("Moving Right");
    addActivity("Robot moved right");
  };

  // Stop Robot
  const stopRobot = () => {
    setSpeed(0);
    setStatus("Stopped");
    addActivity("Robot stopped");
  };

  return (
    <main className="min-h-screen bg-[#080D18] p-8 text-white">
      {/* Page Header */}
      <h1 className="text-3xl font-bold">
        Robot Control
      </h1>

      <p className="mt-2 text-gray-400">
        Control and monitor the RoboSphere virtual robot.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">

        {/* ============================= */}
        {/* VIRTUAL ENVIRONMENT */}
        {/* ============================= */}

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

          <div className="mt-4 flex justify-between text-sm text-gray-400">
            <span>🤖 Virtual Robot</span>
            <span>🚧 Obstacle</span>
          </div>
        </div>

        {/* ============================= */}
        {/* CONTROL PANEL */}
        {/* ============================= */}

        <div className="rounded-2xl bg-[#121B2E] p-6">
          <h2 className="text-xl font-semibold">
            Control Panel
          </h2>

          {/* Battery + Speed */}
          <div className="mt-6 grid grid-cols-2 gap-4">

            {/* Battery */}
            <div className="rounded-xl bg-[#0D1424] p-4">
              <p className="text-sm text-gray-400">
                Battery
              </p>

              <p className="mt-2 text-2xl font-bold">
                🔋 {battery}%
              </p>

              {battery <= 20 && battery > 0 && (
                <p className="mt-2 text-sm text-yellow-400">
                  ⚠️ Low Battery
                </p>
              )}

              {battery === 0 && (
                <p className="mt-2 text-sm text-red-400">
                  Battery Empty
                </p>
              )}
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
          <div className="mt-4 rounded-xl bg-[#0D1424] p-4">
            <p className="text-sm text-gray-400">
              Distance Sensor
            </p>

            <p className="mt-2 text-2xl font-bold">
              📡 {distance} units
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
                status.includes("Obstacle")
                  ? "text-yellow-400"
                  : status.includes("Battery")
                  ? "text-red-400"
                  : status === "Stopped"
                  ? "text-gray-300"
                  : "text-green-400"
              }`}
            >
              {status}
            </p>
          </div>

          {/* ============================= */}
          {/* MOVEMENT BUTTONS */}
          {/* ============================= */}

          <div className="mt-8 flex flex-col items-center gap-4">

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

      {/* ============================= */}
      {/* ACTIVITY HISTORY */}
      {/* ============================= */}

      <div className="mt-8 rounded-2xl bg-[#121B2E] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Activity History
          </h2>

          {activity.length > 0 && (
            <button
              onClick={() => setActivity([])}
              className="rounded-lg bg-gray-700 px-4 py-2 text-sm hover:bg-gray-600"
            >
              Clear History
            </button>
          )}
        </div>

        <div className="mt-4 space-y-3">
          {activity.length === 0 ? (
            <p className="text-gray-400">
              No robot activity yet.
            </p>
          ) : (
            activity.map((item, index) => (
              <div
                key={index}
                className="rounded-lg bg-[#0D1424] p-3 text-gray-300"
              >
                🤖 {item}
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}