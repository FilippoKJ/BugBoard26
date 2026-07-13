const ROOT_PATH = '/';
const ISSUES_PATH = '/issues';
const RELOAD_GUARD = 'bugboard26.legacy-worker-reload';

export function normalizeInitialPath(location = window.location, history = window.history) {
  if (location.pathname !== ROOT_PATH) return false;

  history.replaceState(
    history.state,
    '',
    `${ISSUES_PATH}${location.search}${location.hash}`
  );
  return true;
}

function readReloadGuard() {
  try {
    return sessionStorage.getItem(RELOAD_GUARD) === '1';
  } catch {
    return false;
  }
}

function setReloadGuard() {
  try {
    sessionStorage.setItem(RELOAD_GUARD, '1');
    return true;
  } catch {
    return false;
  }
}

function clearReloadGuard() {
  try {
    sessionStorage.removeItem(RELOAD_GUARD);
  } catch {
    // Storage can be disabled without preventing the application from starting.
  }
}

async function removeLegacyServiceWorkers() {
  if (!('serviceWorker' in navigator)) return false;

  const registrations = await navigator.serviceWorker.getRegistrations();
  const results = await Promise.all(
    registrations.map((registration) => registration.unregister())
  );
  return results.some(Boolean);
}

async function clearLegacyCacheStorage() {
  if (!('caches' in window)) return false;

  const cacheNames = await window.caches.keys();
  const results = await Promise.all(
    cacheNames.map((cacheName) => window.caches.delete(cacheName))
  );
  return results.some(Boolean);
}

export async function prepareBrowser() {
  normalizeInitialPath();

  const wasControlled = Boolean(navigator.serviceWorker?.controller);
  let browserStateChanged = false;

  const results = await Promise.allSettled([
    removeLegacyServiceWorkers(),
    clearLegacyCacheStorage()
  ]);

  for (const result of results) {
    if (result.status === 'fulfilled') {
      browserStateChanged ||= result.value;
    } else {
      console.warn('Unable to clear legacy browser state', result.reason);
    }
  }

  if (wasControlled && browserStateChanged && !readReloadGuard() && setReloadGuard()) {
    window.location.reload();
    return false;
  }

  clearReloadGuard();
  return true;
}
