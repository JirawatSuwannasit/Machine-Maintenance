import { notFound } from 'next/navigation';
import { DataTable } from '@/components/DataTable';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { getData, scheduleStatus } from '@/lib/data';

export default async function Page({ params }: { params: { id: string } }) {
  const data = await getData();
  const machine = data.machines.find((item) => item.machine_id === params.id);
  if (!machine) notFound();

  const breakdowns = data.breakdowns.filter((item) => item.machine_id === params.id);
  const replacements = data.replacements.filter((item) => item.machine_id === params.id);
  const maintenanceLogs = data.maintenanceLogs.filter((item) => item.machine_id === params.id);
  const pmRecords = data.pmRecords.filter((item) => item.machine_id === params.id);
  const pendingDefects = breakdowns.filter((item) => item.status === 'Pending');

  return (
    <div className="space-y-6">
      <PageHeader title={`${machine.machine_id} · ${machine.machine_name}`} description="Machine profile report preserving prototype sections: basic information, active defects, spare part schedule, maintenance history, and full defect history." />
      <section className={`rounded-xl border p-5 ${pendingDefects.length ? 'border-amber-300 bg-amber-50' : 'border-emerald-200 bg-emerald-50'}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Active Defects</h2>
          <StatusBadge value={pendingDefects.length ? 'Pending' : 'OK'} />
        </div>
        <p className="mt-2 text-sm text-slate-700">{pendingDefects.length ? `${pendingDefects.length} pending defect(s) require follow-up.` : 'No active defects for this machine.'}</p>
      </section>
      <section className="card p-5">
        <div className="flex flex-wrap justify-between gap-4">
          <div><h2 className="text-xl font-bold">Machine Information</h2><p className="text-sm text-slate-500">{machine.scope} · {machine.manufacturer} · {machine.model}</p></div>
          <StatusBadge value={machine.status} />
        </div>
        <dl className="mt-5 grid gap-3 md:grid-cols-4">
          {[
            ['Serial No.', machine.serial_number],
            ['Range', machine.range],
            ['Operation Date', machine.operation_date],
            ['Department / Area', machine.department_id ?? machine.area_id],
          ].map(([label, value]) => <div className="rounded-lg bg-slate-50 p-3" key={label}><dt className="text-xs uppercase text-slate-500">{label}</dt><dd className="font-semibold">{value ?? '—'}</dd></div>)}
        </dl>
      </section>
      <section><h2 className="mb-3 text-lg font-semibold">Spare Parts Schedule</h2><DataTable rows={replacements} columns={[
        { key: 'part', header: 'Part', render: (replacement) => data.spareParts.find((part) => part.id === replacement.spare_part_id)?.name ?? '—' },
        { key: 'last', header: 'Last Changed', render: (replacement) => replacement.replacement_date },
        { key: 'next', header: 'Next Due', render: (replacement) => replacement.next_due_date ?? '—' },
        { key: 'status', header: 'Status', render: (replacement) => <StatusBadge value={scheduleStatus(replacement.next_due_date)} /> },
      ]} /></section>
      <section><h2 className="mb-3 text-lg font-semibold">Maintenance History</h2><DataTable rows={maintenanceLogs} columns={[
        { key: 'date', header: 'Maintenance Date', render: (log) => log.maintenance_date },
        { key: 'action', header: 'Action', render: (log) => log.action_type },
        { key: 'part', header: 'Part', render: (log) => data.spareParts.find((part) => part.id === log.spare_part_id)?.name ?? '—' },
        { key: 'details', header: 'Details', render: (log) => log.details ?? '—' },
        { key: 'operator', header: 'Operator', render: (log) => log.operator_name },
      ]} /></section>
      <section><h2 className="mb-3 text-lg font-semibold">Defect History</h2><DataTable rows={breakdowns} columns={[
        { key: 'defect', header: 'Defect ID', render: (breakdown) => breakdown.defect_code },
        { key: 'found', header: 'Date Found', render: (breakdown) => breakdown.date_found },
        { key: 'severity', header: 'Severity', render: (breakdown) => <StatusBadge value={breakdown.severity} /> },
        { key: 'symptom', header: 'Symptom', render: (breakdown) => breakdown.symptom },
        { key: 'status', header: 'Status', render: (breakdown) => <StatusBadge value={breakdown.status} /> },
      ]} /></section>
      <section><h2 className="mb-3 text-lg font-semibold">Preventive Maintenance Records</h2><DataTable rows={pmRecords} columns={[
        { key: 'date', header: 'Performed', render: (record) => record.performed_date },
        { key: 'by', header: 'Completed By', render: (record) => record.completed_by },
        { key: 'result', header: 'Result', render: (record) => record.result },
        { key: 'notes', header: 'Notes', render: (record) => record.notes ?? '—' },
      ]} /></section>
    </div>
  );
}
