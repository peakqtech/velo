"use client";

import React, { useState, useEffect } from "react";

interface Integration {
  name: string;
  displayName: string;
  category: string;
}

interface ConfigPanelProps {
  integration: Integration | null;
  config: Record<string, unknown>;
  onSave: (config: Record<string, unknown>) => void;
  onClose: () => void;
}

const inputClass =
  "bg-zinc-900 border border-zinc-800 rounded-lg h-10 px-3 text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none w-full";
const selectClass =
  "bg-zinc-900 border border-zinc-800 rounded-lg h-10 px-3 text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none w-full appearance-none";
const labelClass = "block text-sm font-medium text-zinc-300 mb-1.5";

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-blue-600" : "bg-zinc-700"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function PaymentsForm({
  config,
  onChange,
}: {
  config: Record<string, unknown>;
  onChange: (c: Record<string, unknown>) => void;
}) {
  const provider = (config.provider as string) || "stripe";

  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>Payment Provider</label>
        <select
          className={selectClass}
          value={provider}
          onChange={(e) => onChange({ ...config, provider: e.target.value })}
        >
          <option value="stripe">Stripe</option>
          <option value="xendit">Xendit</option>
          <option value="durianpay">Durianpay</option>
          <option value="midtrans">Midtrans</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Currency</label>
        <select
          className={selectClass}
          value={(config.currency as string) || "USD"}
          onChange={(e) => onChange({ ...config, currency: e.target.value })}
        >
          {["USD", "IDR", "SGD", "MYR", "PHP", "THB"].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {provider === "stripe" && (
        <>
          <div>
            <label className={labelClass}>Publishable Key</label>
            <input
              type="password"
              className={inputClass}
              placeholder="pk_..."
              value={
                ((config.stripe as Record<string, string>)?.publishableKey as string) || ""
              }
              onChange={(e) =>
                onChange({
                  ...config,
                  stripe: {
                    ...((config.stripe as Record<string, string>) || {}),
                    publishableKey: e.target.value,
                  },
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Secret Key</label>
            <input
              type="password"
              className={inputClass}
              placeholder="sk_..."
              value={
                ((config.stripe as Record<string, string>)?.secretKey as string) || ""
              }
              onChange={(e) =>
                onChange({
                  ...config,
                  stripe: {
                    ...((config.stripe as Record<string, string>) || {}),
                    secretKey: e.target.value,
                  },
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Webhook Secret</label>
            <input
              type="password"
              className={inputClass}
              placeholder="whsec_..."
              value={
                ((config.stripe as Record<string, string>)?.webhookSecret as string) || ""
              }
              onChange={(e) =>
                onChange({
                  ...config,
                  stripe: {
                    ...((config.stripe as Record<string, string>) || {}),
                    webhookSecret: e.target.value,
                  },
                })
              }
            />
          </div>
        </>
      )}

      {provider === "xendit" && (
        <>
          <div>
            <label className={labelClass}>Public Key</label>
            <input
              type="password"
              className={inputClass}
              placeholder="xnd_public_..."
              value={
                ((config.xendit as Record<string, string>)?.publicKey as string) || ""
              }
              onChange={(e) =>
                onChange({
                  ...config,
                  xendit: {
                    ...((config.xendit as Record<string, string>) || {}),
                    publicKey: e.target.value,
                  },
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Secret Key</label>
            <input
              type="password"
              className={inputClass}
              placeholder="xnd_..."
              value={
                ((config.xendit as Record<string, string>)?.secretKey as string) || ""
              }
              onChange={(e) =>
                onChange({
                  ...config,
                  xendit: {
                    ...((config.xendit as Record<string, string>) || {}),
                    secretKey: e.target.value,
                  },
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Webhook Token</label>
            <input
              type="password"
              className={inputClass}
              placeholder="Webhook verification token"
              value={
                ((config.xendit as Record<string, string>)?.webhookToken as string) || ""
              }
              onChange={(e) =>
                onChange({
                  ...config,
                  xendit: {
                    ...((config.xendit as Record<string, string>) || {}),
                    webhookToken: e.target.value,
                  },
                })
              }
            />
          </div>
        </>
      )}

      {provider === "durianpay" && (
        <>
          <div>
            <label className={labelClass}>Access Key</label>
            <input
              type="password"
              className={inputClass}
              placeholder="Access key"
              value={
                ((config.durianpay as Record<string, string>)?.accessKey as string) || ""
              }
              onChange={(e) =>
                onChange({
                  ...config,
                  durianpay: {
                    ...((config.durianpay as Record<string, string>) || {}),
                    accessKey: e.target.value,
                  },
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Secret Key</label>
            <input
              type="password"
              className={inputClass}
              placeholder="Secret key"
              value={
                ((config.durianpay as Record<string, string>)?.secretKey as string) || ""
              }
              onChange={(e) =>
                onChange({
                  ...config,
                  durianpay: {
                    ...((config.durianpay as Record<string, string>) || {}),
                    secretKey: e.target.value,
                  },
                })
              }
            />
          </div>
        </>
      )}

      {provider === "midtrans" && (
        <>
          <div>
            <label className={labelClass}>Client Key</label>
            <input
              type="password"
              className={inputClass}
              placeholder="Client key"
              value={
                ((config.midtrans as Record<string, string>)?.clientKey as string) || ""
              }
              onChange={(e) =>
                onChange({
                  ...config,
                  midtrans: {
                    ...((config.midtrans as Record<string, string>) || {}),
                    clientKey: e.target.value,
                  },
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Server Key</label>
            <input
              type="password"
              className={inputClass}
              placeholder="Server key"
              value={
                ((config.midtrans as Record<string, string>)?.serverKey as string) || ""
              }
              onChange={(e) =>
                onChange({
                  ...config,
                  midtrans: {
                    ...((config.midtrans as Record<string, string>) || {}),
                    serverKey: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <label className={labelClass}>Production Mode</label>
            <Toggle
              checked={
                ((config.midtrans as Record<string, unknown>)?.isProduction as boolean) ||
                false
              }
              onChange={(v) =>
                onChange({
                  ...config,
                  midtrans: {
                    ...((config.midtrans as Record<string, unknown>) || {}),
                    isProduction: v,
                  },
                })
              }
            />
          </div>
        </>
      )}
    </div>
  );
}

function FormsForm({
  config,
  onChange,
}: {
  config: Record<string, unknown>;
  onChange: (c: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>Notification Email</label>
        <input
          type="email"
          className={inputClass}
          placeholder="you@example.com"
          value={(config.notificationEmail as string) || ""}
          onChange={(e) =>
            onChange({ ...config, notificationEmail: e.target.value })
          }
        />
        <p className="text-xs text-zinc-500 mt-1">
          Receive form submissions at this email address
        </p>
      </div>

      <div>
        <label className={labelClass}>Success Message</label>
        <input
          type="text"
          className={inputClass}
          placeholder="Thank you! We'll be in touch."
          value={(config.submitSuccessMessage as string) || ""}
          onChange={(e) =>
            onChange({ ...config, submitSuccessMessage: e.target.value })
          }
        />
      </div>

      <div>
        <label className={labelClass}>Honeypot Field Name</label>
        <input
          type="text"
          className={inputClass}
          placeholder="_hp"
          value={(config.honeypotField as string) || ""}
          onChange={(e) =>
            onChange({ ...config, honeypotField: e.target.value })
          }
        />
        <p className="text-xs text-zinc-500 mt-1">
          Hidden spam-trap field name (bots fill this in, humans don&apos;t)
        </p>
      </div>

      <div>
        <label className={labelClass}>reCAPTCHA Site Key</label>
        <input
          type="password"
          className={inputClass}
          placeholder="Optional reCAPTCHA key"
          value={(config.recaptchaSiteKey as string) || ""}
          onChange={(e) =>
            onChange({ ...config, recaptchaSiteKey: e.target.value })
          }
        />
      </div>
    </div>
  );
}

function AnalyticsForm({
  config,
  onChange,
}: {
  config: Record<string, unknown>;
  onChange: (c: Record<string, unknown>) => void;
}) {
  const provider = (config.provider as string) || "plausible";

  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>Analytics Provider</label>
        <select
          className={selectClass}
          value={provider}
          onChange={(e) => onChange({ ...config, provider: e.target.value })}
        >
          <option value="plausible">Plausible (Privacy-friendly)</option>
          <option value="ga4">Google Analytics 4</option>
        </select>
      </div>

      {provider === "plausible" && (
        <>
          <div>
            <label className={labelClass}>Domain</label>
            <input
              type="text"
              className={inputClass}
              placeholder="example.com"
              value={(config.plausibleDomain as string) || ""}
              onChange={(e) =>
                onChange({ ...config, plausibleDomain: e.target.value })
              }
            />
          </div>
          <div>
            <label className={labelClass}>API Host</label>
            <input
              type="text"
              className={inputClass}
              placeholder="https://plausible.io"
              value={(config.plausibleApiHost as string) || "https://plausible.io"}
              onChange={(e) =>
                onChange({ ...config, plausibleApiHost: e.target.value })
              }
            />
            <p className="text-xs text-zinc-500 mt-1">
              Use default or your self-hosted Plausible URL
            </p>
          </div>
        </>
      )}

      {provider === "ga4" && (
        <div>
          <label className={labelClass}>Measurement ID</label>
          <input
            type="text"
            className={inputClass}
            placeholder="G-XXXXXXXXXX"
            value={(config.ga4MeasurementId as string) || ""}
            onChange={(e) =>
              onChange({ ...config, ga4MeasurementId: e.target.value })
            }
          />
        </div>
      )}
    </div>
  );
}

function WhatsAppForm({
  config,
  onChange,
}: {
  config: Record<string, unknown>;
  onChange: (c: Record<string, unknown>) => void;
}) {
  const businessHours = (config.businessHours as Record<string, unknown>) || {};

  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>Phone Number</label>
        <input
          type="text"
          className={inputClass}
          placeholder="+6281234567890"
          value={(config.phoneNumber as string) || ""}
          onChange={(e) =>
            onChange({ ...config, phoneNumber: e.target.value })
          }
        />
        <p className="text-xs text-zinc-500 mt-1">
          Include country code (e.g., +62 for Indonesia)
        </p>
      </div>

      <div>
        <label className={labelClass}>Default Message</label>
        <input
          type="text"
          className={inputClass}
          placeholder="Hello! I'm interested in your services."
          value={(config.defaultMessage as string) || ""}
          onChange={(e) =>
            onChange({ ...config, defaultMessage: e.target.value })
          }
        />
      </div>

      <div>
        <label className={labelClass}>Widget Position</label>
        <select
          className={selectClass}
          value={(config.position as string) || "bottom-right"}
          onChange={(e) => onChange({ ...config, position: e.target.value })}
        >
          <option value="bottom-right">Bottom Right</option>
          <option value="bottom-left">Bottom Left</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className={labelClass}>Show on Mobile</span>
          <p className="text-xs text-zinc-500">Display widget on mobile devices</p>
        </div>
        <Toggle
          checked={(config.showOnMobile as boolean) ?? true}
          onChange={(v) => onChange({ ...config, showOnMobile: v })}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className={labelClass}>Business Hours</span>
          <p className="text-xs text-zinc-500">
            Show offline message outside work hours
          </p>
        </div>
        <Toggle
          checked={(businessHours.enabled as boolean) || false}
          onChange={(v) =>
            onChange({
              ...config,
              businessHours: { ...businessHours, enabled: v },
            })
          }
        />
      </div>

      <div>
        <label className={labelClass}>Offline Message</label>
        <input
          type="text"
          className={inputClass}
          placeholder="We're currently offline. Leave us a message!"
          value={(config.offlineMessage as string) || ""}
          onChange={(e) =>
            onChange({ ...config, offlineMessage: e.target.value })
          }
        />
      </div>
    </div>
  );
}

function CmsForm({
  config,
  onChange,
}: {
  config: Record<string, unknown>;
  onChange: (c: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <span className={labelClass}>Allow Media Upload</span>
          <p className="text-xs text-zinc-500">
            Let editors upload images and files
          </p>
        </div>
        <Toggle
          checked={(config.allowMediaUpload as boolean) ?? true}
          onChange={(v) => onChange({ ...config, allowMediaUpload: v })}
        />
      </div>

      <div>
        <label className={labelClass}>Max File Size (MB)</label>
        <input
          type="number"
          className={inputClass}
          min={1}
          max={100}
          value={(config.maxMediaSizeMb as number) || 10}
          onChange={(e) =>
            onChange({ ...config, maxMediaSizeMb: Number(e.target.value) })
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className={labelClass}>Auto-save</span>
          <p className="text-xs text-zinc-500">
            Automatically save content changes
          </p>
        </div>
        <Toggle
          checked={(config.autoSave as boolean) || false}
          onChange={(v) => onChange({ ...config, autoSave: v })}
        />
      </div>

      {(config.autoSave as boolean) && (
        <div>
          <label className={labelClass}>Auto-save Interval (seconds)</label>
          <input
            type="number"
            className={inputClass}
            min={5}
            max={300}
            value={((config.autoSaveIntervalMs as number) || 30000) / 1000}
            onChange={(e) =>
              onChange({
                ...config,
                autoSaveIntervalMs: Number(e.target.value) * 1000,
              })
            }
          />
        </div>
      )}
    </div>
  );
}

const formComponents: Record<
  string,
  React.FC<{
    config: Record<string, unknown>;
    onChange: (c: Record<string, unknown>) => void;
  }>
> = {
  payments: PaymentsForm,
  forms: FormsForm,
  analytics: AnalyticsForm,
  whatsapp: WhatsAppForm,
  cms: CmsForm,
};

export default function ConfigPanel({
  integration,
  config,
  onSave,
  onClose,
}: ConfigPanelProps) {
  const [localConfig, setLocalConfig] = useState<Record<string, unknown>>(config);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  if (!integration) return null;

  const FormComponent = formComponents[integration.name];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-zinc-900 border-l border-zinc-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">
              {integration.displayName}
            </h2>
            <p className="text-sm text-zinc-500 mt-0.5">Configuration</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 transition-colors p-1 rounded-lg hover:bg-zinc-800"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {FormComponent ? (
            <FormComponent config={localConfig} onChange={setLocalConfig} />
          ) : (
            <p className="text-zinc-400 text-sm">
              No configuration available for this integration.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 flex items-center gap-3">
          <button
            onClick={() => onSave(localConfig)}
            className="flex-1 h-10 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="h-10 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
