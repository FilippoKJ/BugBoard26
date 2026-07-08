import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatDate.js';
import { issueTypeLabels, priorityLabels, statusLabels } from '../utils/issueLabels.js';
import { IssueBadge } from './IssueBadge.jsx';

export function IssueCard({ issue }) {
  return (
    <Link to={`/issues/${issue.id}`} className="panel block transition hover:-translate-y-0.5 hover:border-brand-500/30">
      <div className="mb-4 flex items-start justify-between gap-4"><div><p className="mb-1 text-xs font-bold uppercase tracking-wider text-brand-600">#{issue.id} · {issueTypeLabels[issue.type]}</p><h2 className="text-lg font-extrabold leading-snug">{issue.title}</h2></div><IssueBadge value={issue.priority} label={priorityLabels[issue.priority]} /></div>
      <p className="mb-5 line-clamp-2 text-sm leading-6 text-slate-600">{issue.description}</p>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4"><IssueBadge value={issue.status} label={statusLabels[issue.status]} /><p className="text-xs text-slate-500">{issue.authorEmail} · {formatDate(issue.createdAt)}</p></div>
    </Link>
  );
}
