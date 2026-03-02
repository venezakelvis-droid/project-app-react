import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { paths } from "./paths";
import { PrivateRoute } from "./PrivateRoute";
import MainLayout from "../../shared/layouts/MainLayout";

// Lazy loading
const Home = lazy(() => import("../../features/home/pages/Home"));
const Login = lazy(() => import("../../features/auth/pages/Login"));
//const Dashboard = lazy(() => import("@/features/dashboard/pages/Dashboard"));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Carregando...</div>}>
        <Routes>
          {/* Public */}
          <Route path={paths.login} element={<Login />} />

          {/* Private */}
          <Route
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route path={paths.home} element={<Home />} />
            <Route path="/order" element={<Home />} />
            <Route path="/breeding" element={<Home />} />
            <Route path="/logout" element={<Home />} />
          </Route>

          <Route path="*" element={<div>Página não encontrada</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}