"use client";

import Link from "next/link";
import { useState } from "react";

export default function SensorsPage() {
  const [distance, setDistance] = useState(45);
  const [temperature, setTemperature] = useState(36);
  const [battery, setBattery] = useState(87);
  const [speed, setSpeed] = useState(1.2);

  const refreshSensors = () => {
    setDistance(Math.floor(Math.random() * 80) + 10);
    setTemperature(Math.floor(Math.random() * 10) + 30);
    setBattery((prev) => Math.max(prev - 1, 0));
    setSpeed(Number((Math.random() * 2).toFixed(1)));
  };

  return (
    <main className="min-h-screen bg-[#080D18] p-8 text-white">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Sensor Monitoring
          </h1>

          <p className="mt-2 text-gray-400">
            Monitor RoboSphere virtual sensor data.
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
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        {/* Distance */}
        <div className="rounded-2xl bg-[#121B2E] p-6">
          <div className="text-3xl">📡</div>

          <p className="mt-4 text-gray-400">
            Distance
          </p>

          <p className="mt-2 text-3xl font-bold">
            {distance} cm
          </p>

          <p
            className={`mt-3 text-sm ${
              distance < 20
                ? "text-red-400"
                : "text-green-400"
            }`}
          >
            {distance < 20
              ? "⚠️ Obstacle Nearby"
              : "✓ Clear"}
          </p>
        </div>

        {/* Temperature */}
        <div className="rounded-2xl bg-[#121B2E] p-6">
          <div className="text-3xl">🌡️</div>

          <p className="mt-4 text-gray-400">
            Temperature
          </p>

          <p className="mt-2 text-3xl font-bold">
            {temperature}°C
          </p>

          <p
            className={`mt-3 text-sm ${
              temperature > 38
                ? "text-yellow-400"
                : "text-green-400"
            }`}
          >
            {temperature > 38
              ? "⚠️ High Temperature"
              : "✓ Normal"}
          </p>
        </div>

        {/* Battery */}
        <div className="rounded-2xl bg-[#121B2E] p-6">
          <div className="text-3xl">🔋</div>

          <p className="mt-4 text-gray-400">
            Battery
          </p>

          <p className="mt-2 text-3xl font-bold">
            {battery}%
          </p>

          <p
            className={`mt-3 text-sm ${
              battery <= 20
                ? "text-red-400"
                : "text-green-400"
            }`}
          >
            {battery <= 20
              ? "⚠️ Low Battery"
              : "✓ Normal"}
          </p>
        </div>

        {/* Speed */}
        <div className="rounded-2xl bg-[#121B2E] p-6">
          <div className="text-3xl">💨</div>

          <p className="mt-4 text-gray-400">
            Speed
          </p>

          <p className="mt-2 text-3xl font-bold">
            {speed} m/s
          </p>

          <p className="mt-3 text-sm text-green-400">
            ✓ Stable
          </p>
        </div>
      </div>

      {/* Sensor Details */}
      <div className="mt-8 rounded-2xl bg-[#121B2E] p-6">
        <h2 className="text-xl font-semibold">
          Sensor Status
        </h2>

        <div className="mt-6 space-y-4">

          <div className="flex justify-between rounded-xl bg-[#0D1424] p-4">
            <span className="text-gray-400">
              Distance Sensor
            </span>
            <span>{distance} cm</span>
          </div>

          <div className="flex justify-between rounded-xl bg-[#0D1424] p-4">
            <span className="text-gray-400">
              Temperature Sensor
            </span>
            <span>{temperature}°C</span>
          </div>

          <div className="flex justify-between rounded-xl bg-[#0D1424] p-4">
            <span className="text-gray-400">
              Battery Level
            </span>
            <span>{battery}%</span>
          </div>

          <div className="flex justify-between rounded-xl bg-[#0D1424] p-4">
            <span className="text-gray-400">
              Robot Speed
            </span>
            <span>{speed} m/s</span>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={refreshSensors}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 font-semibold hover:opacity-90"
        >
          🔄 Refresh Sensor Data
        </button>
      </div>
    </main>
  );
}