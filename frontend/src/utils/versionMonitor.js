const VERSION_PATH = '/version.json';
const CHECK_INTERVAL_MS = 15_000;

export async function checkForFrontendUpdate({
  currentVersion,
  fetchImpl = window.fetch.bind(window),
  location = window.location,
  now = Date.now
}) {
  const response = await fetchImpl(`${VERSION_PATH}?t=${now()}`, { cache: 'no-store' });
  if (!response.ok) return false;

  const manifest = await response.json();
  if (!manifest.version || manifest.version === currentVersion) return false;

  const nextUrl = new URL(location.href);
  nextUrl.searchParams.set('build', manifest.version);
  location.replace(nextUrl.toString());
  return true;
}

export function startVersionMonitor(currentVersion) {
  let checking = false;

  async function check() {
    if (checking) return;
    checking = true;
    try {
      await checkForFrontendUpdate({ currentVersion });
    } catch {
      // A temporary network error must not interrupt the current session.
    } finally {
      checking = false;
    }
  }

  const interval = window.setInterval(check, CHECK_INTERVAL_MS);
  const checkWhenVisible = () => {
    if (document.visibilityState === 'visible') check();
  };

  window.addEventListener('focus', check);
  document.addEventListener('visibilitychange', checkWhenVisible);
  check();

  return () => {
    window.clearInterval(interval);
    window.removeEventListener('focus', check);
    document.removeEventListener('visibilitychange', checkWhenVisible);
  };
}
