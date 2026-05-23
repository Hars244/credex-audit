'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Recommendation {
  toolName: string;
  currentSpend: number;
  recommendedAction: string;
  savings: number;
  reason: string;
}

interface AuditData {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  recommendations: Recommendation[];
  isOptimal: boolean;
  isHighValue: boolean;
  tools: { name: string; plan: string; monthlySpend: number; seats: number }[];
  useCase: string;
  teamSize: number;
  shareId: string;
}

const TOOL_LABELS: Record<string, string> = {
  cursor: 'Cursor',
  github_copilot: 'GitHub Copilot',
  claude: 'Claude',
  chatgpt: 'ChatGPT',
  gemini: 'Gemini',
  windsurf: 'Windsurf',
};

export default function ResultsPage() {
  const params = useParams();
  const shareId = params.shareId as string;
  const [audit, setAudit] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        const res = await fetch(`/api/audit/${shareId}`);
        const data = await res.json();
        setAudit(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAudit();
  }, [shareId]);

  const handleCopy = async () => {
  await navigator.clipboard.writeText(
    `${window.location.origin}/results/${shareId}`
  );

  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading your audit...</p>
        </div>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Audit not found.</p>
          <a href="/" className="text-green-400 hover:underline text-sm">
            Run a new audit →
          </a>
        </div>
      </div>
    );
  }

  const totalCurrentSpend = audit.tools.reduce((sum, t) => sum + t.monthlySpend, 0);
  const savingsPercent = totalCurrentSpend > 0
    ? Math.round((audit.totalMonthlySavings / totalCurrentSpend) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* HERO */}
        <div className="text-center mb-10">
          <p className="text-gray-500 text-sm mb-3 uppercase tracking-widest">
            Your AI Spend Audit
          </p>

          {audit.isOptimal ? (
            <div>
              <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h1 className="text-4xl font-bold text-green-400 mb-3">
                You're spending well
              </h1>
              <p className="text-gray-400 max-w-md mx-auto">
                No significant savings found. Your current AI tool setup looks
                well-optimised for your team size and use case.
              </p>
              <div className="mt-6 inline-block bg-gray-900 border border-gray-800 rounded-xl px-6 py-3 text-sm text-gray-400">
                Want to be notified when better deals appear?{' '}
                <a href="#notify" className="text-green-400 hover:underline">
                  Get alerts →
                </a>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-6xl font-bold mb-2 tracking-tight">
                <span className="text-green-400">${audit.totalMonthlySavings}</span>
                <span className="text-3xl text-gray-400 font-normal">/mo</span>
              </h1>
              <p className="text-gray-400 text-xl mb-1">
                potential monthly savings identified
              </p>
              <p className="text-2xl font-semibold text-white mb-4">
                ${audit.totalAnnualSavings.toLocaleString()} saved per year
              </p>

              {savingsPercent > 0 && (
                <div className="inline-block bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-1.5 rounded-full">
                  That's {savingsPercent}% of your current AI spend
                </div>
              )}
            </div>
          )}
        </div>

        {/* SUMMARY STATS */}
        {!audit.isOptimal && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">
                ${totalCurrentSpend}
              </div>
              <div className="text-xs text-gray-500 mt-1">Current monthly spend</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                ${totalCurrentSpend - audit.totalMonthlySavings}
              </div>
              <div className="text-xs text-gray-500 mt-1">Optimised spend</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {audit.tools.length}
              </div>
              <div className="text-xs text-gray-500 mt-1">Tools audited</div>
            </div>
          </div>
        )}

        {/* CREDEX HIGH VALUE BANNER */}
        {audit.isHighValue && (
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-500/30 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl">💡</span>
              </div>
              <div>
                <p className="font-semibold text-white mb-1">
                  You qualify for Credex credits
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  Credex sources discounted AI credits from companies that
                  overforecast. With ${audit.totalMonthlySavings}/mo in identified
                  savings, switching to Credex credits could save you even more on
                  top of these optimisations.
                </p>
                <a
                  href="https://credex.rocks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-500 hover:bg-green-400 text-black font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
                >
                  Book a Free Credex Consultation →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* RECOMMENDATIONS */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-100 mb-1">
            Per-tool breakdown
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Here is what we found for each tool in your stack.
          </p>

          {audit.recommendations.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
              <div className="text-4xl mb-3">✓</div>
              <p className="text-gray-300 font-medium mb-1">
                All tools are on optimal plans
              </p>
              <p className="text-gray-500 text-sm">
                Your current setup matches your team size and use case well.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {audit.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-white">{rec.toolName}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Current spend: ${rec.currentSpend}/mo
                      </p>
                    </div>
                    {rec.savings > 0 && (
                      <div className="text-right">
                        <span className="bg-green-500/15 text-green-400 text-sm font-semibold px-3 py-1 rounded-full border border-green-500/20">
                          Save ${rec.savings}/mo
                        </span>
                        <p className="text-xs text-gray-600 mt-1">
                          ${rec.savings * 12}/year
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-3 mb-2">
                    <p className="text-green-400 text-sm font-medium mb-1">
                      Recommended action
                    </p>
                    <p className="text-white text-sm">{rec.recommendedAction}</p>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed">
                    {rec.reason}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TOOLS USED */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Tools audited</h3>
          <div className="space-y-2">
            {audit.tools.map((tool, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-gray-300">
                  {TOOL_LABELS[tool.name] || tool.name} —{' '}
                  <span className="text-gray-500 capitalize">{tool.plan} plan</span>
                  {tool.seats > 1 && (
                    <span className="text-gray-600"> · {tool.seats} seats</span>
                  )}
                </span>
                <span className="text-gray-400">${tool.monthlySpend}/mo</span>
              </div>
            ))}
          </div>
        </div>

        {/* SHARE */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <p className="text-sm font-medium text-gray-300 mb-1">
            Share this audit
          </p>
          <p className="text-xs text-gray-500 mb-3">
            Your email and personal details are not included in the shared link.
          </p>
          <div className="flex gap-2">
            <input
              readOnly
              value={typeof window !== 'undefined'
                ? `${window.location.origin}/results/${shareId}`
                : ''}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-400 select-all"
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                copied
                  ? 'bg-green-500 text-black'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="text-center">
          <a
            href="/"
            className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
          >
            ← Run another audit
          </a>
        </div>

      </div>
    </main>
  );
}