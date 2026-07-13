import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Logo } from './Logo.jsx';
import { MobileNav } from './MobileNav.jsx';
import { RoleBadge } from './RoleBadge.jsx';

const navClass = ({ isActive }) => `rounded-lg px-3 py-2 text-sm font-semibold transition ${
  isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
}`;

export function AppShell() {
  const { session, logout } = useAuth();
  const isAdmin = session.user.role === 'ADMIN';
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-6 sm:px-5 sm:py-4">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Navigazione principale">
            <NavLink to="/issues" className={navClass}>Issue</NavLink>
            <NavLink to="/archived" className={navClass}>Archivio</NavLink>
            {isAdmin && <NavLink to="/users" className={navClass}>Utenti</NavLink>}
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block"><p className="text-sm font-semibold">{session.user.email}</p><RoleBadge role={session.user.role} /></div>
            <button className="btn-secondary !px-3 !py-2 text-sm" onClick={logout}>Esci</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 pb-24 sm:px-5 sm:py-8 md:pb-8"><Outlet /></main>
      <MobileNav isAdmin={isAdmin} />
    </div>
  );
}
