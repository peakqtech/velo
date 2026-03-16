export default function BillingPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-4">Billing</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {[
          { plan: "Free", price: "$0", features: ["1 site", "3 integrations", "Monthly QA report"], current: true },
          { plan: "Pro", price: "$49/mo", features: ["Unlimited sites", "All integrations", "Weekly QA reports", "Custom domain"], current: false },
          { plan: "Agency", price: "$199/mo", features: ["Everything in Pro", "White-label", "Client management", "Priority support"], current: false },
        ].map((tier) => (
          <div key={tier.plan} className={`bg-zinc-900 border rounded-xl p-6 ${tier.current ? "border-blue-500" : "border-zinc-800"}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{tier.plan}</h3>
              {tier.current && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">Current</span>}
            </div>
            <div className="text-2xl font-bold mb-4">{tier.price}</div>
            <ul className="space-y-2">
              {tier.features.map((f) => (
                <li key={f} className="text-sm text-zinc-400 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  {f}
                </li>
              ))}
            </ul>
            {!tier.current && (
              <button className="w-full mt-6 h-9 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium rounded-lg transition-colors">
                Upgrade
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
