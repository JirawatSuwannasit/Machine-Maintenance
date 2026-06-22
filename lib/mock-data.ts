import type { BreakdownRecord, Machine, MaintenanceLog, PMPlan, PMRecord, ReplacementRecord, SparePart } from '@/types/database';

const now = new Date().toISOString();

export const machines: Machine[] = [
  { id: '11111111-1111-1111-1111-111111111111', machine_code: 'TE1', scope: 'REL', name: 'LOW TEMPERATURE CHAMBER', manufacturer: 'ESPEC', model: 'PU-1ST', serial_number: '13006110', operating_range: '-40°C – +100°C', operation_date: '1998-04-30', status: 'Active', department_id: null, area_id: null, created_at: now, updated_at: now },
  { id: '22222222-2222-2222-2222-222222222222', machine_code: 'TE2', scope: 'REL', name: 'HIGH TEMPERATURE CHAMBER', manufacturer: 'ESPEC', model: 'PH-201', serial_number: '212004863', operating_range: '+20°C – +200°C', operation_date: '1998-04-30', status: 'Maintenance', department_id: null, area_id: null, created_at: now, updated_at: now },
  { id: '33333333-3333-3333-3333-333333333333', machine_code: 'TE3', scope: 'REL', name: 'HIGH TEMPERATURE CHAMBER', manufacturer: 'ESPEC', model: 'PHH-102M', serial_number: '213007740', operating_range: '+20°C – +300°C', operation_date: '2016-04-01', status: 'Active', department_id: null, area_id: null, created_at: now, updated_at: now },
];

export const spareParts: SparePart[] = [
  { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', part_code: 'SP-01', name: 'Chiller Pump Seal', lifetime_months: 12, description: 'Annual replacement from prototype Lifetime_Years.', is_active: true, created_at: now, updated_at: now },
  { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', part_code: 'SP-02', name: 'Door Gasket', lifetime_months: 24, description: 'Temperature chamber seal.', is_active: true, created_at: now, updated_at: now },
];

export const breakdowns: BreakdownRecord[] = [
  { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', defect_code: 'DF-0001', machine_id: machines[1].id, date_found: '2026-06-10', symptom: 'Temperature recovery is slow after door opening.', severity: 'High', reported_by: 'QA Operator', status: 'Pending', root_cause: null, corrective_action: null, resolved_by: null, resolved_at: null, downtime_minutes: 180, linked_maintenance_id: null, created_at: now },
  { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', defect_code: 'DF-0002', machine_id: machines[0].id, date_found: '2026-05-20', symptom: 'Abnormal chiller pump noise.', severity: 'Medium', reported_by: 'Production', status: 'Resolved', root_cause: 'Worn pump seal', corrective_action: 'Replaced seal and verified ramp test', resolved_by: 'Maintenance A', resolved_at: '2026-05-21T09:30:00Z', downtime_minutes: 90, linked_maintenance_id: 'ffffffff-ffff-ffff-ffff-ffffffffffff', created_at: now },
];

export const maintenanceLogs: MaintenanceLog[] = [
  { id: 'ffffffff-ffff-ffff-ffff-ffffffffffff', machine_id: machines[0].id, action_type: 'Repair', spare_part_id: spareParts[0].id, linked_breakdown_id: breakdowns[1].id, maintenance_date: '2026-05-21', details: 'Pump seal replacement after abnormal noise report.', root_cause: 'Worn pump seal', corrective_action: 'Replaced seal and observed normal operation.', operator_name: 'Maintenance A', created_at: '2026-05-21T09:30:00Z' },
  { id: 'ffffffff-ffff-ffff-ffff-fffffffffffe', machine_id: machines[0].id, action_type: 'PM', spare_part_id: null, linked_breakdown_id: null, maintenance_date: '2026-06-01', details: 'Monthly chamber inspection completed.', root_cause: null, corrective_action: null, operator_name: 'Maintenance A', created_at: '2026-06-01T08:00:00Z' },
];

export const replacements: ReplacementRecord[] = [
  { id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', machine_id: machines[0].id, spare_part_id: spareParts[0].id, replacement_date: '2026-05-21', next_due_date: '2027-05-21', operator_name: 'Maintenance A', notes: 'Created from repair log with selected part.', created_at: now },
  { id: 'cccccccc-cccc-cccc-cccc-cccccccccccd', machine_id: machines[1].id, spare_part_id: spareParts[1].id, replacement_date: '2024-06-01', next_due_date: '2026-06-01', operator_name: 'Maintenance B', notes: 'Due soon/overdue demo schedule.', created_at: now },
];

export const pmPlans: PMPlan[] = [
  { id: 'dddddddd-dddd-dddd-dddd-dddddddddddd', machine_id: machines[0].id, name: 'Monthly chamber inspection', frequency_days: 30, checklist: 'Clean filter; verify temperature ramp; inspect seals', next_due_date: '2026-06-30', is_active: true, created_at: now, updated_at: now },
  { id: 'dddddddd-dddd-dddd-dddd-ddddddddddde', machine_id: machines[1].id, name: 'Quarterly calibration readiness check', frequency_days: 90, checklist: 'Verify sensor reading stability and safety interlocks', next_due_date: '2026-06-01', is_active: true, created_at: now, updated_at: now },
];

export const pmRecords: PMRecord[] = [
  { id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', plan_id: pmPlans[0].id, machine_id: machines[0].id, performed_date: '2026-06-01', completed_by: 'Maintenance A', result: 'Pass', notes: 'No abnormal findings.', created_at: now },
];
