import { useState } from 'react';

export function CreateUserForm({ onSubmit }) {
  const [form, setForm] = useState({ email: '', password: '', role: 'USER' });
  const [state, setState] = useState({ busy: false, error: null, success: null });
  async function submit(event) {
    event.preventDefault(); setState({ busy: true, error: null, success: null });
    try { const user = await onSubmit(form); setState({ busy: false, error: null, success: `Creato ${user.email}` }); setForm({ email: '', password: '', role: 'USER' }); }
    catch (error) { setState({ busy: false, error, success: null }); }
  }
  return <form className="panel max-w-2xl" onSubmit={submit}><div className="grid gap-4 sm:grid-cols-2"><label className="sm:col-span-2"><span className="label">Email</span><input className="field" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label><label><span className="label">Password temporanea</span><input className="field" type="password" minLength="8" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label><label><span className="label">Ruolo</span><select className="field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="USER">Utente</option><option value="ADMIN">Amministratore</option></select></label></div>{state.error && <p className="mt-4 text-sm text-red-700">{state.error.message}</p>}{state.success && <p className="mt-4 text-sm font-semibold text-brand-700">{state.success}</p>}<button className="btn-primary mt-5" disabled={state.busy}>{state.busy ? 'Creazione…' : 'Crea utente'}</button></form>;
}
