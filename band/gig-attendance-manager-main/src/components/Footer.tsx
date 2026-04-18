import { Instagram, Flag, Youtube } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background/60">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 py-10 md:flex-row">
        <Logo />
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Banda Cívica. Tradição e patriotismo.
        </p>
        <div className="flex items-center gap-3">
          <a href="#" aria-label="Instagram" className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-primary">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="#" aria-label="YouTube" className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-primary">
            <Youtube className="h-5 w-5" />
          </a>
          <a href="#" aria-label="Eventos" className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-primary">
            <Flag className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
