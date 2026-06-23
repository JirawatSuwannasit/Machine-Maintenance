import { DataTable } from '@/components/DataTable';
import { PageHeader } from '@/components/PageHeader';
import { RecordForm } from '@/components/RecordForm';
import { StatusBadge } from '@/components/StatusBadge';
import { getData } from '@/lib/data';

export default async function Page() {
  const data = await getData();
  return (
    <div className="space-y-6">
      <PageHeader title="Breakdown Records" description="Replacement for prototype Defect_Log: sequential defect IDs, date found, symptom, severity, reporter, status, root cause, corrective action, resolver, and linked maintenance entry." />
      <div className="flex flex-wrap gap-2"><input className="input max-w-md" placeholder="Search defect, symptom, machine..." /><select className="input max-w-48"><option>All severities</option><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select><button className="btn-primary">Report Defect</button></div>
      <DataTable rows={data.breakdowns} columns={[
        { key: 'code', header: 'Defect ID', render: (record) => record.defect_code },
        { key: 'machine', header: 'Machine', render: (record) => data.machines.find((machine) => machine.machine_id === record.machine_id)?.machine_id ?? '—' },
        { key: 'date', header: 'Date Found', render: (record) => record.date_found },
        { key: 'symptom', header: 'Symptom', render: (record) => record.symptom },
        { key: 'severity', header: 'Severity', render: (record) => <StatusBadge value={record.severity} /> },
        { key: 'status', header: 'Status', render: (record) => <StatusBadge value={record.status} /> },
        { key: 'reported', header: 'Reported By', render: (record) => record.reported_by },
      ]} />
      <RecordForm title="Report / Resolve Defect">
        <label className="text-sm font-medium">Machine<select className="input mt-1">{data.machines.map((machine) => <option key={machine.machine_id}>{machine.machine_id} — {machine.machine_name}</option>)}</select></label>
        <label className="text-sm font-medium">Date Found<input className="input mt-1" type="date" /></label>
        <label className="text-sm font-medium md:col-span-2">Symptom<textarea className="input mt-1" rows={3} /></label>
        <label className="text-sm font-medium">Severity<select className="input mt-1"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></label>
        <label className="text-sm font-medium">Reported By<input className="input mt-1" /></label>
        <label className="text-sm font-medium">Root Cause<input className="input mt-1" /></label>
        <label className="text-sm font-medium">Corrective Action<input className="input mt-1" /></label>
      </RecordForm>
    </div>
  );
}
