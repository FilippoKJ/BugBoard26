export function EmptyState({ title, description }) {
  return <div className="panel grid min-h-52 place-items-center text-center"><div><div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-xl">✓</div><h2 className="text-lg font-bold">{title}</h2><p className="mt-1 text-sm text-slate-500">{description}</p></div></div>;
}
