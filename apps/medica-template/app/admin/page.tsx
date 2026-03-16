const metrics = [
  { label: "Appointments Today", value: "24", change: "+3 from yesterday" },
  { label: "Patients This Month", value: "342", change: "+18% vs last month" },
  { label: "Revenue (Monthly)", value: "Rp 156.400.000", change: "+12.5%" },
  { label: "Pending Appointments", value: "8", change: "5 need confirmation" },
];

const recentAppointments = [
  { id: "APT-001", patient: "Rina Wulandari", doctor: "Dr. Sarah Chen", service: "General Checkup", time: "09:00 AM", status: "confirmed" },
  { id: "APT-002", patient: "Budi Santoso", doctor: "Dr. Michael Hartono", service: "Dental Care", time: "10:30 AM", status: "in-progress" },
  { id: "APT-003", patient: "Maya Sari", doctor: "Dr. James Wilson", service: "Dermatology", time: "11:00 AM", status: "pending" },
  { id: "APT-004", patient: "Ahmad Fadli", doctor: "Dr. Sarah Chen", service: "Lab Tests", time: "02:00 PM", status: "confirmed" },
  { id: "APT-005", patient: "Dewi Lestari", doctor: "Dr. Anita Dewi", service: "Pediatrics", time: "03:30 PM", status: "pending" },
];

const statusColors: Record<string, string> = {
  confirmed: "bg-green-500/20 text-green-400",
  "in-progress": "bg-blue-500/20 text-blue-400",
  pending: "bg-yellow-500/20 text-yellow-400",
  cancelled: "bg-red-500/20 text-red-400",
};

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {metrics.map((m) => (
          <div key={m.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{m.label}</p>
            <p className="text-2xl font-semibold mt-2">{m.value}</p>
            <p className="text-xs text-zinc-500 mt-1">{m.change}</p>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Today&apos;s Appointments</h2>
          <a href="/admin/appointments" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            View all &rarr;
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-zinc-500 uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Doctor</th>
                <th className="px-5 py-3 font-medium">Service</th>
                <th className="px-5 py-3 font-medium">Time</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {recentAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-zinc-800/50">
                  <td className="px-5 py-3 font-mono text-xs">{apt.id}</td>
                  <td className="px-5 py-3">{apt.patient}</td>
                  <td className="px-5 py-3 text-zinc-400">{apt.doctor}</td>
                  <td className="px-5 py-3 text-zinc-400">{apt.service}</td>
                  <td className="px-5 py-3">{apt.time}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full capitalize ${statusColors[apt.status]}`}>
                      {apt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
