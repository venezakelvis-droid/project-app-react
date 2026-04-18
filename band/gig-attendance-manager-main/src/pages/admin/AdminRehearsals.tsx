import { useState } from 'react';
import { Calendar, MapPin, Plus, Trash2, Users } from 'lucide-react';
import { useRehearsals } from '@/hooks/useRehearsals';
import { rehearsalService } from '@/services/rehearsalService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const weekday = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { weekday: 'long' });
const fmt = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function AdminRehearsals() {
  const { rehearsals, attendance, refresh } = useRehearsals();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', location: '', notes: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.location) return;
    rehearsalService.create({
      title: form.title,
      date: new Date(form.date).toISOString(),
      location: form.location,
      notes: form.notes || undefined,
    });
    toast.success('Ensaio/treino criado!', { description: 'Formulário de presença gerado automaticamente.' });
    setForm({ title: '', date: '', location: '', notes: '' });
    setOpen(false);
    refresh();
  };

  const remove = (id: string) => {
    if (!confirm('Excluir este ensaio/treino? As respostas serão removidas.')) return;
    rehearsalService.remove(id);
    refresh();
    toast.success('Ensaio/treino removido');
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-sm text-secondary">Gestão</span>
          <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl md:text-4xl">Ensaios/Treinos</h1>
          <p className="mt-2 text-muted-foreground">Crie e gerencie os ensaios da fanfarra para o desfile de 7 de setembro.</p>
        </div>
        <Button variant="hero" onClick={() => setOpen((o) => !o)}>
          <Plus className="h-4 w-4" /> {open ? 'Cancelar' : 'Novo ensaio/treino'}
        </Button>
      </header>

      {open && (
        <form onSubmit={submit} className="rounded-3xl glass-strong p-5 animate-fade-up sm:p-6">
          <h2 className="font-display text-xl font-bold">Novo ensaio/treino</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">Título</label>
              <Input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ex: Ensaio de marcha"
                className="bg-input/60"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Data e hora</label>
              <Input
                required
                type="datetime-local"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="bg-input/60"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Local</label>
              <Input
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Quartel Central"
                className="bg-input/60"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">Observações</label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Trazer uniforme, chegar 30min antes..."
                className="bg-input/60"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="submit" variant="hero">Criar ensaio/treino</Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {rehearsals.length === 0 && (
          <div className="rounded-2xl glass p-10 text-center text-muted-foreground">
            Nenhum ensaio/treino cadastrado.
          </div>
        )}
        {rehearsals.map((r) => {
          const responses = attendance.filter((a) => a.rehearsalId === r.id);
          const confirmed = responses.filter((a) => a.status === 'confirmed' || a.status === 'present').length;
          return (
            <article key={r.id} className="rounded-2xl glass p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-cyan text-secondary-foreground shadow-cyan sm:h-14 sm:w-14">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold sm:text-lg">{r.title}</h3>
                    <p className="text-sm capitalize text-muted-foreground">
                      {weekday(r.date)} · {fmt(r.date)}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {r.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1.5 text-xs font-semibold text-primary">
                    <Users className="h-3.5 w-3.5" /> {confirmed} confirmados
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(r.id)}
                    aria-label="Excluir"
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
