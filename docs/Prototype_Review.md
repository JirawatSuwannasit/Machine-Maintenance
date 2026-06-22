# Prototype Review and Migration Coverage

Reviewed files: `Code.gs`, `Index.html`, `docs/Excel_VBA_Migration.md`, and `README.md`.

## Preserved prototype features

- Machine dashboard with search/filter concepts and machine cards.
- Machine profile with machine information, active defects, spare parts schedule, maintenance history, full defect history, and print/report-ready structure.
- Maintenance log action types: `Repair`, `Part Replacement`, and `PM`.
- Defect report workflow with `Low`, `Medium`, `High`, and `Critical` severity levels.
- Pending defect linking from repair maintenance entries, including root cause and corrective action fields.
- Spare part replacement schedule update based on machine + part and next due date derived from part lifetime.
- Schedule status calculation: `OVERDUE`, `DUE_SOON` within 30 days, otherwise `OK`.
- Dashboard counts for total machines, active/inactive or unavailable machines, pending defects, critical pending defects, overdue PM, and parts due soon/overdue.
- Audit log table coverage for production tracking of create/update workflows.

## Fields mapped from prototype sheets

- `Machine_List` -> `machines`: machine ID/code, scope, machine name, manufacturer, model, serial number, range, operation date, status.
- `Spare_Parts_Master` -> `spare_parts`: part ID/code, name, lifetime years converted to months, description.
- `Maintenance_Log` -> `maintenance_logs`, `spare_part_replacement_records`, and `preventive_maintenance_records` depending on action type.
- `Defect_Log` -> `breakdown_records`: defect ID, timestamp/created_at, machine, date found, symptom, severity, reporter, status, root cause, corrective action, resolver, resolved timestamp, linked maintenance ID.
- `Spare_Parts_Schedule` -> latest rows in `spare_part_replacement_records`, with `next_due_date` and calculated due status.
- `Audit_Log` -> `audit_logs`.

## Improvements over the first migration attempt

- Added the missing `maintenance_logs` table and UI usage.
- Added `audit_logs`, defect-code sequence, and part-required check for replacement actions.
- Expanded pages from placeholder one-liners into readable page implementations with table columns and form fields matching prototype workflows.
- Pinned dependencies to stable versions so `next lint` remains valid.
