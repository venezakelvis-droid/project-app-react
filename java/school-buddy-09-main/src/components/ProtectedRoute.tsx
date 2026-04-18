import { Navigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

const ProtectedRoute = ({ roles, children }: { roles: string[]; children: React.ReactNode }) => {
  const { token, role } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (role && !roles.includes(role)) return <Navigate to={`/${role}`} replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
