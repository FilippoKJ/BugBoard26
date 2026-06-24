import { useState } from 'react';

const initial = { title: '', description: '', type: 'BUG', priority: 'MEDIUM' };

export function CreateIssueForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError(null);
    try { await onSubmit(form); setForm(initial); } catch (caught) { setError(caught); } finally { setBusy(false); }
  }
  return (
    <form onSubmit={submit} className="panel mb-6" aria-label="Crea issue">
      <div className="mb-5 flex items-center justify-between"><div><h2 className="text-xl font-extrabold">Nuova issue</h2><p className="text-sm text-slate-500">Descrivi un elemento da discutere con il team.</p></div><button type="button" onClick={onCancel} className="text-2xl text-slate-400" aria-label="Chiudi">×</button></div>
      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error.message}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2"><span className="label">Titolo</span><input className="field" maxLength="150" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
        <label className="sm:col-span-2"><span className="label">Descrizione</span><textarea className="field min-h-28 resize-y" maxLength="5000" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        <label><span className="label">Tipo</span><select className="field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="QUESTION">Domanda</option><option value="BUG">Bug</option><option value="DOCUMENTATION">Documentazione</option><option value="FEATURE">Funzionalità</option></select></label>
        <label><span className="label">Priorità</span><select className="field" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><option value="LOW">Bassa</option><option value="MEDIUM">Media</option><option value="HIGH">Alta</option><option value="CRITICAL">Critica</option></select></label>
      </div>
      <div className="mt-5 flex justify-end gap-3"><button type="button" className="btn-secondary" onClick={onCancel}>Annulla</button><button className="btn-primary" disabled={busy}>{busy ? 'Creazione…' : 'Crea issue'}</button></div>
    </form>
  );
}
