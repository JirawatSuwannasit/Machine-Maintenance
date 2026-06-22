'use client';

import type { ReactNode } from 'react';

export function RecordForm({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">Client-side form shell ready for Supabase server actions.</p>
        </div>
        <button type="button" className="btn-secondary" onClick={() => window.confirm('Discard unsaved changes?')}>Reset</button>
      </div>
      <form className="grid gap-4 md:grid-cols-2">
        {children}
        <div className="md:col-span-2 flex justify-end gap-2">
          <button type="button" className="btn-secondary">Cancel</button>
          <button type="button" className="btn-primary">Save</button>
        </div>
      </form>
    </section>
  );
}
