"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";

type SensorData = {
  battery: number;
  temperature: number;
  speed: number;
  distance: number;
  obstacle_detected: boolean;
  obstacle_detection_enabled: boolean;
  status: string;
  x: number;
  y: number;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function SensorsPage() {
  const router = useRouter();

  const [sensorData, setSensorData] = useState<SensorData>({
    battery: 100,
    temperature: 36,
    speed: 0,
    distance: 0,
    obstacle_detected: false,
    obstacle_detection_enabled: true,
    status: "Stopped",
    x: 20,
    y: 50,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchSensors = async () => {
    try {
      setLoading(true);
      setError(false);

      // Get JWT token saved after login
      const token = localStorage.getItem("robosphere_token");

      // If there is no token, send user to login
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/robot/sensors`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Token invalid or expired
      if (response.status === 401) {
        localStorage.removeItem("robosphere_token");
        localStorage.removeItem("robosphere_user");

        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to load sensor data");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setSensorData(data);
    } catch (error) {
      console.error("Sensor error:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensors();
  }, []);

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

        {/* Error Message */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            Failed to load sensor data. Please check the backend connection.
          </div>
        )}

        {/* Sensor Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {/* Distance */}
          <div className="rounded-2xl border border-gray-800 bg-[#121B2E] p-6">
            <p className="text-sm text-gray-400">
              Distance Sensor
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              📡 {sensorData.distance}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              units
            </p>

            <p
              className={`mt-4 text-sm font-semibold ${
                sensorData.obstacle_detected
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            >
              {sensorData.obstacle_detected
                ? "⚠ Obstacle Detected"
                : "● Clear"}
            </p>
          </div>

          {/* Temperature */}
          <div className="rounded-2xl border border-gray-800 bg-[#121B2E] p-6">
            <p className="text-sm text-gray-400">
              Temperature
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              🌡️ {sensorData.temperature}°C
            </h2>

            <p
              className={`mt-4 text-sm font-semibold ${
                sensorData.temperature >= 38
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            >
              {sensorData.temperature >= 38
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
              🔋 {sensorData.battery}%
            </h2>

            <p
              className={`mt-4 text-sm font-semibold ${
                sensorData.battery <= 20
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            >
              {sensorData.battery <= 20
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
              ⚡ {sensorData.speed} m/s
            </h2>

            <p
              className={`mt-4 text-sm font-semibold ${
                sensorData.speed === 0
                  ? "text-gray-400"
                  : "text-green-400"
              }`}
            >
              {sensorData.speed === 0
                ? "● Stopped"
                : "● Moving"}
            </p>
          </div>
        </div>

        {/* Robot Information */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Position */}
          <div className="rounded-2xl border border-gray-800 bg-[#121B2E] p-6">
            <h2 className="text-xl font-semibold">
              Robot Position
            </h2>

            <div className="mt-5 space-y-4">
              <div className="flex justify-between border-b border-gray-800 pb-3">
                <span className="text-gray-400">
                  X Position
                </span>

                <span className="font-semibold">
                  {sensorData.x}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">
                  Y Position
                </span>

                <span className="font-semibold">
                  {sensorData.y}
                </span>
              </div>
            </div>
          </div>

          {/* Robot Status */}
          <div className="rounded-2xl border border-gray-800 bg-[#121B2E] p-6">
            <h2 className="text-xl font-semibold">
              Robot Status
            </h2>

            <div className="mt-5 space-y-4">
              <div className="flex justify-between border-b border-gray-800 pb-3">
                <span className="text-gray-400">
                  Status
                </span>

                <span className="font-semibold text-blue-400">
                  {sensorData.status}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">
                  Obstacle Protection
                </span>

                <span
                  className={`font-semibold ${
                    sensorData.obstacle_detection_enabled
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {sensorData.obstacle_detection_enabled
                    ? "● Enabled"
                    : "● Disabled"}
                </span>
              </div>
            </div>
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
        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={fetchSensors}
            disabled={loading}
            className={`rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold transition ${
              loading
                ? "cursor-not-allowed opacity-50"
                : "hover:opacity-90"
            }`}
          >
            {loading
              ? "Refreshing..."
              : "Refresh Sensor Data"}
          </button>

          {!error && !loading && (
            <span className="text-sm text-green-400">
              ● Connected to backend
            </span>
          )}
        </div>
      </section>
    </main>
  );
}