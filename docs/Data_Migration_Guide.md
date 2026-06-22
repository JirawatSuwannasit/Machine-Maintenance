# Excel / Google Sheet to Supabase Migration Guide

1. Export each prototype sheet as CSV: `Machine_List`, `Spare_Parts_Master`, `Spare_Parts_Schedule`, `Maintenance_Log`, `Defect_Log`, and `Audit_Log` if present.
2. Load `supabase/migrations/001_initial_schema.sql` in Supabase SQL Editor or via Supabase CLI.
3. Import machine rows into `machines`. Map `Machine_ID -> machine_code`, `SCOPE -> scope`, `Machine_Name -> name`, `Manufacturer -> manufacturer`, `Model -> model`, `SN -> serial_number`, `Range -> operating_range`, `Operation_Date -> operation_date`, and `Status -> status`.
4. Import `Spare_Parts_Master` into `spare_parts`, converting `Lifetime_Years` to `lifetime_months` by multiplying by 12.
5. Import `Defect_Log` into `breakdown_records`. Map root cause, corrective action, resolved by, resolved at, and linked maintenance fields when available.
6. Import every `Maintenance_Log` row into `maintenance_logs`. Keep `maintenance_date`, `action_type`, `details`, `operator`, optional part, optional linked defect, root cause, and corrective action.
7. For `Action_Type = Part Replacement`, also insert/update `spare_part_replacement_records`; calculate `next_due_date = replacement_date + spare_part.lifetime_months`.
8. For `Action_Type = PM`, insert into `preventive_maintenance_records` and create recurring `preventive_maintenance_plans` for known routines.
9. Build replacement schedule status dynamically from `next_due_date`: past date is `OVERDUE`, within 30 days is `DUE_SOON`, otherwise `OK`.
10. Import audit entries into `audit_logs` if historical audit tracking is required.
11. Validate counts against the old dashboard: total machines, active/inactive, pending defects, critical pending defects, overdue parts, and due-soon parts.

Use `supabase/seed/seed.sql` for a small demo dataset before importing production data.
