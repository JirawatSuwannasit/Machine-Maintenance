import { PageHeader } from '@/components/PageHeader';

export default function Page() {
  return <div className="space-y-6"><PageHeader title="Settings" description="Reference values and internal role configuration for the maintenance system." /><section className="card p-5"><h2 className="font-semibold">Reference Values</h2><p className="mt-2 text-sm text-slate-600">Defaults from the prototype are preserved: action types Repair, Part Replacement, PM; severity Low, Medium, High, Critical; defect statuses Pending and Resolved; schedule statuses OK, DUE_SOON, OVERDUE.</p></section><section className="card p-5"><h2 className="font-semibold">Authentication & Roles</h2><p className="mt-2 text-sm text-slate-600">Supabase Auth users are extended by profiles with admin, technician, and viewer roles. RLS lets authenticated users read records and lets admins/technicians write operational data.</p></section></div>;
}
