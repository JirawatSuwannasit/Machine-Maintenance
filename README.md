# Machine History & Maintenance

A production-oriented migration of the original Google Apps Script / Excel prototype into a modern maintenance-management web application.

## What was migrated from the prototype

The reviewed prototype files (`Code.gs`, `Index.html`, `docs/Excel_VBA_Migration.md`, and the original `README.md`) showed these core workflows:

- Machine master list and dashboard cards.
- Machine profile report with basic information, active pending defects, spare part schedule, maintenance history, and full defect history.
- Maintenance log creation for `Repair`, `Part Replacement`, and `PM` actions.
- Pending defect report creation and repair-time defect resolution with root cause, corrective action, resolver, and linked maintenance ID.
- Spare part replacement schedule upsert by `Machine_ID + Part_ID` with next due date calculated from part lifetime.
- Status calculations: `OVERDUE`, `DUE_SOON` within 30 days, otherwise `OK`.
- Dashboard counts for active/inactive machines, pending defects, critical pending defects, overdue parts, and due-soon parts.
- Audit logging for maintenance creation, defect reporting, defect resolution, and schedule updates.

See `docs/Prototype_Review.md` for a detailed feature/field mapping.

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Postgres/Auth/RLS
- Vercel deployment

## Main features

- Dashboard with machine availability, MTBF, MTTR, breakdown rate, PM completion rate, overdue PM, due spare parts, pending defects, critical pending defects, and status summary.
- Machine Master and Machine Detail pages.
- Breakdown/defect lifecycle pages with prototype severity and status values.
- Spare Part Master and replacement schedule pages.
- Maintenance log model that supports repair, replacement, and PM workflows.
- Preventive Maintenance Plans and Records.
- Reports/KPI page with date-filter UI.
- Settings page documenting role and reference-value configuration.
- Responsive industrial dashboard layout with tables, badges, search/filter controls, form shells, loading/empty-state-ready table components, and delete-confirmation-ready button patterns.

## Local setup

```bash
npm install
npm run dev
```

If Supabase environment variables are absent, the app falls back to bundled demo data so pages can render during local setup.

## Environment variables

Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

A Supabase service-role key is not required for normal browser/server rendering. If future admin jobs need a service-role key, keep it server-only and never expose it to client components.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/migrations/001_initial_schema.sql` using the Supabase SQL editor or Supabase CLI.
3. Optionally run `supabase/seed/seed.sql` for demo data.
4. Enable Supabase Auth for internal users.
5. Insert matching `profiles` rows for authenticated users with `admin`, `technician`, or `viewer` role.

## Data migration

See `docs/Data_Migration_Guide.md`.

High-level steps:

1. Export legacy sheets as CSV.
2. Import machines and spare parts first.
3. Convert spare part lifetime years to lifetime months.
4. Import defect logs into `breakdown_records`.
5. Import maintenance rows into `maintenance_logs`, plus replacement or PM-specific tables based on action type.
6. Recalculate next due dates and validate dashboard counts against the old prototype.

## Vercel deployment

1. Push this repository to GitHub.
2. Import the repository in Vercel.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel Project Settings.
4. Deploy with the default `next build` command.

## Known limitations / next steps

- Add authenticated mutation server actions for final Add/Edit/Delete behavior once user roles are confirmed.
- Add a dedicated login screen and route protection after the company chooses its Supabase Auth provider.
- Add date-range filtering to KPI queries in Supabase rather than only the report UI controls.
- Add automated tests once package installation is available in CI.
