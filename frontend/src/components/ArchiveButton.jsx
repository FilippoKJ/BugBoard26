import { useState } from 'react';

export function ArchiveButton({ onArchive }) {
  const [busy, setBusy] = useState(false);
  async function archive() {
    if (!window.confirm('Archiviare questa issue? I dati e i commenti resteranno disponibili.')) return;
    setBusy(true); try { await onArchive(); } finally { setBusy(false); }
  }
  return <button className="btn-secondary border-red-200 text-red-700 hover:bg-red-50" onClick={archive} disabled={busy}>{busy ? 'Archiviazione…' : 'Archivia issue'}</button>;
}
