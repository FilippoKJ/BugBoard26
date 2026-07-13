import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { ArchivedIssuesPage } from './pages/ArchivedIssuesPage.jsx';
import { CreateIssuePage } from './pages/CreateIssuePage.jsx';
import { IssueDetailPage } from './pages/IssueDetailPage.jsx';
import { IssueListPage } from './pages/IssueListPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';
import { UserManagementPage } from './pages/UserManagementPage.jsx';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/issues" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/issues" element={<IssueListPage />} />
          <Route path="/issues/new" element={<CreateIssuePage />} />
          <Route path="/issues/:id" element={<IssueDetailPage />} />
          <Route path="/archived" element={<ArchivedIssuesPage />} />
          <Route element={<ProtectedRoute role="ADMIN" />}>
            <Route path="/users" element={<UserManagementPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
