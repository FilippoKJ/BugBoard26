import { NavLink } from 'react-router-dom';

export function MobileNav({ isAdmin }) {
  const links = [['/issues', 'Issue'], ...(isAdmin ? [['/archived', 'Archivio'], ['/users', 'Utenti']] : [])];
  return <nav className="fixed inset-x-4 bottom-4 z-30 flex justify-around rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-card backdrop-blur md:hidden" aria-label="Navigazione mobile">{links.map(([to, label]) => <NavLink key={to} to={to} className={({ isActive }) => `rounded-xl px-4 py-2 text-sm font-bold ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600'}`}>{label}</NavLink>)}</nav>;
}
