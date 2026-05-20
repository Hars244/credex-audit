import { PRICING } from './pricingData';

export interface ToolInput {
  name: string;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditRecommendation {
  toolName: string;
  currentSpend: number;
  recommendedAction: string;
  savings: number;
  reason: string;
}

export interface AuditResult {
  recommendations: AuditRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  isOptimal: boolean;
  isHighValue: boolean;
}

export function runAudit(tools: ToolInput[], teamSize: number, useCase: string): AuditResult {
  const recommendations: AuditRecommendation[] = [];

  for (const tool of tools) {
    const rec = evaluateTool(tool, teamSize, useCase);
    if (rec) recommendations.push(rec);
  }

  const totalMonthlySavings = recommendations.reduce((sum, r) => sum + r.savings, 0);
  const totalAnnualSavings = totalMonthlySavings * 12;

  return {
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings,
    isOptimal: totalMonthlySavings === 0,
    isHighValue: totalMonthlySavings > 500,
  };
}

function evaluateTool(tool: ToolInput, teamSize: number, useCase: string): AuditRecommendation | null {
  const { name, plan, monthlySpend, seats } = tool;

  // --- CURSOR ---
  if (name === 'cursor') {
    if (plan === 'business' && seats <= 3) {
      const savings = (PRICING.cursor.business.price - PRICING.cursor.pro.price) * seats;
      return {
        toolName: 'Cursor',
        currentSpend: monthlySpend,
        recommendedAction: `Downgrade from Business to Pro plan`,
        savings,
        reason: `With only ${seats} seats, Business plan ($40/seat) is overkill. Pro ($20/seat) covers all core features for small teams.`,
      };
    }
    if (plan === 'pro' && useCase === 'writing') {
      return {
        toolName: 'Cursor',
        currentSpend: monthlySpend,
        recommendedAction: 'Consider switching to Claude Pro for writing tasks',
        savings: Math.max(0, monthlySpend - 20),
        reason: 'Cursor is optimised for coding. For writing tasks, Claude Pro at $20/mo is more capable and cheaper.',
      };
    }
  }

  // --- GITHUB COPILOT ---
  if (name === 'github_copilot') {
    if (plan === 'enterprise' && teamSize < 20) {
      const savings = (PRICING.github_copilot.enterprise.price - PRICING.github_copilot.business.price) * seats;
      return {
        toolName: 'GitHub Copilot',
        currentSpend: monthlySpend,
        recommendedAction: 'Downgrade from Enterprise to Business plan',
        savings,
        reason: `Enterprise ($39/seat) adds compliance features needed by large orgs. With a team of ${teamSize}, Business ($19/seat) covers everything you need.`,
      };
    }
    if (plan === 'business' && useCase === 'coding' && seats >= 5) {
      const cursorEquivalent = PRICING.cursor.business.price * seats;
      if (cursorEquivalent < monthlySpend) {
        return {
          toolName: 'GitHub Copilot',
          currentSpend: monthlySpend,
          recommendedAction: 'Consider Cursor Business as an alternative',
          savings: monthlySpend - cursorEquivalent,
          reason: `Cursor provides a more complete AI coding environment. At ${seats} seats, switching saves $${monthlySpend - cursorEquivalent}/mo with better context awareness.`,
        };
      }
    }
  }

  // --- CHATGPT ---
  if (name === 'chatgpt') {
    if (plan === 'team' && seats <= 2) {
      const savings = (PRICING.chatgpt.team.price - PRICING.chatgpt.plus.price) * seats;
      return {
        toolName: 'ChatGPT',
        currentSpend: monthlySpend,
        recommendedAction: 'Switch from Team to individual Plus plans',
        savings,
        reason: `Team plan ($30/seat) requires minimum 2 users and adds admin features. With just ${seats} users, individual Plus ($20/seat) is sufficient.`,
      };
    }
    if (plan === 'plus' && useCase === 'coding') {
      return {
        toolName: 'ChatGPT',
        currentSpend: monthlySpend,
        recommendedAction: 'Switch to Claude Pro for coding tasks',
        savings: 0,
        reason: 'Claude Pro at the same price ($20/mo) scores higher on coding benchmarks (HumanEval). Worth a trial.',
      };
    }
  }

  // --- CLAUDE ---
  if (name === 'claude') {
    if (plan === 'team' && seats <= 2) {
      const savings = (PRICING.claude.team.price - PRICING.claude.pro.price) * seats;
      return {
        toolName: 'Claude',
        currentSpend: monthlySpend,
        recommendedAction: 'Switch from Team to individual Pro plans',
        savings,
        reason: `Team plan adds admin/billing features. With only ${seats} users, individual Pro plans save $${savings}/mo.`,
      };
    }
    if (plan === 'max' && useCase !== 'research' && useCase !== 'data') {
      return {
        toolName: 'Claude',
        currentSpend: monthlySpend,
        recommendedAction: 'Downgrade from Max to Pro plan',
        savings: PRICING.claude.max.price - PRICING.claude.pro.price,
        reason: `Max plan ($100/mo) is for extremely heavy usage (5x more usage than Pro). For ${useCase} tasks, Pro ($20/mo) is sufficient for most users.`,
      };
    }
  }

  // --- GEMINI ---
  if (name === 'gemini') {
    if (plan === 'ultra' && useCase === 'writing') {
      return {
        toolName: 'Gemini',
        currentSpend: monthlySpend,
        recommendedAction: 'Downgrade to Gemini Advanced (Pro tier)',
        savings: PRICING.gemini.ultra.price - PRICING.gemini.pro.price,
        reason: `For writing tasks, Gemini Advanced ($20/mo) performs on par with Ultra. The Ultra tier is primarily beneficial for complex data and research tasks.`,
      };
    }
  }

  // --- WINDSURF ---
  if (name === 'windsurf') {
    if (plan === 'team' && seats <= 3) {
      const savings = (PRICING.windsurf.team.price - PRICING.windsurf.pro.price) * seats;
      return {
        toolName: 'Windsurf',
        currentSpend: monthlySpend,
        recommendedAction: 'Switch to individual Pro plans',
        savings,
        reason: `With only ${seats} seats, individual Pro plans ($15/seat) give the same coding features as Team at lower cost.`,
      };
    }
  }

  // No issue found — already optimal for this tool
  return null;
}