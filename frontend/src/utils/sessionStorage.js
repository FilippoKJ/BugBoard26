const storageKey = 'bugboard26.session';

export function readStoredSession() {
  try { return JSON.parse(localStorage.getItem(storageKey)) ?? null; }
  catch { localStorage.removeItem(storageKey); return null; }
}

export function storeSession(session) {
  localStorage.setItem(storageKey, JSON.stringify(session));
}

export function clearStoredSession() {
  localStorage.removeItem(storageKey);
}
