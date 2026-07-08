const tones = {
  CRITICAL: 'bg-red-100 text-red-800', HIGH: 'bg-orange-100 text-orange-800', MEDIUM: 'bg-amber-100 text-amber-800', LOW: 'bg-emerald-100 text-emerald-800',
  TODO: 'bg-slate-100 text-slate-700', IN_PROGRESS: 'bg-blue-100 text-blue-800', DONE: 'bg-emerald-100 text-emerald-800'
};

export function IssueBadge({ value, label }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${tones[value] ?? 'bg-violet-100 text-violet-800'}`}>{label ?? value}</span>;
}
