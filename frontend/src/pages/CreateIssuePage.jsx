import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createIssueApi } from '../api/issueApi.js';
import { CreateIssueForm } from '../components/CreateIssueForm.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export function CreateIssuePage() {
  useDocumentTitle('Nuova issue');
  const navigate = useNavigate();
  const { client } = useAuth();
  const api = useMemo(() => createIssueApi(client), [client]);

  async function create(issue) {
    const result = await api.create(issue);
    navigate(`/issues/${result.issue.id}`, { replace: true });
  }

  return (
    <>
      <Link to="/issues" className="mb-5 inline-block text-sm font-bold text-brand-700">
        ← Torna alla lista
      </Link>
      <CreateIssueForm onSubmit={create} onCancel={() => navigate('/issues')} />
    </>
  );
}
