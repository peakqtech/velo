"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "Overview", href: "/", icon: "grid" },
  { label: "Content", href: "/content", icon: "file-text" },
  { label: "Integrations", href: "/integrations", icon: "plug" },
  { label: "Reservations", href: "/reservations", icon: "calendar" },
  { label: "QA Reports", href: "/qa-reports", icon: "shield-check" },
  { label: "Settings", href: "/settings", icon: "settings" },
  { label: "Billing", href: "/billing", icon: "credit-card" },
];

const icons: Record<string, React.JSX.Element> = {
  grid: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  "file-text": <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  plug: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a6 6 0 0 1-12 0V8z"/></svg>,
  "shield-check": <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
  settings: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  calendar: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  "credit-card": <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [siteDropdownOpen, setSiteDropdownOpen] = useState(false);

  return (
    <div className="flex h-screen bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-zinc-800/80 flex flex-col bg-zinc-950">
        {/* Logo */}
        <div className="h-14 flex items-center px-5 border-b border-zinc-800/80">
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            Velo
          </span>
        </div>

        {/* Site Selector */}
        <div className="px-3 pt-3 pb-1">
          <button
            onClick={() => setSiteDropdownOpen(!siteDropdownOpen)}
            className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/80 transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-6 w-6 shrink-0 rounded bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">V</span>
              </div>
              <div className="min-w-0 text-left">
                <p className="text-xs font-medium text-zinc-200 truncate">Velocity Demo</p>
                <p className="text-[10px] text-zinc-500 truncate">velocity-demo.velo.dev</p>
              </div>
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-500 shrink-0">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {siteDropdownOpen && (
            <div className="mt-1 rounded-lg border border-zinc-800 bg-zinc-900 p-1 shadow-xl shadow-black/50">
              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-md bg-zinc-800">
                <div className="h-5 w-5 rounded bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-white">V</span>
                </div>
                <span className="text-xs text-zinc-200">Velocity Demo</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400 ml-auto">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="mt-1 border-t border-zinc-800 pt-1">
                <button className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add new site
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-3 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                  isActive
                    ? "bg-zinc-800/80 text-zinc-100 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                }`}
              >
                <span className="relative flex items-center">
                  {icons[item.icon]}
                  {isActive && (
                    <span className="absolute -left-[18px] top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-blue-500" />
                  )}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-zinc-800/80">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-blue-600/20">
              Y
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-zinc-200 truncate">Yohanes</div>
              <div className="text-[11px] text-zinc-500 truncate">Free plan</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-600 shrink-0">
              <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
            </svg>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-zinc-950">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
