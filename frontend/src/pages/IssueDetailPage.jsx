import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createIssueApi } from '../api/issueApi.js';
import { ArchiveButton } from '../components/ArchiveButton.jsx';
import { CommentForm } from '../components/CommentForm.jsx';
import { CommentList } from '../components/CommentList.jsx';
import { ErrorBanner } from '../components/ErrorBanner.jsx';
import { IssueBadge } from '../components/IssueBadge.jsx';
import { LoadingState } from '../components/LoadingState.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { formatDate } from '../utils/formatDate.js';
import { issueTypeLabels, priorityLabels, statusLabels } from '../utils/issueLabels.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export function IssueDetailPage() {
  useDocumentTitle('Dettaglio issue');
  const { id } = useParams(); const navigate = useNavigate(); const { client, session } = useAuth(); const api = useMemo(() => createIssueApi(client), [client]);
  const [issue, setIssue] = useState(null); const [comments, setComments] = useState([]); const [error, setError] = useState(null); const [loading, setLoading] = useState(true);
  const load = useCallback(async () => { setLoading(true); setError(null); try { const [issueResult, commentResult] = await Promise.all([api.getById(id), api.listComments(id)]); setIssue(issueResult.issue); setComments(commentResult.comments); } catch (caught) { setError(caught); } finally { setLoading(false); } }, [api, id]);
  useEffect(() => { load(); }, [load]);
  async function addComment(text) { const result = await api.addComment(id, text); setComments((items) => [...items, result.comment]); }
  async function archive() { await api.archive(id); navigate('/archived'); }
  if (loading) return <LoadingState label="Apertura issue…" />;
  if (error || !issue) return <ErrorBanner error={error ?? new Error('Issue non disponibile')} />;
  return <><Link to={issue.archived ? '/archived' : '/issues'} className="mb-5 inline-block text-sm font-bold text-brand-700">← Torna alla lista</Link><div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"><section className="panel"><div className="mb-5 flex flex-wrap items-center gap-2"><span className="text-sm font-black text-brand-700">#{issue.id}</span><IssueBadge value={issue.type} label={issueTypeLabels[issue.type]} /><IssueBadge value={issue.status} label={statusLabels[issue.status]} /><IssueBadge value={issue.priority} label={priorityLabels[issue.priority]} /></div><h1 className="text-3xl font-black leading-tight">{issue.title}</h1><p className="mt-5 whitespace-pre-wrap leading-7 text-slate-700">{issue.description}</p><dl className="mt-8 grid gap-4 border-t border-slate-100 pt-5 text-sm sm:grid-cols-2"><div><dt className="text-slate-500">Autore</dt><dd className="font-semibold">{issue.authorEmail}</dd></div><div><dt className="text-slate-500">Creata</dt><dd className="font-semibold">{formatDate(issue.createdAt)}</dd></div></dl>{session.user.role === 'ADMIN' && !issue.archived && <div className="mt-6"><ArchiveButton onArchive={archive} /></div>}</section><aside className="panel h-fit"><h2 className="mb-4 text-xl font-extrabold">Discussione <span className="text-slate-400">{comments.length}</span></h2><CommentList comments={comments} /><div className="mt-5 border-t border-slate-100 pt-5"><CommentForm onSubmit={addComment} disabled={issue.archived} /></div></aside></div></>;
}
