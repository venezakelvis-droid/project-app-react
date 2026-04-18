import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { Calendar, Home, ListChecks, LogOut, Settings, Users } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem { to: string; label: string; icon: typeof Home }

export default function DashboardLayout({ admin = false }: { admin?: boolean }) {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace />;

  const items: NavItem[] = admin
    ? [
        { to: '/admin', label: 'Dashboard', icon: Home },
        { to: '/admin/rehearsals', label: 'Ensaios', icon: Calendar },
        { to: '/admin/attendance', label: 'Presenças', icon: ListChecks },
      ]
    : [
        { to: '/app', label: 'Meus ensaios', icon: Calendar },
      ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border/60 bg-card/40 backdrop-blur-xl lg:flex">
        <div className="px-6 py-6">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {items.map((it) => {
            const active = location.pathname === it.to;
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {it.label}
              </Link>
            );
          })}
          {isAdmin && !admin && (
            <Link
              to="/admin"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-secondary hover:bg-muted"
            >
              <Settings className="h-4 w-4" /> Ir para admin
            </Link>
          )}
          {admin && (
            <Link
              to="/app"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-secondary hover:bg-muted"
            >
              <Users className="h-4 w-4" /> Visão de usuário
            </Link>
          )}
        </nav>
        <div className="border-t border-border/60 p-4">
          <div className="mb-3 rounded-xl glass p-3">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Logado como</div>
            <div className="mt-1 font-display font-bold">{user.name}</div>
            <div className="text-xs text-secondary">{user.role === 'admin' ? 'Administrador' : user.instrument || 'Integrante'}</div>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={logout}>
            <LogOut className="h-4 w-4" /> Sair
          </Button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/60 bg-card/60 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Logo />
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </header>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-border/60 bg-card/80 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden">
        {items.map((it) => {
          const active = location.pathname === it.to;
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`flex flex-1 flex-col items-center gap-1 rounded-lg py-2 text-xs ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              {it.label}
            </Link>
          );
        })}
        {isAdmin && (
          <Link
            to={admin ? '/app' : '/admin'}
            className="flex flex-1 flex-col items-center gap-1 rounded-lg py-2 text-xs text-secondary"
          >
            <Settings className="h-5 w-5" />
            {admin ? 'User' : 'Admin'}
          </Link>
        )}
      </nav>

      <main className="lg:pl-64">
        <div className="mx-auto max-w-5xl px-3 py-6 pb-24 sm:px-4 sm:py-8 lg:pb-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
