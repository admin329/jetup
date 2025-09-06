import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MembershipPage from './pages/MembershipPage';
import SupportPage from './pages/SupportPage';
import AircraftsPage from './pages/AircraftsPage';
import RoutesPage from './pages/RoutesPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import OperatorDashboard from './pages/operator/OperatorDashboard';
import OperatorInfoPage from './pages/OperatorInfoPage';
import FleetGuidePage from './pages/FleetGuidePage';
import UnsubscribePage from './pages/UnsubscribePage';
import BookingPage from './pages/BookingPage';
import LegalPage from './pages/LegalPage';
import CookiesPage from './pages/CookiesPage';
import DisclaimerPage from './pages/DisclaimerPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import CharterTermsPage from './pages/CharterTermsPage';
import EmailConfirmationPage from './pages/EmailConfirmationPage';
import EmailSetupInstructions from './pages/EmailSetupInstructions';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ExperiencePage from './pages/ExperiencePage';
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/support" element={<SupportPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms-of-use" element={<TermsOfUsePage />} />
          <Route path="/charter-terms" element={<CharterTermsPage />} />
          <Route path="/email-setup" element={<EmailSetupInstructions />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route 
            path="/booking" 
            element={
              <PrivateRoute>
                <BookingPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              <PrivateRoute requiredRole="admin">
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/customer/*" 
            element={
              <PrivateRoute requiredRole="customer">
                <CustomerDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/operator/*" 
            element={
              <PrivateRoute requiredRole="operator">
                <OperatorDashboard />
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
};

export default App;
