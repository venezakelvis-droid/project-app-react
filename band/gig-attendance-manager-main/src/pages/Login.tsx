import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { LogIn, ArrowLeft, ShieldCheck, User as UserIcon } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function Login() {
  const { user, login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={isAdmin ? '/admin' : '/app'} replace />;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const ok = login(username.trim(), password);
      setLoading(false);
      if (!ok) {
        toast.error('Credenciais inválidas', { description: 'Verifique usuário e senha.' });
        return;
      }
      toast.success('Bem-vindo de volta!');
      const fresh = JSON.parse(localStorage.getItem('np_session') || 'null');
      navigate(fresh?.role === 'admin' ? '/admin' : '/app', { replace: true });
    }, 350);
  };

  const fill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-mesh" />
      <div className="absolute inset-0 -z-10 grid-bg opacity-30" />

      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-10">
        <Link
          to="/"
          className="absolute left-6 top-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <Logo />
            </div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Área dos integrantes</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Entre com seu usuário para confirmar presença nos ensaios da fanfarra.
            </p>
          </div>

          <form onSubmit={onSubmit} className="rounded-3xl glass-strong p-6 shadow-elegant sm:p-8">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium" htmlFor="u">Usuário</label>
                <Input
                  id="u"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="seu_usuario"
                  className="bg-input/60"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium" htmlFor="p">Senha</label>
                <Input
                  id="p"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-input/60"
                />
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                <LogIn className="h-4 w-4" />
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </div>
          </form>

          <div className="mt-6 rounded-2xl glass p-4 text-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Contas de demonstração
            </p>
            <div className="grid gap-2">
              <button
                type="button"
                onClick={() => fill('admin', 'admin')}
                className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-3 text-left transition-colors hover:bg-muted min-h-[48px]"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span><strong>admin</strong> / admin</span>
                </span>
                <span className="text-xs text-muted-foreground">Administrador</span>
              </button>
              <button
                type="button"
                onClick={() => fill('bruno', '1234')}
                className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-3 text-left transition-colors hover:bg-muted min-h-[48px]"
              >
                <span className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-secondary" />
                  <span><strong>bruno</strong> / 1234</span>
                </span>
                <span className="text-xs text-muted-foreground">Integrante</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
