import { DataTable } from '@/components/DataTable';
import { PageHeader } from '@/components/PageHeader';
import { RecordForm } from '@/components/RecordForm';
import { getData } from '@/lib/data';

export default async function Page() {
  const data = await getData();
  return <div className="space-y-6"><PageHeader title="Spare Part Master" description="Master data for prototype Spare_Parts_Master. Lifetime years are stored as lifetime months for accurate next-due calculations." /><div className="flex gap-2"><input className="input max-w-md" placeholder="Search part ID or name..." /><button className="btn-primary">Add Part</button></div><DataTable rows={data.spareParts} columns={[{ key: 'code', header: 'Part ID', render: (part) => part.part_code }, { key: 'name', header: 'Part Name', render: (part) => part.name }, { key: 'life', header: 'Lifetime', render: (part) => `${part.lifetime_months} months` }, { key: 'description', header: 'Description', render: (part) => part.description ?? '—' }, { key: 'active', header: 'Active', render: (part) => part.is_active ? 'Yes' : 'No' }]} /><RecordForm title="Add / Edit Spare Part"><label className="text-sm font-medium">Part ID<input className="input mt-1" placeholder="SP-01" /></label><label className="text-sm font-medium">Part Name<input className="input mt-1" /></label><label className="text-sm font-medium">Lifetime Months<input className="input mt-1" type="number" min="1" /></label><label className="text-sm font-medium">Description<input className="input mt-1" /></label></RecordForm></div>;
}
