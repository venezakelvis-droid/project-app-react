import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import UserDashboard from "./pages/UserDashboard.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminRehearsals from "./pages/admin/AdminRehearsals.tsx";
import AdminAttendance from "./pages/admin/AdminAttendance.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner theme="dark" richColors position="top-right" />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />

            {/* User area */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/app" element={<UserDashboard />} />
              </Route>
            </Route>

            {/* Admin area */}
            <Route element={<ProtectedRoute requireRole="admin" />}>
              <Route element={<DashboardLayout admin />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/rehearsals" element={<AdminRehearsals />} />
                <Route path="/admin/attendance" element={<AdminAttendance />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
