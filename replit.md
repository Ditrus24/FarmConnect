# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains the FarmConnect AI marketplace app.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### FarmConnect AI (`artifacts/farmconnect`)
- **Type**: react-vite
- **Preview Path**: `/`
- **Tech**: React + Vite + Tailwind CSS + shadcn/ui
- **Auth/Data**: localStorage (no external backend needed)
- **Description**: P2C (Producer-to-Consumer) marketplace connecting farmers directly with consumers

#### Features:
- Authentication: Signup/Login with role selection (Farmer / Consumer)
- Farmer Dashboard: Add/Edit/Delete products, view orders, mark delivered
- Consumer Home: Browse products, search/filter by name/location/category
- AI Price Suggestions: Static rule-based price suggestions for common produce
- Cart System: Add/remove items, update quantity, view total
- Orders: Place orders, view history, "You saved ₹X" display
- Farmer Profiles: View farmer info and their products
- Product Detail: Full product view with savings breakdown

#### Demo Accounts (auto-seeded in localStorage):
- **Farmer**: `raju@farm.com` / any password
- **Consumer**: `demo@consumer.com` / any password

#### Pages:
- `/` — Landing page
- `/home` — Product marketplace (search, filter, sort)
- `/product/:id` — Product detail page
- `/login` — Sign in
- `/signup` — Register with role selection
- `/cart` — Shopping cart
- `/orders` — Consumer order history
- `/farmer-dashboard` — Farmer product management
- `/farmer-orders` — Farmer order management
- `/farmer-profile/:id` — Public farmer profile

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/farmconnect run dev` — run FarmConnect AI frontend

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
