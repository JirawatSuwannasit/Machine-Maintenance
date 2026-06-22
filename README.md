# Machine History & Maintenance

Production-ready migration of the original Google Apps Script / Excel prototype into a modern web application for machine history and maintenance management.

## Prototype behavior preserved

The old app managed machine master data, spare part lifetime schedules, maintenance logs, defect reports, pending defect resolution, and dashboard counts for active/inactive machines, pending/critical defects, overdue parts, and due-soon parts. This Next.js version keeps those workflows while using normalized Supabase tables and maintainable TypeScript components.

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Postgres/Auth/RLS
- Vercel deployment

## Features

- Dashboard with machine availability, MTBF, MTTR, breakdown rate, PM completion, overdue PM, parts due, and status summary.
- Machine Master and Machine Detail pages.
- Breakdown records with severity/status lifecycle.
- Spare Part Master and replacement history.
- Preventive maintenance plans and records.
- Reports / KPI summary with date-filter UI.
- Settings page for reference values and internal auth/role model.
- Responsive sidebar/top navigation, tables, empty states, forms, clear buttons, and delete-confirmation guidance.

## Local setup

```bash
npm install
npm run dev
```

Without Supabase environment variables, the app uses built-in demo data so pages can render immediately.

## Environment variables

Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

A Supabase service-role key is not required for the current app. If future admin-only background jobs need it, keep it server-only and never expose it to browser code.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/migrations/001_initial_schema.sql`.
3. Optionally run `supabase/seed/seed.sql` for demo data.
4. Enable Supabase Auth for internal users.
5. Insert rows in `profiles` for each authenticated user with `admin`, `technician`, or `viewer` role.

## Data migration

See `docs/Data_Migration_Guide.md`. In short: export legacy sheets as CSV, import machines and spare parts first, then defects, replacement records, PM records, and PM plans. Convert all dates to ISO `YYYY-MM-DD` and convert spare part lifetime years to months.

## Vercel deployment

1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel Project Settings.
4. Deploy. The app uses `next build` and is compatible with the App Router.

## Known limitations / next steps

- Mutating Add/Edit/Delete buttons are UI-ready but should be connected to server actions after finalizing role approval rules.
- KPI date filters are scaffolded; production reporting should pass date ranges into Supabase queries.
- Authentication screens can be added once the company sign-in method is selected.
