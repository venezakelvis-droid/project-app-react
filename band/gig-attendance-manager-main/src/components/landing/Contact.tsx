import { useState } from 'react';
import { Mail, Phone, Send, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export function Contact() {
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      (e.target as HTMLFormElement).reset();
      toast.success('Mensagem enviada!', { description: 'Entraremos em contato em breve.' });
    }, 700);
  };

  return (
    <section id="contato" className="py-16 sm:py-24">
      <div className="container mx-auto grid gap-12 md:grid-cols-2 md:items-center">
        <div>
          <span className="text-sm font-semibold uppercase tracking-widest text-secondary">
            Contato & Contratações
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            Vamos tocar <span className="text-gradient">juntos</span>?
          </h2>
          <p className="mt-6 text-muted-foreground md:text-lg">
            Para desfiles, apresentações cívicas, eventos patrióticos ou parcerias — preencha o formulário ao lado ou fale
            direto com a gente.
          </p>
          <ul className="mt-8 space-y-4">
            <li className="flex items-center gap-3 text-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                <Mail className="h-4 w-4 text-primary-foreground" />
              </span>
              contato@bandacivica.org
            </li>
            <li className="flex items-center gap-3 text-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-cyan shadow-cyan">
                <Phone className="h-4 w-4 text-secondary-foreground" />
              </span>
              +55 (11) 99999-0000
            </li>
            <li className="flex items-center gap-3 text-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                <MapPin className="h-4 w-4 text-accent-foreground" />
              </span>
              Teresina - Piauí, Brasil
            </li>
          </ul>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-3xl glass-strong p-6 shadow-elegant sm:p-8"
        >
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium" htmlFor="name">Nome</label>
              <Input id="name" required placeholder="Seu nome" className="bg-input/60" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium" htmlFor="email">E-mail</label>
              <Input id="email" type="email" required placeholder="voce@email.com" className="bg-input/60" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium" htmlFor="msg">Mensagem</label>
              <Textarea id="msg" required rows={5} placeholder="Conte sobre o evento..." className="bg-input/60" />
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              <Send className="h-4 w-4" />
              {loading ? 'Enviando...' : 'Enviar mensagem'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
