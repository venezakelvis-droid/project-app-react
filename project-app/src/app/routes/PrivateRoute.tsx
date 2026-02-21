import { Navigate } from "react-router-dom";
import { paths } from "./paths";

interface Props {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: Props) {
  const isAuthenticated = !!localStorage.getItem("token");

  if (!isAuthenticated) {
    return <Navigate to={paths.login} replace />;
  }

  return <>{children}</>;
}