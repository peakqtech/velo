"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchAPI } from "@/lib/api";

/* -------------------------------------------------------------------------- */
/*  Types                                                                       */
/* -------------------------------------------------------------------------- */

type Channel = "Blog" | "GBP" | "Social" | "Email";

interface Brief {
  name: string;
  goal: string;
  channels: Channel[];
  startDate: string;
  endDate: string;
  frequency: string;
}

interface Keyword {
  keyword: string;
  intent: string;
  volume?: number;
}

interface ContentPiece {
  title: string;
  channel: string;
  targetKeyword: string;
  scheduledFor: string;
  outline?: string;
}

interface ContentPlan {
  pieces: ContentPiece[];
}

/* -------------------------------------------------------------------------- */
/*  Constants                                                                   */
/* -------------------------------------------------------------------------- */

const CHANNELS: Channel[] = ["Blog", "GBP", "Social", "Email"];

const CHANNEL_COLORS: Record<Channel, string> = {
  Blog: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  GBP: "bg-green-500/20 text-green-300 border-green-500/30",
  Social: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Email: "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

const CHANNEL_DOT: Record<string, string> = {
  Blog: "bg-purple-400",
  GBP: "bg-green-400",
  Social: "bg-pink-400",
  Email: "bg-orange-400",
  BLOG: "bg-purple-400",
  SOCIAL: "bg-pink-400",
  EMAIL: "bg-orange-400",
};

const INTENT_COLORS: Record<string, string> = {
  informational: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  navigational: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  transactional: "bg-green-500/20 text-green-300 border-green-500/30",
  commercial: "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

const FREQUENCIES = [
  { value: "daily", label: "Daily" },
  { value: "2x/week", label: "2x / Week" },
  { value: "3x/week", label: "3x / Week" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Biweekly" },
  { value: "monthly", label: "Monthly" },
];

/* -------------------------------------------------------------------------- */
/*  Step Indicator                                                              */
/* -------------------------------------------------------------------------- */

function StepIndicator({ current }: { current: number }) {
  const steps = [
    { n: 1, label: "Brief" },
    { n: 2, label: "Keywords" },
    { n: 3, label: "Content Plan" },
  ];

  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((step, i) => (
        <div key={step.n} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border transition-all ${
                current === step.n
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : current > step.n
                  ? "bg-blue-600/20 border-blue-600/40 text-blue-400"
                  : "bg-zinc-800 border-zinc-700 text-zinc-500"
              }`}
            >
              {current > step.n ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                step.n
              )}
            </div>
            <span
              className={`text-xs font-medium ${
                current === step.n ? "text-zinc-200" : "text-zinc-500"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`h-px w-16 mx-3 mb-5 transition-all ${
                current > step.n ? "bg-blue-600/40" : "bg-zinc-700"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Step 1 — Brief                                                             */
/* -------------------------------------------------------------------------- */

function StepBrief({
  brief,
  onChange,
  onNext,
}: {
  brief: Brief;
  onChange: (b: Brief) => void;
  onNext: () => void;
}) {
  const [errors, setErrors] = useState<string[]>([]);

  const validate = () => {
    const errs: string[] = [];
    if (!brief.name.trim()) errs.push("Campaign name is required.");
    if (brief.channels.length === 0) errs.push("Select at least one channel.");
    setErrors(errs);
    return errs.length === 0;
  };

  const toggleChannel = (ch: Channel) => {
    const next = brief.channels.includes(ch)
      ? brief.channels.filter((c) => c !== ch)
      : [...brief.channels, ch];
    onChange({ ...brief, channels: next });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-100 mb-1">Campaign Brief</h2>
        <p className="text-sm text-zinc-500">Define your campaign goals and schedule.</p>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 space-y-1">
          {errors.map((e) => (
            <p key={e} className="text-sm text-red-400">{e}</p>
          ))}
        </div>
      )}

      {/* Campaign Name */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1.5">
          Campaign Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={brief.name}
          onChange={(e) => onChange({ ...brief, name: e.target.value })}
          placeholder="e.g. Q2 Local SEO Push"
          className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
        />
      </div>

      {/* Goal */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1.5">Goal</label>
        <textarea
          value={brief.goal}
          onChange={(e) => onChange({ ...brief, goal: e.target.value })}
          placeholder="Describe the campaign goal (e.g. increase organic traffic for local searches by 30%)"
          rows={3}
          className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
        />
      </div>

      {/* Channels */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Channels <span className="text-red-400">*</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {CHANNELS.map((ch) => {
            const selected = brief.channels.includes(ch);
            return (
              <button
                key={ch}
                type="button"
                onClick={() => toggleChannel(ch)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  selected
                    ? CHANNEL_COLORS[ch]
                    : "bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    selected ? CHANNEL_DOT[ch] : "bg-zinc-600"
                  }`}
                />
                {ch}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Start Date</label>
          <input
            type="date"
            value={brief.startDate}
            onChange={(e) => onChange({ ...brief, startDate: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all [color-scheme:dark]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">End Date</label>
          <input
            type="date"
            value={brief.endDate}
            onChange={(e) => onChange({ ...brief, endDate: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all [color-scheme:dark]"
          />
        </div>
      </div>

      {/* Frequency */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1.5">Frequency</label>
        <select
          value={brief.frequency}
          onChange={(e) => onChange({ ...brief, frequency: e.target.value })}
          className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
        >
          {FREQUENCIES.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* Action */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => validate() && onNext()}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-600/20"
        >
          Next — Select Keywords
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Step 2 — Keywords                                                          */
/* -------------------------------------------------------------------------- */

function StepKeywords({
  siteId,
  selectedKeywords,
  onSelect,
  onBack,
  onNext,
}: {
  siteId: string;
  selectedKeywords: string[];
  onSelect: (kws: string[]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<Keyword[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchAPI<{ keywords: Keyword[] } | Keyword[]>(
      `/api/sites/${siteId}/seo/keywords?location=local`
    )
      .then((data) => {
        const list = Array.isArray(data) ? data : (data as { keywords: Keyword[] }).keywords ?? [];
        setSuggestions(list);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [siteId]);

  const toggle = (kw: string) => {
    onSelect(
      selectedKeywords.includes(kw)
        ? selectedKeywords.filter((k) => k !== kw)
        : [...selectedKeywords, kw]
    );
  };

  const addManual = () => {
    const kw = manualInput.trim();
    if (!kw) return;
    if (!selectedKeywords.includes(kw)) onSelect([...selectedKeywords, kw]);
    if (!suggestions.find((s) => s.keyword === kw)) {
      setSuggestions((prev) => [{ keyword: kw, intent: "manual" }, ...prev]);
    }
    setManualInput("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-100 mb-1">Keyword Selection</h2>
        <p className="text-sm text-zinc-500">
          Choose keywords to target in this campaign.{" "}
          <span className="text-zinc-400 font-medium">{selectedKeywords.length} selected</span>
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <p className="text-sm text-zinc-500">Fetching keyword suggestions...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
          <p className="text-xs text-zinc-500 mt-1">You can still add keywords manually below.</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {suggestions.length === 0 && (
            <p className="text-sm text-zinc-500 text-center py-8">
              No suggestions found. Add keywords manually below.
            </p>
          )}
          {suggestions.map((s) => {
            const selected = selectedKeywords.includes(s.keyword);
            const intentClass =
              INTENT_COLORS[s.intent.toLowerCase()] ??
              "bg-zinc-700/40 text-zinc-400 border-zinc-600/40";
            return (
              <label
                key={s.keyword}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                  selected
                    ? "bg-blue-600/10 border-blue-500/40"
                    : "bg-zinc-800/50 border-zinc-700/60 hover:border-zinc-600"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggle(s.keyword)}
                  className="w-4 h-4 rounded border-zinc-600 bg-zinc-700 accent-blue-500"
                />
                <span className="flex-1 text-sm text-zinc-200">{s.keyword}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${intentClass}`}
                >
                  {s.intent}
                </span>
                {s.volume !== undefined && (
                  <span className="text-xs text-zinc-500">{s.volume.toLocaleString()}/mo</span>
                )}
              </label>
            );
          })}
        </div>
      )}

      {/* Manual input */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1.5">Add Keyword Manually</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addManual()}
            placeholder="Type a keyword and press Enter"
            className="flex-1 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          />
          <button
            onClick={addManual}
            className="px-4 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-sm font-medium rounded-lg transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition-colors border border-zinc-700"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={selectedKeywords.length === 0}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next — Generate Plan
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Step 3 — Content Plan                                                     */
/* -------------------------------------------------------------------------- */

function StepContentPlan({
  siteId,
  brief,
  selectedKeywords,
  onBack,
  onDone,
}: {
  siteId: string;
  brief: Brief;
  selectedKeywords: string[];
  onBack: () => void;
  onDone: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [plan, setPlan] = useState<ContentPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createDraftAndGenerate = async () => {
    setLoading(true);
    setError(null);
    setPlan(null);
    try {
      // Step A: Create DRAFT campaign
      const draft = await fetchAPI<{ id: string }>(`/api/sites/${siteId}/seo/campaigns`, {
        method: "POST",
        body: JSON.stringify({
          name: brief.name,
          goal: brief.goal,
          channels: brief.channels.map((c) => c.toUpperCase()),
          schedule: {
            startDate: brief.startDate,
            endDate: brief.endDate,
            frequency: brief.frequency.toUpperCase().replace("/", "_PER_"),
          },
          keywordTargets: selectedKeywords,
          totalPieces: 0,
        }),
      });
      setCampaignId(draft.id);

      // Step B: Generate plan
      const generated = await fetchAPI<ContentPlan>(
        `/api/sites/${siteId}/seo/campaigns/${draft.id}/generate-plan`,
        {
          method: "POST",
          body: JSON.stringify({
            keywords: selectedKeywords,
            vertical: "",
            location: "local",
          }),
        }
      );
      setPlan(generated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    createDraftAndGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const approvePlan = async () => {
    if (!plan || !campaignId) return;
    setApproving(true);
    try {
      await fetchAPI(`/api/sites/${siteId}/seo/campaigns`, {
        method: "POST",
        body: JSON.stringify({
          name: brief.name,
          goal: brief.goal,
          channels: brief.channels.map((c) => c.toUpperCase()),
          schedule: {
            startDate: brief.startDate,
            endDate: brief.endDate,
            frequency: brief.frequency.toUpperCase().replace("/", "_PER_"),
          },
          keywordTargets: selectedKeywords,
          approvedPlan: { pieces: plan.pieces },
        }),
      });
      onDone();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setApproving(false);
    }
  };

  const channelDotClass = (ch: string) =>
    CHANNEL_DOT[ch] ?? CHANNEL_DOT[ch.toUpperCase()] ?? "bg-zinc-400";

  const channelBadgeClass = (ch: string) => {
    const map: Record<string, string> = {
      BLOG: CHANNEL_COLORS.Blog,
      Blog: CHANNEL_COLORS.Blog,
      GBP: CHANNEL_COLORS.GBP,
      SOCIAL: CHANNEL_COLORS.Social,
      Social: CHANNEL_COLORS.Social,
      EMAIL: CHANNEL_COLORS.Email,
      Email: CHANNEL_COLORS.Email,
    };
    return map[ch] ?? "bg-zinc-700/40 text-zinc-400 border-zinc-600/40";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-100 mb-1">Content Plan</h2>
        <p className="text-sm text-zinc-500">
          AI-generated content schedule based on your brief and selected keywords.
        </p>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <div className="text-center">
            <p className="text-sm text-zinc-300 font-medium">Generating content plan...</p>
            <p className="text-xs text-zinc-500 mt-1">
              Claude is crafting a tailored content schedule for your campaign.
            </p>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-4">
          <p className="text-sm text-red-400 font-medium mb-1">Failed to generate plan</p>
          <p className="text-xs text-zinc-400">{error}</p>
        </div>
      )}

      {plan && !loading && (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {plan.pieces.map((piece, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-4 py-3 bg-zinc-800/60 border border-zinc-700/60 rounded-lg"
            >
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${channelDotClass(piece.channel)}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-100 leading-snug">{piece.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5 truncate">{piece.targetKeyword}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border font-medium ${channelBadgeClass(piece.channel)}`}
                >
                  {piece.channel}
                </span>
                {piece.scheduledFor && (
                  <span className="text-xs text-zinc-500">
                    {new Date(piece.scheduledFor).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          disabled={loading || approving}
          className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition-colors border border-zinc-700 disabled:opacity-40"
        >
          Back
        </button>
        <div className="flex items-center gap-3">
          {(error || plan) && !loading && (
            <button
              onClick={createDraftAndGenerate}
              disabled={loading || approving}
              className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition-colors border border-zinc-700 disabled:opacity-40"
            >
              Regenerate
            </button>
          )}
          <button
            onClick={approvePlan}
            disabled={!plan || loading || approving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {approving ? "Approving..." : "Approve Plan"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Page                                                                  */
/* -------------------------------------------------------------------------- */

export default function NewCampaignPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.clientId as string;
  const siteId = params.siteId as string;

  const [step, setStep] = useState(1);
  const [brief, setBrief] = useState<Brief>({
    name: "",
    goal: "",
    channels: [],
    startDate: "",
    endDate: "",
    frequency: "weekly",
  });
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  const handleDone = () => {
    router.push(`/clients/${clientId}/sites/${siteId}/seo`);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
        <Link href="/" className="hover:text-zinc-300 transition-colors">
          Clients
        </Link>
        <span>/</span>
        <Link href={`/clients/${clientId}`} className="hover:text-zinc-300 transition-colors">
          Client
        </Link>
        <span>/</span>
        <Link
          href={`/clients/${clientId}/sites/${siteId}/seo`}
          className="hover:text-zinc-300 transition-colors"
        >
          SEO
        </Link>
        <span>/</span>
        <span className="text-zinc-300">New Campaign</span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">New Campaign</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Create an AI-powered content campaign in three steps.
        </p>
      </div>

      {/* Step indicator */}
      <StepIndicator current={step} />

      {/* Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        {step === 1 && (
          <StepBrief
            brief={brief}
            onChange={setBrief}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <StepKeywords
            siteId={siteId}
            selectedKeywords={selectedKeywords}
            onSelect={setSelectedKeywords}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <StepContentPlan
            siteId={siteId}
            brief={brief}
            selectedKeywords={selectedKeywords}
            onBack={() => setStep(2)}
            onDone={handleDone}
          />
        )}
      </div>
    </div>
  );
}
