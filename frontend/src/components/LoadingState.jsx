export function LoadingState({ label = 'Caricamento…' }) {
  return <div className="panel grid min-h-48 place-items-center text-slate-500"><div className="text-center"><span className="mx-auto mb-3 block h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600" /><p>{label}</p></div></div>;
}
