export default function Home() {
  return (
    <main className="min-h-screen bg-[#080D18] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0D1424] p-6">
        <h1 className="text-2xl font-bold mb-10">🤖 RoboSphere</h1>

        <nav className="space-y-3">
          <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-3">
            Dashboard
          </div>

          <div className="p-3 text-gray-400">Robot Control</div>
          <div className="p-3 text-gray-400">Sensors</div>
          <div className="p-3 text-gray-400">Activity History</div>
          <div className="p-3 text-gray-400">Settings</div>
        </nav>
      </aside>

      {/* Main Content */}
      <section className="flex-1 p-8">
        <h2 className="text-3xl font-bold">Dashboard</h2>

        <p className="mt-2 text-gray-400">
          Welcome to your RoboSphere control system.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-6">
          {/* Virtual Robot Area */}
          <div className="col-span-2 h-80 rounded-2xl bg-[#121B2E] p-6">
            <h3 className="text-xl font-semibold">
              Virtual Robot Environment
            </h3>

            <div className="flex h-60 items-center justify-center text-7xl">
              🤖
            </div>
          </div>

          {/* Robot Information */}
          <div className="rounded-2xl bg-[#121B2E] p-6">
            <h3 className="mb-6 text-xl font-semibold">
              Robot Information
            </h3>

            <div className="space-y-4 text-gray-300">
              <p>Robot ID: RBS-001</p>
              <p>Status: 🟢 Online</p>
              <p>Mode: Manual</p>
              <p>Battery: 87%</p>
              <p>Speed: 1.2 m/s</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}