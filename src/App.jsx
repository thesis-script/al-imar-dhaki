import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToastProvider } from './components/ui/Toast';
import { ProtectedRoute } from './routes/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Terrains from './pages/Terrains';
import Projets from './pages/Projets';
import SGY from './pages/SGY';
import Historique from './pages/Historique';
import Documents from './pages/Documents';
import Marketplace from './pages/Marketplace';
import Participation from './pages/Participation';
import EDD from './pages/EDD';
import Profil from './pages/Profil';
import Parametres from './pages/Parametres';
import Admin from './pages/admin/Admin';
import AdminQuestionnaire from './pages/admin/AdminQuestionnaire';
import AdminEvaluations from './pages/admin/AdminEvaluations';

export default function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/app" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="terrains" element={<Terrains />} />
                  <Route path="projets" element={<Projets />} />
                  <Route path="sgy" element={<SGY />} />
                  <Route path="historique" element={<Historique />} />
                  <Route path="documents" element={<Documents />} />
                  <Route path="marketplace" element={<Marketplace />} />
                  <Route path="participation" element={<Participation />} />
                  <Route path="edd" element={<EDD />} />
                  <Route path="profil" element={<Profil />} />
                  <Route path="parametres" element={<ProtectedRoute adminOnly><Parametres /></ProtectedRoute>} />
                  <Route path="admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
                  <Route path="admin/questionnaires" element={<ProtectedRoute adminOnly><AdminQuestionnaire /></ProtectedRoute>} />
                  <Route path="admin/evaluations" element={<ProtectedRoute adminOnly><AdminEvaluations /></ProtectedRoute>} />
                </Route>
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </BrowserRouter>
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}
