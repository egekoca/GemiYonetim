import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Check if mock mode is active
const isMockMode = () => {
  return import.meta.env.VITE_USE_MOCK_API === 'true' || import.meta.env.MODE === 'development';
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, login } = useAuthStore();

  useEffect(() => {
    // Auto-login in mock mode if not authenticated
    if (isMockMode() && !isAuthenticated) {
      // Auto-login with admin user
      login('mock-token-admin', {
        id: '1',
        email: 'admin@gmys.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'SYSTEM_ADMIN',
        vesselId: undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isAuthenticated && !isMockMode()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

