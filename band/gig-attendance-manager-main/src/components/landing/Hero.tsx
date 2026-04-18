import { ArrowRight, Play, Sparkles, Flag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/test.png';

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-40 md:pb-28">
      {/* Backdrop */}
      <div className="absolute inset-0 -z-10">
        <img
          src={heroImage}
          alt="Banda de desfile em formação no desfile de 7 de setembro"
          className="h-full w-full object-cover opacity-40"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-secondary">
            <Sparkles className="h-3.5 w-3.5" />
            Preparação 2025 — Desfile 7 de Setembro
          </span>

          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[0.95] sm:text-5xl md:text-6xl lg:text-8xl">
            <span className="block">Ritmo que</span>
            <span className="block text-gradient">honra a pátria.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Quatro integrantes, uma missão. <strong className="text-foreground">Banda Cívica</strong> prepara
            apresentações memoráveis para o desfile de 7 de setembro com disciplina, tradição e patriotismo.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row">
            <Button asChild variant="hero" size="xl" className="animate-pulse-glow">
              <a href="#agenda">
                Ver próximos desfiles <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
            <Button asChild variant="glass" size="xl">
              <Link to="/login">
                <Play className="h-4 w-4" /> Área dos integrantes
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-3 max-w-xl mx-auto sm:mt-14 sm:gap-6">
            {[
              { v: '15+', l: 'Desfiles' },
              { v: '4', l: 'Integrantes' },
              { v: '8', l: 'Anos' },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl glass p-4">
                <div className="font-display text-xl font-bold text-gradient-primary sm:text-2xl md:text-3xl">{s.v}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
