const appointments = [
  { id: "APT-001", patient: "Rina Wulandari", doctor: "Dr. Sarah Chen", service: "General Checkup", date: "2026-03-16", time: "09:00 AM", status: "confirmed", phone: "+62 812-1111-2222" },
  { id: "APT-002", patient: "Budi Santoso", doctor: "Dr. Michael Hartono", service: "Dental Care", date: "2026-03-16", time: "10:30 AM", status: "in-progress", phone: "+62 813-3333-4444" },
  { id: "APT-003", patient: "Maya Sari", doctor: "Dr. James Wilson", service: "Dermatology", date: "2026-03-16", time: "11:00 AM", status: "pending", phone: "+62 814-5555-6666" },
  { id: "APT-004", patient: "Ahmad Fadli", doctor: "Dr. Sarah Chen", service: "Lab Tests", date: "2026-03-16", time: "02:00 PM", status: "confirmed", phone: "+62 815-7777-8888" },
  { id: "APT-005", patient: "Dewi Lestari", doctor: "Dr. Anita Dewi", service: "Pediatrics", date: "2026-03-17", time: "09:30 AM", status: "pending", phone: "+62 816-9999-0000" },
  { id: "APT-006", patient: "Hendra Wijaya", doctor: "Dr. Robert Tanaka", service: "General Checkup", date: "2026-03-17", time: "10:00 AM", status: "confirmed", phone: "+62 817-1122-3344" },
  { id: "APT-007", patient: "Siti Nurhaliza", doctor: "Dr. Michael Hartono", service: "Dental Care", date: "2026-03-17", time: "01:00 PM", status: "cancelled", phone: "+62 818-5566-7788" },
];

const statusColors: Record<string, string> = {
  confirmed: "bg-green-500/20 text-green-400",
  "in-progress": "bg-blue-500/20 text-blue-400",
  pending: "bg-yellow-500/20 text-yellow-400",
  cancelled: "bg-red-500/20 text-red-400",
};

export default function AppointmentsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Appointments</h1>
        <button className="px-4 py-2 text-sm font-medium bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors">
          + New Appointment
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Doctor</th>
                <th className="px-5 py-3 font-medium">Service</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Time</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-zinc-800/50">
                  <td className="px-5 py-3 font-mono text-xs">{apt.id}</td>
                  <td className="px-5 py-3 font-medium">{apt.patient}</td>
                  <td className="px-5 py-3 text-zinc-400">{apt.doctor}</td>
                  <td className="px-5 py-3 text-zinc-400">{apt.service}</td>
                  <td className="px-5 py-3">{apt.date}</td>
                  <td className="px-5 py-3">{apt.time}</td>
                  <td className="px-5 py-3 text-zinc-400 font-mono text-xs">{apt.phone}</td>
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
