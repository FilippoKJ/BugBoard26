import { useMemo } from 'react';
import { createUserApi } from '../api/userApi.js';
import { CreateUserForm } from '../components/CreateUserForm.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export function UserManagementPage() {
  useDocumentTitle('Gestione utenti');
  const { client } = useAuth(); const api = useMemo(() => createUserApi(client), [client]);
  return <><PageHeader eyebrow="Area amministrativa" title="Crea un utente" description="Gli account vengono creati esclusivamente da un amministratore. La password è trasmessa via HTTPS in produzione e memorizzata solo come hash." /><CreateUserForm onSubmit={async (form) => (await api.create(form)).user} /></>;
}
