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
}

export default function ResultsPage() {
  const params = useParams();
  const shareId = params.shareId as string;
  const [audit, setAudit] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Analysing your AI spend...</p>
        </div>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Audit not found.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">

        {/* HERO SAVINGS */}
        <div className="text-center mb-12">
          <p className="text-gray-400 mb-2">Your AI Spend Audit</p>
          {audit.isOptimal ? (
            <>
              <h1 className="text-4xl font-bold text-green-400 mb-2">
                You're spending well ✓
              </h1>
              <p className="text-gray-400">
                No significant savings found. Your current setup looks optimised.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-5xl font-bold mb-2">
                You could save{' '}
                <span className="text-green-400">
                  ${audit.totalMonthlySavings}/mo
                </span>
              </h1>
              <p className="text-2xl text-gray-400">
                That's{' '}
                <span className="text-white font-semibold">
                  ${audit.totalAnnualSavings}/year
                </span>
              </p>
            </>
          )}
        </div>

        {/* CREDEX BANNER for high value */}
        {audit.isHighValue && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 mb-8 text-center">
            <p className="text-green-400 font-semibold text-lg mb-1">
              💡 You qualify for Credex credits
            </p>
            <p className="text-gray-400 text-sm mb-4">
              Credex sells discounted AI credits from companies that overforecast.
              With ${audit.totalMonthlySavings}/mo in savings opportunities,
              you could save even more.
            </p>
            <a
              href="https://credex.rocks"
              target="_blank"
              className="inline-block bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Book a Free Credex Consultation →
            </a>
          </div>
        )}

        {/* RECOMMENDATIONS */}
        <div className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Per-tool breakdown
          </h2>
          {audit.recommendations.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center text-gray-400">
              All tools are on optimal plans for your usage. ✓
            </div>
          ) : (
            audit.recommendations.map((rec, i) => (
              <div
                key={i}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-white">{rec.toolName}</h3>
                  {rec.savings > 0 && (
                    <span className="bg-green-500/20 text-green-400 text-sm px-3 py-1 rounded-full">
                      Save ${rec.savings}/mo
                    </span>
                  )}
                </div>
                <p className="text-green-400 text-sm font-medium mb-2">
                  → {rec.recommendedAction}
                </p>
                <p className="text-gray-400 text-sm">{rec.reason}</p>
              </div>
            ))
          )}
        </div>

        {/* SHARE */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-400 text-sm mb-3">
            Share this audit with your team
          </p>
          <div className="flex gap-2">
            <input
              readOnly
              value={`${window.location.origin}/results/${shareId}`}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/results/${shareId}`
                );
                alert('Link copied!');
              }}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <a href="/" className="text-gray-500 hover:text-gray-400 text-sm">
            ← Run another audit
          </a>
        </div>

      </div>
    </main>
  );
}