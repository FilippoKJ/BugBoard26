import { useMemo } from 'react';
import { createIssueApi } from '../api/issueApi.js';
import { useAuth } from '../contexts/AuthContext.jsx';

export function useIssueApi() {
  const { client } = useAuth();
  return useMemo(() => createIssueApi(client), [client]);
}
