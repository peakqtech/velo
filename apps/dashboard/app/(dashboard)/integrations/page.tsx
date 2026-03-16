export default function IntegrationsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-4">Integrations</h1>
      <p className="text-zinc-400">Connect services to power your business.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {[
          { name: "Payments", desc: "Stripe, Xendit, Midtrans, Durianpay", status: "coming" },
          { name: "Forms", desc: "Contact forms & lead capture", status: "coming" },
          { name: "Analytics", desc: "Plausible / Google Analytics", status: "coming" },
          { name: "CMS", desc: "Visual content editor", status: "coming" },
          { name: "WhatsApp", desc: "Chat widget for customers", status: "coming" },
        ].map((item) => (
          <div key={item.name} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{item.name}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">Coming soon</span>
            </div>
            <p className="text-sm text-zinc-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
