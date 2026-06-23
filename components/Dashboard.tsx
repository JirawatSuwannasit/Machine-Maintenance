import Link from 'next/link';
import { DataTable } from '@/components/DataTable';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { calculateKpis, daysUntil, getData, scheduleStatus } from '@/lib/data';

function KpiCard({ label, value, helper }: { label: string; value: string | number; helper: string }) {
  return (
    <div className="card p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-blue-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{helper}</p>
    </div>
  );
}

export async function Dashboard() {
  const data = await getData();
  const kpis = calculateKpis(data);
  const recentBreakdowns = data.breakdowns.slice().sort((a, b) => b.date_found.localeCompare(a.date_found)).slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader title="Maintenance Dashboard" description={`Live source: ${data.source === 'demo' ? 'demo data until Supabase env vars are configured' : 'Supabase'}. Prototype dashboard counts, defect alerts, spare due status, and KPI summaries are preserved.`} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Machine Availability" value={`${kpis.availability}%`} helper="Active machines ÷ total machines" />
        <KpiCard label="MTBF" value={`${kpis.mtbfHours} h`} helper="Estimated operating hours ÷ breakdowns" />
        <KpiCard label="MTTR" value={`${kpis.mttrHours} h`} helper="Downtime hours ÷ resolved breakdowns" />
        <KpiCard label="Breakdown Rate" value={`${kpis.breakdownRate}/machine`} helper="Breakdowns per machine" />
        <KpiCard label="PM Completion" value={`${kpis.pmCompletionRate}%`} helper="Completed PM records ÷ expected PM work" />
        <KpiCard label="Overdue PM" value={kpis.overduePmCount} helper="Active PM plans past next due date" />
        <KpiCard label="Parts Due" value={kpis.sparePartsDueCount} helper="Replacement schedules due within 30 days" />
        <KpiCard label="Pending Defects" value={`${kpis.pendingDefects} (${kpis.criticalPendingDefects} critical)`} helper="Open defect reports from breakdown_records" />
      </div>

      <section className="card p-5">
        <h2 className="mb-4 text-lg font-semibold">Machine Status Summary</h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(kpis.machineStatusSummary).map(([status, count]) => (
            <div className="rounded-lg border border-slate-200 p-3" key={status}>
              <StatusBadge value={status} />
              <div className="mt-2 text-2xl font-bold">{count}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Machine Cards</h2>
        <DataTable rows={data.machines} columns={[
          { key: 'machine', header: 'Machine', render: (machine) => <Link className="font-semibold text-blue-800" href={`/machines/${machine.machine_id}`}>{machine.machine_id} · {machine.machine_name}</Link> },
          { key: 'scope', header: 'Scope', render: (machine) => machine.scope ?? '—' },
          { key: 'manufacturer', header: 'Manufacturer', render: (machine) => `${machine.manufacturer ?? '—'} ${machine.model ?? ''}` },
          { key: 'defects', header: 'Pending Defects', render: (machine) => data.breakdowns.filter((breakdown) => breakdown.machine_id === machine.machine_id && breakdown.status === 'Pending').length },
          { key: 'status', header: 'Status', render: (machine) => <StatusBadge value={machine.status} /> },
        ]} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Spare Parts Schedule</h2>
        <DataTable rows={data.replacements} columns={[
          { key: 'machine', header: 'Machine', render: (replacement) => data.machines.find((machine) => machine.machine_id === replacement.machine_id)?.machine_id ?? '—' },
          { key: 'part', header: 'Part', render: (replacement) => data.spareParts.find((part) => part.id === replacement.spare_part_id)?.name ?? '—' },
          { key: 'last', header: 'Last Changed', render: (replacement) => replacement.replacement_date },
          { key: 'due', header: 'Next Due', render: (replacement) => `${replacement.next_due_date ?? '—'} (${daysUntil(replacement.next_due_date)}d)` },
          { key: 'status', header: 'Status', render: (replacement) => <StatusBadge value={scheduleStatus(replacement.next_due_date)} /> },
        ]} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Recent Breakdown / Defect Reports</h2>
        <DataTable rows={recentBreakdowns} columns={[
          { key: 'defect', header: 'Defect', render: (breakdown) => breakdown.defect_code },
          { key: 'machine', header: 'Machine', render: (breakdown) => data.machines.find((machine) => machine.machine_id === breakdown.machine_id)?.machine_id ?? '—' },
          { key: 'symptom', header: 'Symptom', render: (breakdown) => breakdown.symptom },
          { key: 'severity', header: 'Severity', render: (breakdown) => <StatusBadge value={breakdown.severity} /> },
          { key: 'status', header: 'Status', render: (breakdown) => <StatusBadge value={breakdown.status} /> },
        ]} />
      </section>
    </div>
  );
}
