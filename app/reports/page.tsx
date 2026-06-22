import { Dashboard } from '@/components/Dashboard';
import { PageHeader } from '@/components/PageHeader';

export default function Page() {
  return <div className="space-y-4"><PageHeader title="Reports / KPI Summary" description="Date-filterable management report area for availability, MTBF, MTTR, breakdown rate, PM completion, overdue PM, and spare parts due." /><div className="card flex flex-wrap gap-3 p-4"><input className="input max-w-48" type="date" aria-label="Start date" /><input className="input max-w-48" type="date" aria-label="End date" /><button className="btn-primary">Apply Date Filter</button><button className="btn-secondary">Export CSV</button></div><Dashboard /></div>;
}
