import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";

const Navbar = () => {
  const { token, role, logout } = useAuth();
  const nav = useNavigate();
  const userName = localStorage.getItem("userName");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("userName");
    nav("/login");
  };

  const navLinks = {
    admin: [
      { to: "/admin", label: "Dashboard" },
      { to: "/students", label: "Alunos" },
      { to: "/teachers", label: "Professores" },
      { to: "/subjects", label: "Disciplinas" },
      { to: "/enrollments", label: "Matrículas" },
      { to: "/classes", label: "Turmas" },
      { to: "/users", label: "Usuários" },
    ],
    teacher: [
      { to: "/teacher", label: "Dashboard" },
      { to: "/subjects", label: "Minhas Disciplinas" },
      { to: "/grades/create", label: "Lançar Notas" },
      { to: "/grades", label: "Notas Lançadas" },
      { to: "/students", label: "Alunos" },
    ],
    student: [
      { to: "/student", label: "Dashboard" },
      { to: "/student/report-card", label: "Boletim" },
      { to: "/student/attendance", label: "Frequência" },
      { to: "/student/profile", label: "Perfil" },
    ],
    guardian: [
      { to: "/guardian", label: "Dashboard" },
      { to: "/guardian/dependents", label: "Dependentes" },
      { to: "/guardian/report-card", label: "Boletim" },
      { to: "/guardian/attendance", label: "Frequência" },
    ],
  };

  const links = role ? navLinks[role as keyof typeof navLinks] || [] : [];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Navbar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to={token ? `/${role}` : "/login"}
            className="flex items-center gap-2 font-bold text-lg text-foreground hover:text-primary transition-colors"
          >
            <span className="text-2xl">🏫</span>
            <span className="hidden sm:inline">School Buddy</span>
          </Link>

          {/* Desktop Navigation */}
          {token && links.length > 0 && (
            <div className="hidden md:flex gap-6">
              {links.map((link, i) => (
                <Link
                  key={i}
                  to={link.to}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {token && (
              <>
                <div className="hidden sm:flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{userName || "Usuário"}</p>
                    <p className="text-xs text-muted-foreground capitalize">{role}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
                    {userName?.charAt(0).toUpperCase() || "U"}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-destructive hover:bg-destructive/10 px-3 py-2 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </>
            )}

            {/* Mobile Menu Button */}
            {token && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {token && mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-3 space-y-2 animate-in slide-in-from-top-2">
            {links.map((link, i) => (
              <Link
                key={i}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border pt-3 mt-3 px-4 space-y-2">
              <p className="text-xs font-medium text-muted-foreground">USUÁRIO</p>
              <p className="text-sm font-medium text-foreground">{userName || "Usuário"}</p>
              <p className="text-xs text-muted-foreground capitalize">{role}</p>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
