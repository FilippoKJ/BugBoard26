import { createContext, useContext, useMemo, useState } from 'react';
import { ApiClient } from '../api/client.js';
import { createAuthApi } from '../api/authApi.js';
import { clearStoredSession, readStoredSession, storeSession } from '../utils/sessionStorage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);
  const client = useMemo(() => new ApiClient(() => session?.token), [session?.token]);
  const authApi = useMemo(() => createAuthApi(client), [client]);

  async function login(email, password) {
    const nextSession = await authApi.login(email, password);
    storeSession(nextSession);
    setSession(nextSession);
  }

  function logout() {
    clearStoredSession();
    setSession(null);
  }

  const value = useMemo(() => ({ session, client, login, logout }), [session, client]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
