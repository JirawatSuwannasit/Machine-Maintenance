export type MachineStatus = 'Active' | 'Inactive' | 'Maintenance' | 'Down';
export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';
export type DefectStatus = 'Pending' | 'Resolved' | 'Closed';
export type MaintenanceAction = 'Repair' | 'Part Replacement' | 'PM' | 'Inspection';
export type ScheduleStatus = 'OK' | 'DUE_SOON' | 'OVERDUE';

export type Department = { id: string; name: string; created_at: string };
export type Area = { id: string; department_id: string | null; name: string };
export type Profile = { id: string; full_name: string | null; role: 'admin' | 'technician' | 'viewer'; created_at: string };

export type Machine = {
  id: string;
  machine_code: string;
  scope: string | null;
  name: string;
  manufacturer: string | null;
  model: string | null;
  serial_number: string | null;
  operating_range: string | null;
  operation_date: string | null;
  status: MachineStatus;
  department_id: string | null;
  area_id: string | null;
  created_at: string;
  updated_at: string;
};

export type SparePart = {
  id: string;
  part_code: string;
  name: string;
  lifetime_months: number;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type MaintenanceLog = {
  id: string;
  machine_id: string;
  action_type: MaintenanceAction;
  spare_part_id: string | null;
  linked_breakdown_id: string | null;
  maintenance_date: string;
  details: string | null;
  root_cause: string | null;
  corrective_action: string | null;
  operator_name: string;
  created_at: string;
};

export type BreakdownRecord = {
  id: string;
  defect_code: string;
  machine_id: string;
  date_found: string;
  symptom: string;
  severity: Severity;
  reported_by: string;
  status: DefectStatus;
  root_cause: string | null;
  corrective_action: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  downtime_minutes: number | null;
  linked_maintenance_id: string | null;
  created_at: string;
};

export type ReplacementRecord = {
  id: string;
  machine_id: string;
  spare_part_id: string;
  replacement_date: string;
  next_due_date: string | null;
  operator_name: string;
  notes: string | null;
  created_at: string;
};

export type PMPlan = {
  id: string;
  machine_id: string;
  name: string;
  frequency_days: number;
  checklist: string | null;
  next_due_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type PMRecord = {
  id: string;
  plan_id: string | null;
  machine_id: string;
  performed_date: string;
  completed_by: string;
  result: string;
  notes: string | null;
  created_at: string;
};

export type AuditLog = {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  created_at: string;
};

export type KPI = {
  availability: number;
  mtbfHours: number;
  mttrHours: number;
  breakdownRate: number;
  pmCompletionRate: number;
  overduePmCount: number;
  sparePartsDueCount: number;
  pendingDefects: number;
  criticalPendingDefects: number;
  machineStatusSummary: Record<string, number>;
};
