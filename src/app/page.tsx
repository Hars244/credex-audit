'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const TOOLS = ['cursor', 'github_copilot', 'claude', 'chatgpt', 'gemini', 'windsurf'];

const TOOL_LABELS: Record<string, string> = {
  cursor: 'Cursor',
  github_copilot: 'GitHub Copilot',
  claude: 'Claude (Anthropic)',
  chatgpt: 'ChatGPT (OpenAI)',
  gemini: 'Gemini (Google)',
  windsurf: 'Windsurf',
};

const TOOL_COLORS: Record<string, string> = {
  cursor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  github_copilot: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  claude: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  chatgpt: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  gemini: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  windsurf: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
};

const PLANS: Record<string, string[]> = {
  cursor: ['hobby', 'pro', 'business', 'enterprise'],
  github_copilot: ['individual', 'business', 'enterprise'],
  claude: ['free', 'pro', 'max', 'team', 'enterprise'],
  chatgpt: ['free', 'plus', 'team', 'enterprise'],
  gemini: ['free', 'pro', 'ultra'],
  windsurf: ['free', 'pro', 'team'],
};

interface ToolEntry {
  name: string;
  plan: string;
  monthlySpend: number;
  seats: number;
}

const emptyTool = (): ToolEntry => ({
  name: 'cursor',
  plan: 'pro',
  monthlySpend: 20,
  seats: 1,
});

const STATS = [
  { value: '2,400+', label: 'Audits run' },
  { value: '$340', label: 'Avg monthly savings found' },
  { value: '4 min', label: 'Average audit time' },
];

export default function Home() {
  const router = useRouter();
  const [tools, setTools] = useState<ToolEntry[]>([emptyTool()]);
  const [teamSize, setTeamSize] = useState(3);
  const [useCase, setUseCase] = useState('coding');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('auditFormData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setTools(data.tools || [emptyTool()]);
        setTeamSize(data.teamSize || 3);
        setUseCase(data.useCase || 'coding');
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('auditFormData', JSON.stringify({ tools, teamSize, useCase }));
  }, [tools, teamSize, useCase]);

  const addTool = () => setTools([...tools, emptyTool()]);
  const removeTool = (i: number) => setTools(tools.filter((_, idx) => idx !== i));

  const updateTool = (index: number, field: keyof ToolEntry, value: string | number) => {
    const updated = [...tools];
    if (field === 'name') {
      updated[index] = { ...updated[index], name: value as string, plan: PLANS[value as string][0] };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setTools(updated);
  };

  const handleSubmit = async () => {
    setError('');
    const hasSpend = tools.some((t) => t.monthlySpend > 0);
    if (!hasSpend) {
      setError('Please enter your monthly spend for at least one tool.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tools, teamSize, useCase }),
      });
      const data = await res.json();
      if (data.shareId) {
        router.push(`/results/${data.shareId}`);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* HERO */}
      <div className="max-w-3xl mx-auto px-4 pt-16 pb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-1.5 rounded-full mb-8">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Free · No login · Results in 30 seconds
        </div>

        <h1 className="text-5xl font-bold mb-5 leading-tight tracking-tight">
          Are you overspending on{' '}
          <span className="text-green-400">AI tools?</span>
        </h1>

        <p className="text-gray-400 text-xl mb-10 max-w-xl mx-auto">
          Enter what you pay for AI subscriptions and get an instant breakdown
          of savings, better alternatives, and plan optimisations.
        </p>

        {/* STATS */}
        <div className="flex justify-center gap-8 mb-12">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FORM */}
      <div className="max-w-3xl mx-auto px-4 pb-24">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-gray-100 mb-1">
            Your AI tool stack
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Add each tool you pay for. Be as accurate as possible for best results.
          </p>

          <div className="space-y-3">
            {tools.map((tool, index) => (
              <div
                key={index}
                className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${TOOL_COLORS[tool.name]}`}>
                    {TOOL_LABELS[tool.name]}
                  </span>
                  {tools.length > 1 && (
                    <button
                      onClick={() => removeTool(index)}
                      className="text-gray-600 hover:text-red-400 text-xs transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Tool</label>
                    <select
                      value={tool.name}
                      onChange={(e) => updateTool(index, 'name', e.target.value)}
                      className="w-full bg-gray-700/80 border border-gray-600/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500/50"
                    >
                      {TOOLS.map((t) => (
                        <option key={t} value={t}>{TOOL_LABELS[t]}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Plan</label>
                    <select
                      value={tool.plan}
                      onChange={(e) => updateTool(index, 'plan', e.target.value)}
                      className="w-full bg-gray-700/80 border border-gray-600/50 rounded-lg px-3 py-2 text-sm text-white capitalize focus:outline-none focus:border-green-500/50"
                    >
                      {PLANS[tool.name].map((p) => (
                        <option key={p} value={p}>
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Seats / users</label>
                    <input
                      type="number"
                      min={1}
                      value={tool.seats}
                      onChange={(e) => updateTool(index, 'seats', parseInt(e.target.value) || 1)}
                      className="w-full bg-gray-700/80 border border-gray-600/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Monthly spend (USD)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input
                        type="number"
                        min={0}
                        value={tool.monthlySpend}
                        onChange={(e) => updateTool(index, 'monthlySpend', parseFloat(e.target.value) || 0)}
                        className="w-full bg-gray-700/80 border border-gray-600/50 rounded-lg pl-7 pr-3 py-2 text-sm text-white focus:outline-none focus:border-green-500/50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addTool}
            className="mt-3 w-full border border-dashed border-gray-700 hover:border-green-500/50 rounded-xl py-3 text-gray-500 hover:text-green-400 transition-all text-sm"
          >
            + Add another tool
          </button>

          {/* TEAM + USE CASE */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Team size</label>
              <input
                type="number"
                min={1}
                value={teamSize}
                onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500/50"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Primary use case</label>
              <select
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500/50"
              >
                <option value="coding">💻 Coding</option>
                <option value="writing">✍️ Writing</option>
                <option value="data">📊 Data Analysis</option>
                <option value="research">🔬 Research</option>
                <option value="mixed">🔀 Mixed</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-6 w-full bg-green-500 hover:bg-green-400 active:bg-green-600 disabled:bg-green-800 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl text-lg transition-all shadow-lg shadow-green-500/20"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Analysing your spend...
              </span>
            ) : (
              'Run My Free Audit →'
            )}
          </button>

          <p className="text-center text-gray-600 text-xs mt-3">
            No account needed · Results shown instantly · 100% free
          </p>
        </div>
      </div>
    </main>
  );
}