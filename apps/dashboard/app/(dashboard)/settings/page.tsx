"use client";

import { useState } from "react";

export default function SettingsPage() {
  /* Site Settings state */
  const [siteName, setSiteName] = useState("Velocity Demo");
  const [customDomain, setCustomDomain] = useState("");
  const [siteToast, setSiteToast] = useState<string | null>(null);

  /* Team Members state */
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"Admin" | "Editor">("Editor");
  const [members, setMembers] = useState<{ email: string; role: string }[]>([]);
  const [teamToast, setTeamToast] = useState<string | null>(null);

  /* Danger Zone state */
  const [exportToast, setExportToast] = useState<string | null>(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  function handleSiteSave() {
    setSiteToast("Settings saved successfully");
    setTimeout(() => setSiteToast(null), 3000);
  }

  function handleInvite() {
    if (!inviteEmail.trim() || !inviteEmail.includes("@")) return;
    setMembers((m) => [...m, { email: inviteEmail.trim(), role: inviteRole }]);
    setInviteEmail("");
    setShowInvite(false);
    setTeamToast("Invitation sent");
    setTimeout(() => setTeamToast(null), 3000);
  }

  function handleRemoveMember(email: string) {
    setMembers((m) => m.filter((x) => x.email !== email));
  }

  function handleExport() {
    setExportToast("Data export started. You will receive a download link via email.");
    setTimeout(() => setExportToast(null), 4000);
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-zinc-500 mt-1">Manage your site configuration and team.</p>
      </div>

      {/* Site Settings */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="font-semibold text-zinc-100 mb-5">Site Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Site Name</label>
            <input
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Template</label>
            <div className="w-full h-10 px-3 flex items-center bg-zinc-950/50 border border-zinc-800 rounded-lg text-zinc-500 text-sm">
              Velocity &mdash; Athletic / Sportswear
            </div>
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Custom Domain</label>
            <input
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="yourdomain.com"
              className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleSiteSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Save
            </button>
            {siteToast && (
              <span className="flex items-center gap-1.5 text-sm text-green-400">
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {siteToast}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-zinc-100">Team Members</h2>
          <button
            onClick={() => setShowInvite(!showInvite)}
            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            {showInvite ? "Cancel" : "+ Invite Member"}
          </button>
        </div>

        {/* Current user */}
        <div className="flex items-center gap-3 py-3 border-b border-zinc-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-white text-sm font-bold">
            Y
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-200">Yohanes</p>
            <p className="text-xs text-zinc-500">Owner</p>
          </div>
          <span className="text-[11px] text-zinc-600 bg-zinc-800 rounded px-2 py-0.5">You</span>
        </div>

        {/* Invited members */}
        {members.map((m) => (
          <div key={m.email} className="flex items-center gap-3 py-3 border-b border-zinc-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 text-sm font-bold">
              {m.email[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-200">{m.email}</p>
              <p className="text-xs text-zinc-500">{m.role}</p>
            </div>
            <button
              onClick={() => handleRemoveMember(m.email)}
              className="text-xs text-zinc-600 hover:text-red-400 transition-colors"
            >
              Remove
            </button>
          </div>
        ))}

        {members.length === 0 && (
          <p className="text-xs text-zinc-600 py-3">No team members yet.</p>
        )}

        {/* Invite form */}
        {showInvite && (
          <div className="mt-4 p-4 rounded-lg border border-zinc-800 bg-zinc-950/50 space-y-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Email</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="w-full h-9 px-3 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Role</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as "Admin" | "Editor")}
                className="w-full h-9 px-3 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow appearance-none"
              >
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
              </select>
            </div>
            <button
              onClick={handleInvite}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Send Invite
            </button>
          </div>
        )}

        {teamToast && (
          <div className="mt-3 flex items-center gap-1.5 text-sm text-green-400">
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            {teamToast}
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-500/30 bg-zinc-900/50 p-6">
        <h2 className="font-semibold text-red-400 mb-5">Danger Zone</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-200">Export Data</p>
              <p className="text-xs text-zinc-500">Download all site content and configuration.</p>
            </div>
            <button
              onClick={handleExport}
              className="px-4 py-2 text-sm font-medium text-zinc-300 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Export
            </button>
          </div>
          {exportToast && (
            <p className="text-xs text-green-400">{exportToast}</p>
          )}

          <div className="border-t border-zinc-800 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-200">Delete Site</p>
                <p className="text-xs text-zinc-500">Permanently remove this site and all its data.</p>
              </div>
              <button
                onClick={() => setShowDeleteWarning(!showDeleteWarning)}
                className="px-4 py-2 bg-red-900/50 border border-red-800 text-red-400 rounded-lg text-sm font-medium hover:bg-red-900 transition-colors"
              >
                Delete Site
              </button>
            </div>
            {showDeleteWarning && (
              <div className="mt-3 p-3 rounded-lg border border-red-500/30 bg-red-950/30">
                <p className="text-xs text-red-300">
                  This action is irreversible. All content, configuration, and deployment history for
                  <strong> Velocity Demo</strong> will be permanently deleted. Contact support if you need assistance.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
