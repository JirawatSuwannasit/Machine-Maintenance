import {
  breakdowns as mockBreakdowns,
  machines as mockMachines,
  maintenanceLogs as mockMaintenanceLogs,
  pmPlans as mockPmPlans,
  pmRecords as mockPmRecords,
  replacements as mockReplacements,
  spareParts as mockSpareParts,
} from '@/lib/mock-data';
import { createClient } from '@/lib/supabase/server';
import type { BreakdownRecord, KPI, Machine, MaintenanceLog, PMPlan, PMRecord, ReplacementRecord, SparePart } from '@/types/database';

export type AppData = {
  machines: Machine[];
  spareParts: SparePart[];
  breakdowns: BreakdownRecord[];
  maintenanceLogs: MaintenanceLog[];
  replacements: ReplacementRecord[];
  pmPlans: PMPlan[];
  pmRecords: PMRecord[];
  source: 'supabase' | 'demo';
};

const hasSupabaseConfig = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function selectTable<T>(name: string): Promise<T[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from(name).select('*');
  if (error) throw error;
  return (data ?? []) as T[];
}

export async function getData(): Promise<AppData> {
  if (!hasSupabaseConfig()) return demoData();

  try {
    const [machines, spareParts, breakdowns, maintenanceLogs, replacements, pmPlans, pmRecords] = await Promise.all([
      selectTable<Machine>('machines'),
      selectTable<SparePart>('spare_parts'),
      selectTable<BreakdownRecord>('breakdown_records'),
      selectTable<MaintenanceLog>('maintenance_logs'),
      selectTable<ReplacementRecord>('spare_part_replacement_records'),
      selectTable<PMPlan>('preventive_maintenance_plans'),
      selectTable<PMRecord>('preventive_maintenance_records'),
    ]);

    return { machines, spareParts, breakdowns, maintenanceLogs, replacements, pmPlans, pmRecords, source: 'supabase' };
  } catch {
    return demoData();
  }
}

function demoData(): AppData {
  return {
    machines: mockMachines,
    spareParts: mockSpareParts,
    breakdowns: mockBreakdowns,
    maintenanceLogs: mockMaintenanceLogs,
    replacements: mockReplacements,
    pmPlans: mockPmPlans,
    pmRecords: mockPmRecords,
    source: 'demo',
  };
}

export function addMonths(date: string, months: number) {
  const next = new Date(`${date}T00:00:00`);
  next.setMonth(next.getMonth() + months);
  return next.toISOString().slice(0, 10);
}

export function daysUntil(date?: string | null) {
  if (!date) return 9999;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${date}T00:00:00`);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

export function scheduleStatus(date?: string | null) {
  const days = daysUntil(date);
  if (days < 0) return 'OVERDUE';
  if (days <= 30) return 'DUE_SOON';
  return 'OK';
}

export function calculateNextDueDate(replacementDate: string, part: SparePart) {
  return addMonths(replacementDate, part.lifetime_months);
}

export function calculateKpis(data: AppData): KPI {
  const machineCount = Math.max(data.machines.length, 1);
  const unavailableMachines = data.machines.filter((machine) => ['Down', 'Maintenance'].includes(machine.status)).length;
  const totalDowntimeMinutes = data.breakdowns.reduce((sum, breakdown) => sum + (breakdown.downtime_minutes ?? 0), 0);
  const resolvedBreakdowns = data.breakdowns.filter((breakdown) => breakdown.status === 'Resolved' || breakdown.resolved_at);
  const estimatedOperatingHours = Math.max(machineCount * 30 * 24 - totalDowntimeMinutes / 60, 1);
  const activePlans = data.pmPlans.filter((plan) => plan.is_active);
  const overduePmCount = activePlans.filter((plan) => daysUntil(plan.next_due_date) < 0).length;
  const pmExpected = Math.max(activePlans.length, data.pmRecords.length, 1);
  const pendingDefects = data.breakdowns.filter((breakdown) => breakdown.status === 'Pending').length;
  const criticalPendingDefects = data.breakdowns.filter((breakdown) => breakdown.status === 'Pending' && breakdown.severity === 'Critical').length;

  return {
    availability: Math.round(((machineCount - unavailableMachines) / machineCount) * 1000) / 10,
    mtbfHours: Math.round((estimatedOperatingHours / Math.max(data.breakdowns.length, 1)) * 10) / 10,
    mttrHours: Math.round((totalDowntimeMinutes / 60 / Math.max(resolvedBreakdowns.length, 1)) * 10) / 10,
    breakdownRate: Math.round((data.breakdowns.length / machineCount) * 10) / 10,
    pmCompletionRate: Math.round((data.pmRecords.length / pmExpected) * 1000) / 10,
    overduePmCount,
    sparePartsDueCount: data.replacements.filter((replacement) => daysUntil(replacement.next_due_date) <= 30).length,
    pendingDefects,
    criticalPendingDefects,
    machineStatusSummary: data.machines.reduce<Record<string, number>>((summary, machine) => {
      summary[machine.status] = (summary[machine.status] ?? 0) + 1;
      return summary;
    }, {}),
  };
}
