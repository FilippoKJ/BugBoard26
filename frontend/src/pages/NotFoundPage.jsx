import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return <main className="grid min-h-screen place-items-center p-6 text-center"><div><p className="text-7xl font-black text-brand-600">404</p><h1 className="mt-3 text-2xl font-extrabold">Pagina non trovata</h1><p className="mt-2 text-slate-500">Il percorso richiesto non fa parte di BugBoard26.</p><Link className="btn-primary mt-6" to="/issues">Torna alle issue</Link></div></main>;
}
