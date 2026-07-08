export function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('it-IT', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value.endsWith?.('Z') ? value : `${value}Z`));
}
