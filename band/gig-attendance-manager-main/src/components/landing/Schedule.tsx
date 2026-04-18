import { Calendar, MapPin, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const shows = [
  { date: '07 SET', city: 'Desfile Cívico — Centro', venue: 'Avenida Principal', status: 'Ensaios em andamento' },
  { date: '12 OUT', city: 'Apresentação — Escola Municipal', venue: 'Praça da Bandeira', status: 'Confirmado' },
  { date: '15 NOV', city: 'Desfile Proclamação — República', venue: 'Centro Histórico', status: 'Em breve' },
  { date: '20 NOV', city: 'Consciência Negra — Homenagem', venue: 'Teatro Municipal', status: 'Confirmado' },
];

export function Schedule() {
  return (
    <section id="agenda" className="py-16 sm:py-24">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-secondary">
            Próximas apresentações
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            Desfile <span className="text-gradient">2025</span>
          </h2>
        </div>

        <div className="mt-8 mx-auto max-w-3xl space-y-3 sm:mt-12">
          {shows.map((s, i) => (
            <div
              key={i}
              className="group flex flex-col items-start gap-4 rounded-2xl glass p-5 transition-all hover:border-primary/40 hover:shadow-glow sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-5">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow sm:h-16 sm:w-16">
                  <Calendar className="h-4 w-4 opacity-80" />
                  <span className="font-display text-sm font-bold leading-tight">{s.date}</span>
                </div>
                <div>
                  <h3 className="font-display text-base font-bold sm:text-lg">{s.city}</h3>
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {s.venue}
                  </p>
                </div>
              </div>
              <div className="flex w-full items-center justify-between gap-3 sm:w-auto">
                <span className="text-xs font-medium text-secondary">{s.status}</span>
                <Button variant="cyan" size="sm">
                  <Flag className="h-4 w-4" /> Detalhes
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
