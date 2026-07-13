import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState.jsx';
import { ErrorBanner } from '../components/ErrorBanner.jsx';
import { IssueCard } from '../components/IssueCard.jsx';
import { IssueFilters } from '../components/IssueFilters.jsx';
import { LoadingState } from '../components/LoadingState.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { createIssueApi } from '../api/issueApi.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

const initialFilters = { type: '', status: '', priority: '', sortBy: 'createdAt', sortOrder: 'desc' };

export function IssueListPage() {
  useDocumentTitle('Issue');
  const { client } = useAuth(); const api = useMemo(() => createIssueApi(client), [client]);
  const [filters, setFilters] = useState(initialFilters); const [issues, setIssues] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(null);
  const load = useCallback(async () => { setLoading(true); setError(null); try { const result = await api.list(filters); setIssues(result.issues); } catch (error_) { setError(error_); } finally { setLoading(false); } }, [api, filters]);
  useEffect(() => { load(); }, [load]);
  let content;
  if (loading) {
    content = <LoadingState label="Caricamento issue…" />;
  } else if (issues.length) {
    content = <div className="grid gap-5 lg:grid-cols-2">{issues.map((issue) => <IssueCard key={issue.id} issue={issue} />)}</div>;
  } else {
    content = <EmptyState title="Nessuna issue corrisponde ai filtri" description="Modifica i filtri oppure crea la prima issue." />;
  }
  return <><PageHeader eyebrow="Bacheca attiva" title="Issue del progetto" description="Filtra il lavoro aperto e apri una scheda per partecipare alla discussione." actions={<Link className="btn-primary" to="/issues/new">+ Nuova issue</Link>} /><IssueFilters filters={filters} onChange={setFilters} /><ErrorBanner error={error} />{content}</>;
}
