# Excel / Google Sheet to Supabase Migration Guide

1. Export each prototype sheet as CSV: `Machine_List`, `Spare_Parts_Master`, `Spare_Parts_Schedule`, `Maintenance_Log`, and `Defect_Log`.
2. Load `supabase/migrations/001_initial_schema.sql` in Supabase SQL Editor or via Supabase CLI.
3. Import machine rows into `machines`. Map `Machine_ID -> machine_code`, `SCOPE -> scope`, `Machine_Name -> name`, `SN -> serial_number`, `Range -> operating_range`, and normalize dates to `YYYY-MM-DD`.
4. Import `Spare_Parts_Master` into `spare_parts`, converting `Lifetime_Years` to `lifetime_months` by multiplying by 12.
5. Import `Defect_Log` into `breakdown_records`. Missing legacy columns such as root cause, corrective action, and downtime can remain null.
6. Import replacement rows from `Maintenance_Log` where `Action_Type = Part Replacement` into `spare_part_replacement_records`. Calculate `next_due_date` from replacement date plus part lifetime months.
7. Import `PM` rows from `Maintenance_Log` into `preventive_maintenance_records` and create recurring `preventive_maintenance_plans` for known PM routines.
8. Validate counts against the old dashboard: total machines, active/inactive, pending/critical defects, overdue parts, and due soon parts.

Use `supabase/seed/seed.sql` for a small demo dataset if you need local testing before importing production data.
