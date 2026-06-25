export function ErrorBanner({ error }) {
  if (!error) return null;
  return <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{error.message ?? String(error)}</div>;
}
