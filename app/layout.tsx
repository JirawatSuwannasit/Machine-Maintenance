import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Machine History & Maintenance',
  description: 'Machine history, breakdown, spare part, and preventive maintenance management',
};

const navItems = [
  ['/dashboard', 'Dashboard'],
  ['/machines', 'Machine Master'],
  ['/breakdowns', 'Breakdowns'],
  ['/spare-parts', 'Spare Parts'],
  ['/replacements', 'Part Replacements'],
  ['/pm-plans', 'PM Plans'],
  ['/pm-records', 'PM Records'],
  ['/reports', 'Reports / KPIs'],
  ['/settings', 'Settings'],
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          <aside className="hidden w-72 border-r border-slate-200 bg-slate-950 text-white lg:block">
            <div className="border-b border-slate-800 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Industrial CMMS</p>
              <h1 className="mt-1 text-xl font-bold">Machine History</h1>
            </div>
            <nav className="space-y-1 px-3 py-4">
              {navItems.map(([href, label]) => <Link className="block rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-slate-800" href={href} key={href}>{label}</Link>)}
            </nav>
          </aside>
          <main className="flex-1">
            <div className="border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
              <div className="font-bold">Machine History</div>
              <div className="mt-2 flex gap-2 overflow-x-auto">
                {navItems.map(([href, label]) => <Link className="whitespace-nowrap rounded-lg bg-slate-100 px-3 py-1 text-xs" href={href} key={href}>{label}</Link>)}
              </div>
            </div>
            <div className="p-4 md:p-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
