import Link from 'next/link';
import { DataTable } from '@/components/DataTable';
import { PageHeader } from '@/components/PageHeader';
import { RecordForm } from '@/components/RecordForm';
import { StatusBadge } from '@/components/StatusBadge';
import { getData } from '@/lib/data';

export default async function Page() {
  const data = await getData();

  return (
    <div className="space-y-6">
      <PageHeader title="Machine Master" description="Preserves prototype Machine_List fields: Machine ID, scope, name, manufacturer, model, serial number, range, operation date, and status." />
      <div className="flex flex-wrap gap-2">
        <input className="input max-w-md" placeholder="Search name, ID, scope, manufacturer..." />
        <select className="input max-w-48"><option>All statuses</option><option>Active</option><option>Inactive</option><option>Maintenance</option><option>Down</option></select>
        <button className="btn-primary">Add Machine</button>
      </div>
      <DataTable rows={data.machines} columns={[
        { key: 'code', header: 'Machine ID', render: (machine) => <Link className="font-semibold text-blue-800" href={`/machines/${machine.machine_id}`}>{machine.machine_id}</Link> },
        { key: 'name', header: 'Name', render: (machine) => machine.machine_name },
        { key: 'scope', header: 'Scope', render: (machine) => machine.scope ?? '—' },
        { key: 'model', header: 'Manufacturer / Model', render: (machine) => `${machine.manufacturer ?? '—'} / ${machine.model ?? '—'}` },
        { key: 'serial', header: 'Serial No.', render: (machine) => machine.serial_number ?? '—' },
        { key: 'range', header: 'Range', render: (machine) => machine.range ?? '—' },
        { key: 'operation_date', header: 'Operation Date', render: (machine) => machine.operation_date ?? '—' },
        { key: 'status', header: 'Status', render: (machine) => <StatusBadge value={machine.status} /> },
      ]} />
      <RecordForm title="Add / Edit Machine">
        <label className="text-sm font-medium">Machine ID<input className="input mt-1" placeholder="TE1" /></label>
        <label className="text-sm font-medium">Machine Name<input className="input mt-1" placeholder="LOW TEMPERATURE CHAMBER" /></label>
        <label className="text-sm font-medium">Scope<input className="input mt-1" placeholder="REL" /></label>
        <label className="text-sm font-medium">Manufacturer<input className="input mt-1" placeholder="ESPEC" /></label>
        <label className="text-sm font-medium">Model<input className="input mt-1" /></label>
        <label className="text-sm font-medium">Serial Number<input className="input mt-1" /></label>
        <label className="text-sm font-medium">Range<input className="input mt-1" /></label>
        <label className="text-sm font-medium">Status<select className="input mt-1"><option>Active</option><option>Inactive</option><option>Maintenance</option><option>Down</option></select></label>
      </RecordForm>
    </div>
  );
}
