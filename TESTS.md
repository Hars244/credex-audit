# Tests — SpendScan Audit Engine

## Test Framework
Jest with ts-jest for TypeScript support.

## How to Run
```bash
npm install
npm test
```

## Test Files

### `src/lib/__tests__/auditEngine.test.ts`
Tests the core audit engine logic — the most critical
part of the application. All 6 tests cover the
rule-based savings calculation system.

| # | Test name | What it covers |
|---|-----------|----------------|
| 1 | Cursor Business 2 seats → downgrade | Verifies Business→Pro downgrade triggers correctly with correct $40 savings |
| 2 | ChatGPT Team 2 seats → switch to Plus | Verifies Team→Plus switch triggers with correct $20 savings |
| 3 | Annual = monthly × 12 | Verifies annual savings calculation is always monthly × 12 |
| 4 | Optimal setup returns no recommendations | Verifies engine does not manufacture fake savings |
| 5 | isHighValue true when savings > $500 | Verifies high-value flag for Credex CTA logic |
| 6 | Multiple tools aggregate correctly | Verifies total savings equals sum of individual recommendations |

## Design Decisions
- Tests cover the audit engine exclusively as required
- No mocking — tests run against real rule logic
- Edge cases covered: already-optimal, multi-tool, high-value threshold
- Tests are deterministic — same input always produces same output