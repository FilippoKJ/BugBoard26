export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">{eyebrow}</p><h1 className="text-3xl font-black tracking-tight sm:text-4xl">{title}</h1>{description && <p className="mt-2 max-w-2xl text-slate-600">{description}</p>}</div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
