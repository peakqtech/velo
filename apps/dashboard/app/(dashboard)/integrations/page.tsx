"use client";

import React, { useState, useCallback } from "react";
import { getIntegrationIcon } from "./integration-icons";
import ConfigPanel from "./config-panel";

interface IntegrationDef {
  name: string;
  displayName: string;
  description: string;
  category: string;
  defaultConfig: Record<string, unknown>;
}

const INTEGRATIONS: IntegrationDef[] = [
  {
    name: "payments",
    displayName: "Payments",
    description:
      "Accept payments via Stripe (global), Xendit (SE Asia), Durianpay, or Midtrans (Indonesia)",
    category: "payments",
    defaultConfig: {
      provider: "stripe",
      currency: "USD",
    },
  },
  {
    name: "forms",
    displayName: "Forms & Lead Capture",
    description:
      "Contact forms, lead capture, and newsletter signup with email notifications",
    category: "forms",
    defaultConfig: {
      submitSuccessMessage: "Thank you! We'll be in touch.",
      honeypotField: "_hp",
    },
  },
  {
    name: "analytics",
    displayName: "Analytics",
    description:
      "Website analytics with Plausible (privacy-friendly) or Google Analytics 4",
    category: "analytics",
    defaultConfig: {
      provider: "plausible",
      plausibleApiHost: "https://plausible.io",
    },
  },
  {
    name: "whatsapp",
    displayName: "WhatsApp Business",
    description: "Chat widget for customer communication via WhatsApp",
    category: "communication",
    defaultConfig: {
      defaultMessage: "Hello! I'm interested in your services.",
      position: "bottom-right",
      showOnMobile: true,
      businessHours: { enabled: false },
    },
  },
  {
    name: "cms",
    displayName: "Content Management",
    description:
      "Visual content editor for your site — edit text, images, and sections from the dashboard",
    category: "content",
    defaultConfig: {
      allowMediaUpload: true,
      maxMediaSizeMb: 10,
      autoSave: false,
      autoSaveIntervalMs: 30000,
    },
  },
];

const categoryColors: Record<string, string> = {
  payments: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  forms: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  analytics: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  communication: "bg-green-500/10 text-green-400 border-green-500/20",
  content: "bg-sky-500/10 text-sky-400 border-sky-500/20",
};

function SuccessToast({ message, onDone }: { message: string; onDone: () => void }) {
  React.useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-bottom duration-300">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

export default function IntegrationsPage() {
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>({});
  const [configMap, setConfigMap] = useState<Record<string, Record<string, unknown>>>(
    () => {
      const initial: Record<string, Record<string, unknown>> = {};
      for (const i of INTEGRATIONS) {
        initial[i.name] = { ...i.defaultConfig };
      }
      return initial;
    }
  );
  const [configuredSet, setConfiguredSet] = useState<Set<string>>(new Set());
  const [activeIntegration, setActiveIntegration] = useState<IntegrationDef | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const toggleEnabled = useCallback((name: string) => {
    setEnabledMap((prev) => ({ ...prev, [name]: !prev[name] }));
  }, []);

  const openConfig = useCallback((integration: IntegrationDef) => {
    setActiveIntegration(integration);
  }, []);

  const handleSave = useCallback(
    (config: Record<string, unknown>) => {
      if (!activeIntegration) return;
      setConfigMap((prev) => ({
        ...prev,
        [activeIntegration.name]: config,
      }));
      setConfiguredSet((prev) => {
        const next = new Set(prev);
        next.add(activeIntegration.name);
        return next;
      });
      setActiveIntegration(null);
      setToast(`${activeIntegration.displayName} configuration saved`);
    },
    [activeIntegration]
  );

  const handleClosePanel = useCallback(() => {
    setActiveIntegration(null);
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Integrations</h1>
        <p className="text-zinc-400">
          Connect services to power your business. Enable and configure each
          integration below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {INTEGRATIONS.map((integration) => {
          const isEnabled = enabledMap[integration.name] ?? false;
          const isConfigured = configuredSet.has(integration.name);

          return (
            <div
              key={integration.name}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-4 transition-colors hover:border-zinc-700"
            >
              {/* Top row: icon + toggle */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isEnabled
                        ? "bg-blue-600/15 text-blue-400"
                        : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {getIntegrationIcon(integration.category)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-100">
                      {integration.displayName}
                    </h3>
                    <span
                      className={`inline-block text-[11px] px-2 py-0.5 rounded-full border mt-1 ${
                        categoryColors[integration.category] ||
                        "bg-zinc-800 text-zinc-400 border-zinc-700"
                      }`}
                    >
                      {integration.category}
                    </span>
                  </div>
                </div>

                {/* Toggle */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={isEnabled}
                  onClick={() => toggleEnabled(integration.name)}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                    isEnabled ? "bg-blue-600" : "bg-zinc-700"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Description */}
              <p className="text-sm text-zinc-500 leading-relaxed">
                {integration.description}
              </p>

              {/* Footer: status + configure */}
              <div className="flex items-center justify-between mt-auto pt-2">
                {/* Status */}
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isEnabled && isConfigured
                        ? "bg-emerald-500"
                        : isEnabled
                          ? "bg-amber-500"
                          : "bg-zinc-600"
                    }`}
                  />
                  <span className="text-xs text-zinc-500">
                    {isEnabled && isConfigured
                      ? "Connected"
                      : isEnabled
                        ? "Enabled — needs config"
                        : "Not configured"}
                  </span>
                </div>

                <button
                  onClick={() => openConfig(integration)}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-zinc-100 transition-colors"
                >
                  Configure
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Config Panel */}
      {activeIntegration && (
        <ConfigPanel
          integration={activeIntegration}
          config={configMap[activeIntegration.name] || {}}
          onSave={handleSave}
          onClose={handleClosePanel}
        />
      )}

      {/* Toast */}
      {toast && <SuccessToast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
