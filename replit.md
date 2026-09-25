# Pocketwise — Personal Budget Tracker

Pocketwise is a local-first personal finance dashboard for tracking income and expenses, monitoring monthly budgets, and reviewing spending trends.

## Run & Operate

- The managed `artifacts/budget-tracker: web` workflow runs the app preview.
- `pnpm --filter @workspace/budget-tracker run typecheck` — typecheck the app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- App data is stored in the browser; no database or external service is required by Pocketwise.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React, Vite, TypeScript, Tailwind CSS
- Charts: Recharts; icons: Lucide React
- Persistence: versioned localStorage state
- Shared API server and database packages are workspace scaffolding; the tracker does not currently use them.

## Where things live

- `artifacts/budget-tracker/src/pages/` — dashboard, transaction history, budgets, settings
- `artifacts/budget-tracker/src/lib/finance.ts` — finance types, persistence, derived helpers, and sample data
- `artifacts/budget-tracker/src/components/` — shared navigation and transaction/budget forms

## Architecture decisions

- Keep financial records on-device in localStorage; no account or remote sync is part of this app.
- Derive dashboard and budget totals from transactions so edits are reflected immediately.

## Product

- Create, edit, search, filter, and delete income and expense transactions.
- Set monthly global or category budgets and monitor spending thresholds.
- Review income, expenses, net balance, savings rate, category mix, and recent trends.
- Choose a display currency, export transaction history as CSV, restore sample data, or clear local data.

## User preferences

- Seed 12 realistic transactions on first use; an intentional reset must remain empty until sample data is explicitly restored.

## Gotchas

- Browser-local data is not shared across browsers or devices. Clearing site storage removes the saved tracker data.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
