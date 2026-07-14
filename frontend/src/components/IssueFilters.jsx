import { issuePriorityOptions, issueTypeOptions } from '../constants/issueOptions.js';

const options = { type: issueTypeOptions, priority: issuePriorityOptions };
const labels = { type: 'Tipologia', priority: 'Priorità' };

export function IssueFilters({ filters, onChange }) {
  return (
    <div className="panel mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {Object.entries(options).map(([name, values]) => (
        <label key={name}>
          <span className="label">{labels[name]}</span>
          <select className="field" value={filters[name]} onChange={(event) => onChange({ ...filters, [name]: event.target.value })}>
            {values.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
      ))}
      <label>
        <span className="label">Ordina per</span>
        <select className="field" value={filters.sortBy} onChange={(event) => onChange({ ...filters, sortBy: event.target.value })}>
          <option value="createdAt">Data</option>
          <option value="priority">Priorità</option>
        </select>
      </label>
      <label>
        <span className="label">Direzione</span>
        <select className="field" value={filters.sortOrder} onChange={(event) => onChange({ ...filters, sortOrder: event.target.value })}>
          <option value="desc">Decrescente</option>
          <option value="asc">Crescente</option>
        </select>
      </label>
    </div>
  );
}
