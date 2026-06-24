import { useState } from 'react';

export function CommentForm({ onSubmit, disabled }) {
  const [text, setText] = useState(''); const [busy, setBusy] = useState(false); const [error, setError] = useState(null);
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError(null);
    try { await onSubmit(text); setText(''); } catch (caught) { setError(caught); } finally { setBusy(false); }
  }
  if (disabled) return <p className="rounded-xl bg-slate-100 p-4 text-sm text-slate-600">Questa issue è archiviata e non accetta nuovi commenti.</p>;
  return <form onSubmit={submit}><label><span className="label">Aggiungi un commento</span><textarea className="field min-h-24" required maxLength="2000" value={text} onChange={(e) => setText(e.target.value)} /></label>{error && <p className="mt-2 text-sm text-red-700">{error.message}</p>}<div className="mt-3 flex justify-end"><button className="btn-primary" disabled={busy || !text.trim()}>{busy ? 'Invio…' : 'Pubblica commento'}</button></div></form>;
}
