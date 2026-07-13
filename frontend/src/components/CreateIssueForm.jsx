import { useState } from 'react';

const initial = {
  title: '',
  description: '',
  type: 'BUG',
  priority: 'MEDIUM',
  image: null
};
const MAX_IMAGE_SIZE = 3 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Impossibile leggere l\'immagine selezionata'));
        return;
      }
      const separator = reader.result.indexOf(',');
      if (separator === -1) {
        reject(new Error('Il contenuto dell\'immagine non è valido'));
        return;
      }
      const data = reader.result.slice(separator + 1);
      resolve({ fileName: file.name, mimeType: file.type, data });
    };
    reader.onerror = () => reject(new Error('Impossibile leggere l\'immagine selezionata'));
    reader.readAsDataURL(file);
  });
}

export function CreateIssueForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  async function selectImage(event) {
    const [file] = event.target.files;
    setError(null);
    if (!file) {
      setForm({ ...form, image: null });
      return;
    }
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      event.target.value = '';
      setError(new Error('Formato non supportato. Usa PNG, JPEG, WebP o GIF.'));
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      event.target.value = '';
      setError(new Error('L\'immagine non può superare 3 MB.'));
      return;
    }
    try {
      setForm({ ...form, image: await readImage(file) });
    } catch (error_) {
      event.target.value = '';
      setError(error_);
    }
  }
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError(null);
    try { await onSubmit(form); setForm(initial); } catch (error_) { setError(error_); } finally { setBusy(false); }
  }
  return (
    <form onSubmit={submit} className="panel mb-6 min-w-0 p-4 sm:p-5" aria-label="Crea issue">
      <div className="mb-5 flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="text-xl font-extrabold">Nuova issue</h2><p className="text-sm text-slate-500">Descrivi un elemento da discutere con il team.</p></div><button type="button" onClick={onCancel} className="-mr-2 -mt-2 grid h-10 w-10 shrink-0 place-items-center text-2xl text-slate-400" aria-label="Chiudi">×</button></div>
      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error.message}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2"><span className="label">Titolo</span><input className="field" maxLength="150" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
        <label className="sm:col-span-2">
          <span className="label">Immagine (opzionale)</span>
          <input
            className="field min-w-0 max-w-full overflow-hidden file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:font-semibold file:text-brand-700"
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(',')}
            onChange={selectImage}
          />
          <span className="mt-1.5 block text-xs text-slate-500">PNG, JPEG, WebP o GIF, massimo 3 MB.</span>
        </label>
        <label className="sm:col-span-2"><span className="label">Descrizione</span><textarea className="field min-h-28 resize-y" maxLength="5000" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        <label><span className="label">Tipo</span><select className="field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="QUESTION">Domanda</option><option value="BUG">Bug</option><option value="DOCUMENTATION">Documentazione</option><option value="FEATURE">Funzionalità</option></select></label>
        <label><span className="label">Priorità</span><select className="field" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><option value="LOW">Bassa</option><option value="MEDIUM">Media</option><option value="HIGH">Alta</option><option value="CRITICAL">Critica</option></select></label>
      </div>
      {form.image && (
        <figure className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3">
          <img
            className="max-h-64 w-full rounded-lg object-contain"
            src={`data:${form.image.mimeType};base64,${form.image.data}`}
            alt="Anteprima dell'immagine selezionata"
          />
          <figcaption className="mt-2 truncate text-xs text-slate-500">{form.image.fileName}</figcaption>
        </figure>
      )}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end"><button type="button" className="btn-secondary w-full sm:w-auto" onClick={onCancel}>Annulla</button><button className="btn-primary w-full sm:w-auto" disabled={busy}>{busy ? 'Creazione…' : 'Crea issue'}</button></div>
    </form>
  );
}
