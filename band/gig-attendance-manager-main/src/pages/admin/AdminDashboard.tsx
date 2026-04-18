import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ListChecks, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { useRehearsals } from '@/hooks/useRehearsals';
import { storage, KEYS } from '@/services/storage';
import type { User } from '@/types';
import { Button } from '@/components/ui/button';

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

export default function AdminDashboard() {
  const { rehearsals, attendance } = useRehearsals();
  const users = storage.get<User[]>(KEYS.users, []).filter((u) => u.role === 'user');

  const stats = useMemo(() => {
    const upcoming = rehearsals.filter((r) => new Date(r.date).getTime() >= Date.now());
    const confirmedTotal = attendance.filter((a) => a.status === 'confirmed' || a.status === 'present').length;
    const possible = upcoming.length * users.length;
    const rate = possible ? Math.round((confirmedTotal / possible) * 100) : 0;
    return { upcoming: upcoming.length, totalRehearsals: rehearsals.length, members: users.length, rate };
  }, [rehearsals, attendance, users]);

  const next = rehearsals.find((r) => new Date(r.date).getTime() >= Date.now());

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="animate-fade-up">
        <span className="text-sm text-secondary">Painel do administrador</span>
        <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl md:text-4xl">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Visão geral dos ensaios e presenças da fanfarra para o desfile de 7 de setembro.</p>
      </header>

      <div className="grid gap-3 grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {[
          { l: 'Próximos ensaios', v: stats.upcoming, i: Calendar, c: 'from-primary to-primary-glow' },
          { l: 'Total de ensaios', v: stats.totalRehearsals, i: ListChecks, c: 'from-secondary to-accent' },
          { l: 'Integrantes', v: stats.members, i: Users, c: 'from-accent to-primary' },
          { l: 'Taxa de confirmação', v: `${stats.rate}%`, i: TrendingUp, c: 'from-primary-glow to-secondary' },
        ].map((s) => {
          const Icon = s.i;
          return (
            <div key={s.l} className="rounded-2xl glass p-5">
              <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.c} shadow-glow`}>
                <Icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="font-display text-2xl font-bold sm:text-3xl">{s.v}</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl glass-strong p-5 sm:p-6">
          <h2 className="font-display text-xl font-bold">Próximo ensaio</h2>
          {next ? (
            <div className="mt-4 space-y-3">
              <div className="text-sm text-muted-foreground">{fmtDate(next.date)}</div>
              <div className="font-display text-xl font-bold sm:text-2xl">{next.title}</div>
              <div className="text-sm text-muted-foreground">{next.location}</div>
              <div className="flex items-center gap-2 pt-2">
                <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                  {attendance.filter((a) => a.rehearsalId === next.id && (a.status === 'confirmed' || a.status === 'present')).length} confirmados
                </span>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                  {users.length - attendance.filter((a) => a.rehearsalId === next.id).length} pendentes
                </span>
              </div>
              <Button asChild variant="hero" size="sm" className="mt-4">
                <Link to="/admin/attendance">Ver detalhes <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          ) : (
            <p className="mt-4 text-muted-foreground">Nenhum ensaio agendado.</p>
          )}
        </div>

        <div className="rounded-3xl glass-strong p-5 sm:p-6">
          <h2 className="font-display text-xl font-bold">Ações rápidas</h2>
          <div className="mt-4 space-y-2">
            <Button asChild variant="glass" className="w-full justify-between">
              <Link to="/admin/rehearsals">
                <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Gerenciar ensaios/treinos</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="glass" className="w-full justify-between">
              <Link to="/admin/attendance">
                <span className="flex items-center gap-2"><ListChecks className="h-4 w-4" /> Controle de presenças</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
