"use client";

const services = [
  { id: 1, name: "General Checkup", duration: "45 min", price: "Rp 350.000 - Rp 750.000", active: true, bookings: 89 },
  { id: 2, name: "Dental Care", duration: "30-90 min", price: "Rp 200.000 - Rp 2.500.000", active: true, bookings: 67 },
  { id: 3, name: "Dermatology", duration: "30-60 min", price: "Rp 300.000 - Rp 1.500.000", active: true, bookings: 45 },
  { id: 4, name: "Pediatrics", duration: "30-45 min", price: "Rp 250.000 - Rp 600.000", active: true, bookings: 52 },
  { id: 5, name: "Lab Tests", duration: "15-30 min", price: "Rp 150.000 - Rp 3.000.000", active: true, bookings: 123 },
  { id: 6, name: "Emergency Care", duration: "Varies", price: "Rp 500.000+", active: true, bookings: 31 },
];

export default function ServicesManagement() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Services Management</h1>
        <button className="px-4 py-2 text-sm font-medium bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors">
          + Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{service.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${service.active ? "bg-green-500/20 text-green-400" : "bg-zinc-700 text-zinc-400"}`}>
                {service.active ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="space-y-2 text-sm text-zinc-400">
              <p>Duration: {service.duration}</p>
              <p>Price: {service.price}</p>
              <p>Bookings this month: {service.bookings}</p>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 px-3 py-1.5 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
                Edit
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors">
                Disable
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
