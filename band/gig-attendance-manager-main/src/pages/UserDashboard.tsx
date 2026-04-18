import { useMemo, useState } from 'react';
import { Calendar, Check, MapPin, X, Search, Sparkles, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRehearsals } from '@/hooks/useRehearsals';
import { attendanceService } from '@/services/rehearsalService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  });
const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

type FilterMode = 'all' | 'pending' | 'confirmed' | 'past';

export default function UserDashboard() {
  const { user } = useAuth();
  const { rehearsals, attendance, refresh } = useRehearsals();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterMode>('all');

  const myAttendance = useMemo(
    () => attendance.filter((a) => a.userId === user!.id),
    [attendance, user],
  );

  const stats = useMemo(() => {
    const confirmed = myAttendance.filter((a) => a.status === 'confirmed' || a.status === 'present').length;
    const present = myAttendance.filter((a) => a.status === 'present').length;
    return { confirmed, present, total: rehearsals.length };
  }, [myAttendance, rehearsals]);

  const list = useMemo(() => {
    const now = Date.now();
    return rehearsals.filter((r) => {
      const a = myAttendance.find((x) => x.rehearsalId === r.id);
      const isPast = new Date(r.date).getTime() < now;
      if (filter === 'pending' && a) return false;
      if (filter === 'confirmed' && a?.status !== 'confirmed' && a?.status !== 'present') return false;
      if (filter === 'past' && !isPast) return false;
      if (query && !`${r.title} ${r.location}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [rehearsals, myAttendance, filter, query]);

  const respond = (rehearsalId: string, status: 'confirmed' | 'declined') => {
    attendanceService.respond({
      rehearsalId,
      userId: user!.id,
      userName: user!.name,
      status,
    });
    refresh();
    toast.success(status === 'confirmed' ? 'Presença confirmada!' : 'Resposta registrada');
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="animate-fade-up">
        <span className="inline-flex items-center gap-2 text-sm text-secondary">
          <Sparkles className="h-4 w-4" /> Olá, {user?.name.split(' ')[0]}
        </span>
        <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl md:text-4xl">Seus ensaios</h1>
        <p className="mt-2 text-muted-foreground">
          Confirme presença e fique por dentro da agenda da fanfarra para o desfile de 7 de setembro.
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { l: 'Total', v: stats.total, c: 'from-accent to-primary' },
          { l: 'Confirmados', v: stats.confirmed, c: 'from-primary to-primary-glow' },
          { l: 'Presenças', v: stats.present, c: 'from-secondary to-accent' },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl glass p-4 sm:p-5">
            <div className={`mb-2 h-1 w-10 rounded-full bg-gradient-to-r ${s.c}`} />
            <div className="font-display text-2xl font-bold sm:text-3xl md:text-4xl">{s.v}</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-full flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar ensaio..."
            className="pl-9 bg-input/60"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {(['all', 'pending', 'confirmed', 'past'] as FilterMode[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors min-h-[36px]',
                filter === f
                  ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                  : 'bg-muted text-muted-foreground hover:text-foreground',
              )}
            >
              {f === 'all' ? 'Todos' : f === 'pending' ? 'Pendentes' : f === 'confirmed' ? 'Confirmados' : 'Passados'}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {list.length === 0 && (
          <div className="rounded-2xl glass p-10 text-center text-muted-foreground">
            Nenhum ensaio encontrado.
          </div>
        )}
        {list.map((r) => {
          const a = myAttendance.find((x) => x.rehearsalId === r.id);
          const isPast = new Date(r.date).getTime() < Date.now();
          const confirmed = a?.status === 'confirmed' || a?.status === 'present';
          return (
            <article
              key={r.id}
              className={cn(
                'rounded-2xl glass p-5 transition-all',
                confirmed && 'border-primary/40 shadow-glow',
              )}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow sm:h-16 sm:w-16">
                    <Calendar className="h-4 w-4 opacity-80" />
                    <span className="font-display text-base font-bold">
                      {new Date(r.date).getDate().toString().padStart(2, '0')}/
                      {(new Date(r.date).getMonth() + 1).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold sm:text-lg">{r.title}</h3>
                    <p className="mt-1 text-sm capitalize text-muted-foreground">
                      {fmtDate(r.date)} · {fmtTime(r.date)}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {r.location}
                    </p>
                    {r.notes && (
                      <p className="mt-2 text-xs text-secondary">📝 {r.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-stretch gap-2 sm:items-end">
                  {a ? (
                    <span
                      className={cn(
                        'rounded-full px-3 py-1 text-center text-xs font-semibold',
                        a.status === 'confirmed' && 'bg-primary/20 text-primary',
                        a.status === 'present' && 'bg-success/20 text-success',
                        a.status === 'declined' && 'bg-muted text-muted-foreground',
                        a.status === 'absent' && 'bg-destructive/20 text-destructive',
                      )}
                    >
                      {a.status === 'confirmed' && '✓ Confirmado'}
                      {a.status === 'present' && '✓ Presente'}
                      {a.status === 'declined' && 'Recusado'}
                      {a.status === 'absent' && 'Ausente'}
                    </span>
                  ) : (
                    <span className="text-xs text-warning">⏳ Aguardando resposta</span>
                  )}

                  {!isPast && a?.status !== 'present' && a?.status !== 'absent' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={confirmed ? 'glass' : 'hero'}
                        onClick={() => respond(r.id, 'confirmed')}
                      >
                        <Check className="h-4 w-4" /> Vou
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => respond(r.id, 'declined')}
                      >
                        <X className="h-4 w-4" /> Não vou
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
