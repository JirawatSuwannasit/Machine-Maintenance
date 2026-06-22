import type { ReactNode } from 'react';

export type DataColumn<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
};

export function DataTable<T>({ columns, rows, empty = 'No records found.' }: { columns: DataColumn<T>[]; rows: T[]; empty?: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full">
        <thead className="table-head">
          <tr>{columns.map((column) => <th key={column.key} className="px-4 py-3">{column.header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length ? rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => <td className={`table-cell ${column.className ?? ''}`} key={column.key}>{column.render(row)}</td>)}
            </tr>
          )) : (
            <tr><td className="px-4 py-10 text-center text-sm text-slate-500" colSpan={columns.length}>{empty}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
