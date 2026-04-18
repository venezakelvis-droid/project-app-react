import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/auth/AuthContext";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";

// Dashboard pages
import StudentDashboard from "@/pages/dashboards/StudentDashboard";
import TeacherDashboard from "@/pages/dashboards/TeacherDashboard";
import AdminDashboard from "@/pages/dashboards/AdminDashboard";

// Students pages
import StudentsPage from "@/pages/students";
import CreateStudentPage from "@/pages/students/create";

// Teachers pages
import TeachersPage from "@/pages/teachers";
import CreateTeacherPage from "@/pages/teachers/create";

// Subjects pages
import SubjectsPage from "@/pages/subjects";
import CreateSubjectPage from "@/pages/subjects/create";

// Enrollments pages
import EnrollmentsPage from "@/pages/enrollments";
import CreateEnrollmentPage from "@/pages/enrollments/create";

// Grades pages
import CreateGradePage from "@/pages/grades/create";
import GradesListPage from "@/pages/grades";
import EditGradePage from "@/pages/grades/edit";

// Student pages
import StudentReportCardPage from "@/pages/students/report-card";
import StudentAttendancePage from "@/pages/students/attendance";
import StudentProfilePage from "@/pages/students/student-profile";

// Guardian pages
import GuardianDashboard from "@/pages/dashboards/GuardianDashboard";
import GuardianDependentsPage from "@/pages/guardians/DependentsPage";
import GuardianReportCardPage from "@/pages/guardians/ReportCardPage";
import GuardianAttendancePage from "@/pages/guardians/AttendancePage";

// Classes pages
import ClassesPage from "@/pages/classes";
import CreateClassPage from "@/pages/classes/create";

// Users pages
import UsersPage from "@/pages/users";
import CreateUserPage from "@/pages/users/create";

// Error pages
import NotFound from "@/pages/error/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <main className="mx-auto max-w-5xl px-6 py-8">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />

              {/* Dashboard routes */}
              <Route path="/student" element={<ProtectedRoute roles={["student"]}><StudentDashboard /></ProtectedRoute>} />
              <Route path="/student/report-card" element={<ProtectedRoute roles={["student"]}><StudentReportCardPage /></ProtectedRoute>} />
              <Route path="/student/attendance" element={<ProtectedRoute roles={["student"]}><StudentAttendancePage /></ProtectedRoute>} />
              <Route path="/student/profile" element={<ProtectedRoute roles={["student"]}><StudentProfilePage /></ProtectedRoute>} />
              <Route path="/teacher" element={<ProtectedRoute roles={["teacher"]}><TeacherDashboard /></ProtectedRoute>} />
              <Route path="/guardian" element={<ProtectedRoute roles={["guardian"]}><GuardianDashboard /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />

              {/* Guardian routes */}
              <Route path="/guardian/dependents" element={<ProtectedRoute roles={["guardian"]}><GuardianDependentsPage /></ProtectedRoute>} />
              <Route path="/guardian/report-card" element={<ProtectedRoute roles={["guardian"]}><GuardianReportCardPage /></ProtectedRoute>} />
              <Route path="/guardian/attendance" element={<ProtectedRoute roles={["guardian"]}><GuardianAttendancePage /></ProtectedRoute>} />

              {/* Students routes */}
              <Route path="/students" element={<ProtectedRoute roles={["admin", "teacher", "student"]}><StudentsPage /></ProtectedRoute>} />
              <Route path="/students/create" element={<ProtectedRoute roles={["admin"]}><CreateStudentPage /></ProtectedRoute>} />
              <Route path="/students/edit/:id" element={<ProtectedRoute roles={["admin"]}><CreateStudentPage /></ProtectedRoute>} />

              {/* Teachers routes */}
              <Route path="/teachers" element={<ProtectedRoute roles={["admin"]}><TeachersPage /></ProtectedRoute>} />
              <Route path="/teachers/create" element={<ProtectedRoute roles={["admin"]}><CreateTeacherPage /></ProtectedRoute>} />

              {/* Subjects routes */}
              <Route path="/subjects" element={<ProtectedRoute roles={["admin", "teacher"]}><SubjectsPage /></ProtectedRoute>} />
              <Route path="/subjects/create" element={<ProtectedRoute roles={["admin"]}><CreateSubjectPage /></ProtectedRoute>} />

              {/* Enrollments routes */}
              <Route path="/enrollments" element={<ProtectedRoute roles={["admin"]}><EnrollmentsPage /></ProtectedRoute>} />
              <Route path="/enrollments/create" element={<ProtectedRoute roles={["admin"]}><CreateEnrollmentPage /></ProtectedRoute>} />

              {/* Grades routes */}
              <Route path="/grades/create" element={<ProtectedRoute roles={["teacher"]}><CreateGradePage /></ProtectedRoute>} />
              <Route path="/grades" element={<ProtectedRoute roles={["teacher"]}><GradesListPage /></ProtectedRoute>} />
              <Route path="/grades/edit/:id" element={<ProtectedRoute roles={["teacher"]}><EditGradePage /></ProtectedRoute>} />

              {/* Classes routes */}
              <Route path="/classes" element={<ProtectedRoute roles={["admin"]}><ClassesPage /></ProtectedRoute>} />
              <Route path="/classes/create" element={<ProtectedRoute roles={["admin"]}><CreateClassPage /></ProtectedRoute>} />

              {/* Users routes */}
              <Route path="/users" element={<ProtectedRoute roles={["admin"]}><UsersPage /></ProtectedRoute>} />
              <Route path="/users/create" element={<ProtectedRoute roles={["admin"]}><CreateUserPage /></ProtectedRoute>} />

              {/* Default routes */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
