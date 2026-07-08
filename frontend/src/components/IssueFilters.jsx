import { issuePriorityOptions, issueStatusOptions, issueTypeOptions } from '../constants/issueOptions.js';

const options = { type: issueTypeOptions, status: issueStatusOptions, priority: issuePriorityOptions };

export function IssueFilters({ filters, onChange }) {
  return (
    <div className="panel mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {Object.entries(options).map(([name, values]) => <select key={name} className="field" value={filters[name]} onChange={(event) => onChange({ ...filters, [name]: event.target.value })} aria-label={name}>{values.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>)}
      <select className="field" value={filters.sortBy} onChange={(event) => onChange({ ...filters, sortBy: event.target.value })} aria-label="Ordina per"><option value="createdAt">Data</option><option value="priority">Priorità</option></select>
      <select className="field" value={filters.sortOrder} onChange={(event) => onChange({ ...filters, sortOrder: event.target.value })} aria-label="Direzione"><option value="desc">Decrescente</option><option value="asc">Crescente</option></select>
    </div>
  );
}
