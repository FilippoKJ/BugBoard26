import { useEffect, useState } from 'react';
import { EmptyState } from '../components/EmptyState.jsx';
import { ErrorBanner } from '../components/ErrorBanner.jsx';
import { IssueCard } from '../components/IssueCard.jsx';
import { LoadingState } from '../components/LoadingState.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { useIssueApi } from '../hooks/useIssueApi.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export function ArchivedIssuesPage() {
  useDocumentTitle('Archivio');
  const api = useIssueApi(); const [state, setState] = useState({ loading: true, issues: [], error: null });
  useEffect(() => { api.listArchived().then(({ issues }) => setState({ loading: false, issues, error: null })).catch((error) => setState({ loading: false, issues: [], error })); }, [api]);
  let content;
  if (state.loading) {
    content = <LoadingState />;
  } else if (state.issues.length) {
    content = <div className="grid gap-5 lg:grid-cols-2">{state.issues.map((issue) => <IssueCard key={issue.id} issue={issue} />)}</div>;
  } else {
    content = <EmptyState title="Archivio vuoto" description="Le issue archiviate appariranno qui." />;
  }
  return <><PageHeader eyebrow="Storico del progetto" title="Archivio" description="Le issue concluse o non più rilevanti restano consultabili insieme ai commenti." /><ErrorBanner error={state.error} />{content}</>;
}
