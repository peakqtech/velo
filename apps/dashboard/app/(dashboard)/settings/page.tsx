export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-4">Settings</h1>
      <div className="space-y-6 max-w-2xl">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="font-semibold mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Name</label>
              <input className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Email</label>
              <input className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" />
            </div>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="font-semibold text-red-400 mb-4">Danger Zone</h2>
          <button className="px-4 py-2 bg-red-900/50 border border-red-800 text-red-400 rounded-lg text-sm hover:bg-red-900 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
