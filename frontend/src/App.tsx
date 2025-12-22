import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import VesselsPage from './pages/VesselsPage';
import DocumentsPage from './pages/DocumentsPage';
import CertificatesPage from './pages/CertificatesPage';
import CrewPage from './pages/CrewPage';
import CrewDetailPage from './pages/CrewDetailPage';
import CrewRotationPage from './pages/CrewRotationPage';
import InventoryPage from './pages/InventoryPage';
import InventoryTransactionsPage from './pages/InventoryTransactionsPage';
import ProcurementPage from './pages/ProcurementPage';
import ProcurementOrdersPage from './pages/ProcurementOrdersPage';
import SuppliersPage from './pages/SuppliersPage';
import MaintenancePage from './pages/MaintenancePage';
import WorkOrdersPage from './pages/WorkOrdersPage';
import VoyagesPage from './pages/VoyagesPage';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import MockModeIndicator from './components/MockModeIndicator';

// Check if mock mode is active
const isMockMode = () => {
  return import.meta.env.VITE_USE_MOCK_API === 'true' || import.meta.env.MODE === 'development';
};

function App() {
  // In mock mode, redirect login to dashboard
  const shouldRedirectLogin = isMockMode();

  return (
    <BrowserRouter>
      <MockModeIndicator />
      <Routes>
        {shouldRedirectLogin ? (
          <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        ) : (
          <Route path="/login" element={<LoginPage />} />
        )}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="vessels" element={<VesselsPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="certificates" element={<CertificatesPage />} />
          <Route path="crew" element={<CrewPage />} />
          <Route path="crew/:id" element={<CrewDetailPage />} />
          <Route path="crew-rotation" element={<CrewRotationPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="inventory/transactions" element={<InventoryTransactionsPage />} />
          <Route path="procurement" element={<ProcurementPage />} />
          <Route path="procurement/orders" element={<ProcurementOrdersPage />} />
          <Route path="procurement/suppliers" element={<SuppliersPage />} />
          <Route path="maintenance" element={<MaintenancePage />} />
          <Route path="maintenance/work-orders" element={<WorkOrdersPage />} />
          <Route path="voyages" element={<VoyagesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

