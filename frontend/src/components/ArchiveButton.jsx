import { useState } from 'react';

export function ArchiveButton({ onArchive }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  async function archive() {
    if (!window.confirm('Archiviare questa issue? I dati e i commenti resteranno disponibili.')) return;
    setBusy(true);
    setError(null);
    try {
      await onArchive();
    } catch (error_) {
      setError(error_);
    } finally {
      setBusy(false);
    }
  }
  return <><button className="btn-secondary border-red-200 text-red-700 hover:bg-red-50" onClick={archive} disabled={busy}>{busy ? 'Archiviazione…' : 'Archivia issue'}</button>{error && <p role="alert" className="mt-3 text-sm text-red-700">{error.message}</p>}</>;
}
