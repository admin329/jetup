import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import { initializeEnvironment } from './config/environment';
import { setupGlobalErrorHandler } from './utils/errorHandler';
import { initializeSecurity } from './utils/security';
import { initializeTwoFactorService } from './services/twoFactorService';
import { AuthProvider } from './contexts/AuthContext';
import { InvoiceProvider } from './contexts/InvoiceContext';
import { SupabaseAuthProvider } from './contexts/SupabaseAuthContext';

// Initialize production environment
initializeEnvironment();
setupGlobalErrorHandler();
initializeSecurity();
initializeTwoFactorService();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <SupabaseAuthProvider>
        <AuthProvider>
          <InvoiceProvider>
            <App />
          </InvoiceProvider>
        </AuthProvider>
      </SupabaseAuthProvider>
    </HelmetProvider>
  </StrictMode>
);
