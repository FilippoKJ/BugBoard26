export function RoleBadge({ role }) {
  const admin = role === 'ADMIN';
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-black tracking-wide ${admin ? 'bg-amber-100 text-amber-800' : 'bg-brand-50 text-brand-700'}`}>{role}</span>;
}
