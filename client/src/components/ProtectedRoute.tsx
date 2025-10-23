import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
// import { Spinner } from '@/components/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h4>Loading...</h4>
      </div>
    );
  }

  if (!user) {
    // Redirect to login with the attempted URL
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const roleRoutes = {
      Administrator: '/Administrator',
      Doctor: '/Doctor',
      Patient: '/Patient',
    };
    return <Navigate to={roleRoutes[user.role as keyof typeof roleRoutes] || '/auth/login'} replace />;
  }

  return <>{children}</>;
}
