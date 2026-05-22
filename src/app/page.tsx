'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const TOOLS = [
  'cursor',
  'github_copilot',
  'claude',
  'chatgpt',
  'gemini',
  'windsurf',
];

const TOOL_LABELS: Record<string, string> = {
  cursor: 'Cursor',
  github_copilot: 'GitHub Copilot',
  claude: 'Claude (Anthropic)',
  chatgpt: 'ChatGPT (OpenAI)',
  gemini: 'Gemini (Google)',
  windsurf: 'Windsurf',
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
  monthlySpend: 0,
  seats: 1,
});

export default function Home() {
  const router = useRouter();
  const [tools, setTools] = useState<ToolEntry[]>([emptyTool()]);
  const [teamSize, setTeamSize] = useState(1);
  const [useCase, setUseCase] = useState('coding');
  const [loading, setLoading] = useState(false);

  // Load saved form data from localStorage on page load
  useEffect(() => {
    const saved = localStorage.getItem('auditFormData');
    if (saved) {
      const data = JSON.parse(saved);
      setTools(data.tools || [emptyTool()]);
      setTeamSize(data.teamSize || 1);
      setUseCase(data.useCase || 'coding');
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      'auditFormData',
      JSON.stringify({ tools, teamSize, useCase })
    );
  }, [tools, teamSize, useCase]);

  const addTool = () => setTools([...tools, emptyTool()]);

  const removeTool = (index: number) =>
    setTools(tools.filter((_, i) => i !== index));

  const updateTool = (index: number, field: keyof ToolEntry, value: string | number) => {
    const updated = [...tools];
    if (field === 'name') {
      updated[index] = {
        ...updated[index],
        name: value as string,
        plan: PLANS[value as string][0],
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setTools(updated);
  };

  const handleSubmit = async () => {
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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* HERO SECTION */}
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="inline-block bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-1 rounded-full mb-6">
          Free Tool · No login required
        </div>
        <h1 className="text-5xl font-bold mb-4 leading-tight">
          Are you overspending on <span className="text-green-400">AI tools?</span>
        </h1>
        <p className="text-gray-400 text-xl mb-4">
          Get a free instant audit of your AI subscriptions. See exactly where you're wasting money and how much you could save.
        </p>
        <p className="text-gray-500 text-sm">
          Takes 2 minutes · Powered by real pricing data · No fluff
        </p>
      </div>

      {/* FORM SECTION */}
      <div className="max-w-3xl mx-auto px-4 pb-24">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-100">
            Which AI tools do you pay for?
          </h2>

          <div className="space-y-4">
            {tools.map((tool, index) => (
              <div
                key={index}
                className="bg-gray-800 border border-gray-700 rounded-xl p-4"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-400 font-medium">
                    Tool {index + 1}
                  </span>
                  {tools.length > 1 && (
                    <button
                      onClick={() => removeTool(index)}
                      className="text-red-400 text-sm hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Tool Name */}
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Tool</label>
                    <select
                      value={tool.name}
                      onChange={(e) => updateTool(index, 'name', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white"
                    >
                      {TOOLS.map((t) => (
                        <option key={t} value={t}>
                          {TOOL_LABELS[t]}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Plan */}
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Plan</label>
                    <select
                      value={tool.plan}
                      onChange={(e) => updateTool(index, 'plan', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white capitalize"
                    >
                      {PLANS[tool.name].map((p) => (
                        <option key={p} value={p} className="capitalize">
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Seats */}
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Number of seats
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={tool.seats}
                      onChange={(e) =>
                        updateTool(index, 'seats', parseInt(e.target.value) || 1)
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white"
                    />
                  </div>

                  {/* Monthly Spend */}
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Monthly spend ($)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={tool.monthlySpend}
                      onChange={(e) =>
                        updateTool(index, 'monthlySpend', parseFloat(e.target.value) || 0)
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Tool Button */}
          <button
            onClick={addTool}
            className="mt-4 w-full border border-dashed border-gray-600 rounded-xl py-3 text-gray-400 hover:border-green-500 hover:text-green-400 transition-colors text-sm"
          >
            + Add another tool
          </button>

          {/* Team Size + Use Case */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Team size</label>
              <input
                type="number"
                min={1}
                value={teamSize}
                onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Primary use case</label>
              <select
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="coding">Coding</option>
                <option value="writing">Writing</option>
                <option value="data">Data Analysis</option>
                <option value="research">Research</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-8 w-full bg-green-500 hover:bg-green-400 disabled:bg-green-800 disabled:cursor-not-allowed text-black font-semibold py-4 rounded-xl text-lg transition-colors"
          >
            {loading ? 'Analysing your spend...' : 'Run My Free Audit →'}
          </button>

          <p className="text-center text-gray-500 text-xs mt-3">
            No account needed. Results shown instantly.
          </p>
        </div>
      </div>
    </main>
  );
}