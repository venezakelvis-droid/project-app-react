import { Flag } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2 ${className}`}>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow transition-transform group-hover:rotate-12">
        <Flag className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
      </span>
      <span className="font-display text-xl font-bold tracking-tight">
        FANFARRA<span className="text-gradient">ANTONIO JOSE</span>
      </span>
    </Link>
  );
}
