import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { prepareBrowser } from './utils/browserStartup.js';
import './styles.css';

async function startApplication() {
  if (!await prepareBrowser()) return;

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  );
}

startApplication();
