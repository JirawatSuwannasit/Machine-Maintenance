import { DataTable } from '@/components/DataTable';
import { PageHeader } from '@/components/PageHeader';
import { RecordForm } from '@/components/RecordForm';
import { StatusBadge } from '@/components/StatusBadge';
import { getData, scheduleStatus } from '@/lib/data';

export default async function Page() {
  const data = await getData();
  return <div className="space-y-6"><PageHeader title="Preventive Maintenance Plans" description="Recurring PM definitions for each machine, including frequency, checklist, active flag, and next due date." /><div className="flex gap-2"><input className="input max-w-md" placeholder="Search PM plan..." /><button className="btn-primary">Add PM Plan</button></div><DataTable rows={data.pmPlans} columns={[{ key: 'machine', header: 'Machine', render: (plan) => data.machines.find((machine) => machine.id === plan.machine_id)?.machine_code ?? '—' }, { key: 'name', header: 'Plan', render: (plan) => plan.name }, { key: 'freq', header: 'Frequency', render: (plan) => `${plan.frequency_days} days` }, { key: 'next', header: 'Next Due', render: (plan) => plan.next_due_date }, { key: 'status', header: 'Status', render: (plan) => <StatusBadge value={scheduleStatus(plan.next_due_date)} /> }, { key: 'active', header: 'Active', render: (plan) => plan.is_active ? 'Yes' : 'No' }]} /><RecordForm title="Add / Edit PM Plan"><label className="text-sm font-medium">Machine<select className="input mt-1">{data.machines.map((machine) => <option key={machine.id}>{machine.machine_code}</option>)}</select></label><label className="text-sm font-medium">Plan Name<input className="input mt-1" /></label><label className="text-sm font-medium">Frequency Days<input className="input mt-1" type="number" min="1" /></label><label className="text-sm font-medium">Next Due Date<input className="input mt-1" type="date" /></label><label className="text-sm font-medium md:col-span-2">Checklist<textarea className="input mt-1" rows={3} /></label></RecordForm></div>;
}
