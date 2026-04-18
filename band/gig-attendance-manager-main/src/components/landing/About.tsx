export function About() {
  return (
    <section id="sobre" className="relative py-16 sm:py-24">
      <div className="container mx-auto grid gap-12 md:grid-cols-2 md:items-center">
        <div className="animate-fade-up">
          <span className="text-sm font-semibold uppercase tracking-widest text-secondary">
            Quem somos
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            Tradição e <span className="text-gradient">disciplina</span>.
          </h2>
          <p className="mt-6 text-muted-foreground md:text-lg">
            Fundada em 2017, nossa fanfarra nasceu da paixão pela música cívica e pelo patriotismo. 
            Cada apresentação é uma homenagem à independência do Brasil, com marchas vibrantes 
            e formações impecáveis que emocionam multidões.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { t: 'Marcha', d: 'Ritmo tradicional de desfile' },
              { t: 'Banda Cívica', d: 'Tradição e patriotismo' },
              { t: 'Fanfarra', d: 'Sopro e percussão' },
              { t: 'Formação', d: 'Marcha em passo de parada' },
            ].map((g) => (
              <div key={g.t} className="rounded-2xl glass p-4">
                <div className="font-display text-lg font-bold">{g.t}</div>
                <div className="text-sm text-muted-foreground">{g.d}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative animate-fade-up">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-hero opacity-30 blur-3xl" />
          <div className="relative aspect-square rounded-[2rem] glass-strong p-8 shadow-elegant">
            <div className="grid h-full grid-cols-2 gap-3">
              <div className="rounded-2xl bg-gradient-primary animate-float" />
              <div className="rounded-2xl bg-gradient-cyan animate-float [animation-delay:1s]" />
              <div className="rounded-2xl bg-accent/60 animate-float [animation-delay:2s]" />
              <div className="rounded-2xl glass animate-float [animation-delay:3s] flex items-center justify-center">
                <span className="font-display text-4xl font-bold text-gradient">BC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
