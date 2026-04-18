import { Music, Drum, Wind, Megaphone } from 'lucide-react';

const members = [
  { name: 'Comandante Silva', role: 'Regente & Maestro', icon: Megaphone, color: 'from-primary to-primary-glow' },
  { name: 'Bruno Almeida', role: 'Trompete', icon: Wind, color: 'from-secondary to-accent' },
  { name: 'Carla Mendes', role: 'Trombone', icon: Wind, color: 'from-accent to-primary' },
  { name: 'Diego Santos', role: 'Bateria', icon: Drum, color: 'from-primary-glow to-secondary' },
];

export function Members() {
  return (
    <section id="integrantes" className="py-16 sm:py-24">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-secondary">
            A fanfarra
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            Quatro <span className="text-gradient">passos</span>, uma só batida.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 grid-cols-2 sm:mt-14 sm:gap-6 lg:grid-cols-4">
          {members.map((m, i) => {
            const Icon = m.icon;
            return (
              <article
                key={m.name}
                className="group relative overflow-hidden rounded-3xl glass p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-glow"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${m.color} opacity-30 blur-2xl transition-opacity group-hover:opacity-60`} />
                <div className={`relative mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${m.color} shadow-glow`}>
                  <Icon className="h-7 w-7 text-primary-foreground" strokeWidth={2.2} />
                </div>
                <h3 className="font-display text-lg font-bold sm:text-2xl">{m.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{m.role}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
