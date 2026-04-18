import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, LogOut, LayoutDashboard, User as UserIcon } from 'lucide-react';
import { Logo } from './Logo';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';

const sections = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Fanfarra', href: '#integrantes' },
  { label: 'Galeria', href: '#galeria' },
  { label: 'Agenda', href: '#agenda' },
  { label: 'Contato', href: '#contato' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const onLanding = location.pathname === '/';

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full glass-strong px-5 py-3 shadow-elegant">
        <Logo />

        {onLanding && (
          <ul className="hidden items-center gap-7 md:flex">
            {sections.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Button asChild variant="glass" size="sm">
                <Link to={isAdmin ? '/admin' : '/app'}>
                  <LayoutDashboard className="h-4 w-4" />
                  {isAdmin ? 'Admin' : 'Painel'}
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </>
          ) : (
            <Button asChild variant="hero" size="sm">
              <Link to="/login">
                <LogIn className="h-4 w-4" />
                Entrar
              </Link>
            </Button>
          )}
        </div>

        <button
          aria-label="Abrir menu"
          className="md:hidden text-foreground"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="mx-auto mt-2 max-w-6xl rounded-3xl glass-strong p-5 md:hidden">
          {onLanding && (
            <ul className="mb-3 space-y-2">
              {sections.map((s) => (
                <li key={s.href}>
                  <a
                    onClick={() => setOpen(false)}
                    href={s.href}
                    className="block rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground min-h-[44px] flex items-center"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-col gap-2">
            {user ? (
              <>
                <Button asChild variant="glass" className="justify-start">
                  <Link to={isAdmin ? '/admin' : '/app'} onClick={() => setOpen(false)}>
                    <UserIcon className="h-4 w-4" />
                    {user.name}
                  </Link>
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => { logout(); setOpen(false); }}>
                  <LogOut className="h-4 w-4" /> Sair
                </Button>
              </>
            ) : (
              <Button asChild variant="hero">
                <Link to="/login" onClick={() => setOpen(false)}>
                  <LogIn className="h-4 w-4" /> Entrar
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
