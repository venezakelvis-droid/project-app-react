import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { Role } from '@/types';

interface Props {
  requireRole?: Role;
}

export function ProtectedRoute({ requireRole }: Props) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (requireRole && user.role !== requireRole) return <Navigate to="/app" replace />;
  return <Outlet />;
}
