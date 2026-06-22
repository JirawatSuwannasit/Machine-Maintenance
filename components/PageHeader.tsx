export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-950">{title}</h1>
      <p className="mt-1 max-w-3xl text-sm text-slate-600">{description}</p>
    </div>
  );
}
