import { runAudit } from '../auditEngine';

describe('Audit Engine', () => {

  test('1. Cursor Business with 2 seats triggers downgrade to Pro', () => {
    const result = runAudit(
      [{ name: 'cursor', plan: 'business', monthlySpend: 80, seats: 2 }],
      2,
      'coding'
    );
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.recommendations[0].toolName).toBe('Cursor');
    expect(result.recommendations[0].savings).toBe(40);
    expect(result.totalMonthlySavings).toBe(40);
  });

  test('2. ChatGPT Team with 2 seats triggers switch to Plus', () => {
    const result = runAudit(
      [{ name: 'chatgpt', plan: 'team', monthlySpend: 60, seats: 2 }],
      2,
      'writing'
    );
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.recommendations[0].toolName).toBe('ChatGPT');
    expect(result.recommendations[0].savings).toBe(20);
  });

  test('3. Annual savings equals monthly savings times 12', () => {
    const result = runAudit(
      [{ name: 'cursor', plan: 'business', monthlySpend: 80, seats: 2 }],
      2,
      'coding'
    );
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
  });

  test('4. Already optimal setup returns no recommendations', () => {
    const result = runAudit(
      [{ name: 'cursor', plan: 'pro', monthlySpend: 20, seats: 1 }],
      1,
      'coding'
    );
    expect(result.recommendations.length).toBe(0);
    expect(result.isOptimal).toBe(true);
    expect(result.totalMonthlySavings).toBe(0);
  });

  test('5. isHighValue is true when savings exceed $500/mo', () => {
    const result = runAudit(
      [
        { name: 'cursor', plan: 'business', monthlySpend: 400, seats: 10 },
        { name: 'chatgpt', plan: 'team', monthlySpend: 300, seats: 10 },
      ],
      10,
      'coding'
    );
    if (result.totalMonthlySavings > 500) {
      expect(result.isHighValue).toBe(true);
    } else {
      expect(result.isHighValue).toBe(false);
    }
  });

  test('6. Multiple tools aggregate savings correctly', () => {
    const result = runAudit(
      [
        { name: 'cursor', plan: 'business', monthlySpend: 80, seats: 2 },
        { name: 'chatgpt', plan: 'team', monthlySpend: 60, seats: 2 },
      ],
      2,
      'coding'
    );
    const manualSum = result.recommendations.reduce(
      (sum, r) => sum + r.savings, 0
    );
    expect(result.totalMonthlySavings).toBe(manualSum);
  });

});