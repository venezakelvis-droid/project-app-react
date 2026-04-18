import { useMemo, useState } from 'react';
import { Calendar, Check, MapPin, X, UserCheck, UserX, Clock } from 'lucide-react';
import { useRehearsals } from '@/hooks/useRehearsals';
import { storage, KEYS } from '@/services/storage';
import { attendanceService } from '@/services/rehearsalService';
import type { AttendanceStatus, User } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const fmt = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

export default function AdminAttendance() {
  const { rehearsals, attendance, refresh } = useRehearsals();
  const users = storage.get<User[]>(KEYS.users, []).filter((u) => u.role === 'user');
  const [selected, setSelected] = useState<string | null>(rehearsals[0]?.id ?? null);

  const current = useMemo(() => rehearsals.find((r) => r.id === selected), [rehearsals, selected]);
  const responses = useMemo(
    () => attendance.filter((a) => a.rehearsalId === selected),
    [attendance, selected],
  );

  const rows = useMemo(() => {
    return users.map((u) => {
      const r = responses.find((a) => a.userId === u.id);
      return { user: u, attendance: r };
    });
  }, [users, responses]);

  const counts = useMemo(() => {
    const c = { confirmed: 0, declined: 0, present: 0, absent: 0, pending: 0 };
    rows.forEach((row) => {
      if (!row.attendance) c.pending++;
      else c[row.attendance.status]++;
    });
    return c;
  }, [rows]);

  const setFinal = (attId: string | undefined, status: 'present' | 'absent', user: User) => {
    if (!current) return;
    if (!attId) {
      // create record then mark
      const created = attendanceService.respond({
        rehearsalId: current.id,
        userId: user.id,
        userName: user.name,
        status: 'declined',
      });
      attendanceService.setFinalStatus(created.id, status);
    } else {
      attendanceService.setFinalStatus(attId, status);
    }
    refresh();
    toast.success(status === 'present' ? 'Marcado como presente' : 'Marcado como ausente');
  };

  const statusBadge = (s: AttendanceStatus | undefined) => {
    if (!s) return { label: 'Pendente', cls: 'bg-warning/20 text-warning' };
    return {
      confirmed: { label: 'Confirmado', cls: 'bg-primary/20 text-primary' },
      declined: { label: 'Recusou', cls: 'bg-muted text-muted-foreground' },
      present: { label: 'Presente', cls: 'bg-success/20 text-success' },
      absent: { label: 'Ausente', cls: 'bg-destructive/20 text-destructive' },
    }[s];
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <header>
        <span className="text-sm text-secondary">Controle de presença</span>
        <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl md:text-4xl">Presenças por ensaio/treino</h1>
        <p className="mt-2 text-muted-foreground">
          Veja confirmações e marque presença real após o ensaio da fanfarra.
        </p>
      </header>

      {/* Rehearsal selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 sm:gap-3">
        {rehearsals.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelected(r.id)}
            className={cn(
              'flex shrink-0 flex-col items-start gap-1 rounded-2xl px-4 py-3 text-left transition-all',
              selected === r.id
                ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                : 'glass text-muted-foreground hover:text-foreground',
            )}
          >
            <span className="text-xs uppercase tracking-wider opacity-80">{fmt(r.date)}</span>
            <span className="font-display text-sm font-bold">{r.title}</span>
          </button>
        ))}
      </div>

      {current && (
        <>
          <div className="rounded-3xl glass-strong p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-xl font-bold sm:text-2xl">{current.title}</h2>
                <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> {fmt(current.date)}
                  <span className="opacity-50">·</span>
                  <MapPin className="h-3.5 w-3.5" /> {current.location}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                  ✓ {counts.confirmed} confirmados
                </span>
                <span className="rounded-full bg-success/20 px-3 py-1 text-xs font-semibold text-success">
                  ✓ {counts.present} presentes
                </span>
                <span className="rounded-full bg-warning/20 px-3 py-1 text-xs font-semibold text-warning">
                  ⏳ {counts.pending} pendentes
                </span>
                <span className="rounded-full bg-destructive/20 px-3 py-1 text-xs font-semibold text-destructive">
                  ✕ {counts.absent} ausentes
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl glass -mx-1 sm:mx-0">
            <table className="w-full text-sm">
              <thead className="border-b border-border/60 bg-muted/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-3 py-3 sm:px-4">Integrante</th>
                  <th className="px-3 py-3 hidden sm:table-cell sm:px-4">Instrumento</th>
                  <th className="px-3 py-3 sm:px-4">Status</th>
                  <th className="px-3 py-3 text-right sm:px-4">Marcar</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ user, attendance: a }) => {
                  const badge = statusBadge(a?.status);
                  return (
                    <tr key={user.id} className="border-b border-border/40 last:border-0">
                      <td className="px-3 py-3 sm:px-4">
                        <div className="font-display font-semibold">{user.name}</div>
                        <div className="text-xs text-muted-foreground sm:hidden">{user.instrument}</div>
                      </td>
                      <td className="px-3 py-3 hidden text-muted-foreground sm:table-cell sm:px-4">{user.instrument}</td>
                      <td className="px-3 py-3 sm:px-4">
                        <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold', badge.cls)}>
                          {!a && <Clock className="h-3 w-3" />}
                          {a?.status === 'confirmed' && <Check className="h-3 w-3" />}
                          {a?.status === 'present' && <UserCheck className="h-3 w-3" />}
                          {a?.status === 'absent' && <UserX className="h-3 w-3" />}
                          {a?.status === 'declined' && <X className="h-3 w-3" />}
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-3 py-3 sm:px-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant={a?.status === 'present' ? 'hero' : 'glass'}
                            onClick={() => setFinal(a?.id, 'present', user)}
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={a?.status === 'absent' ? 'destructive' : 'glass'}
                            onClick={() => setFinal(a?.id, 'absent', user)}
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
      {!current && (
        <div className="rounded-2xl glass p-10 text-center text-muted-foreground">
          Crie um ensaio/treino para começar.
        </div>
      )}
    </div>
  );
}
