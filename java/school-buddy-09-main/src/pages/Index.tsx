import { Link } from "react-router-dom";

const Index = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <h1 className="text-3xl font-bold text-foreground mb-4">🏫 Sistema Escolar</h1>
    <p className="text-muted-foreground mb-8">Gerencie alunos, professores, disciplinas, matrículas e notas.</p>
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {[
        { to: "/students", label: "Alunos" },
        { to: "/students/new", label: "Novo Aluno" },
        { to: "/teachers", label: "Professores" },
        { to: "/subjects", label: "Disciplinas" },
        { to: "/enrollments", label: "Matrículas" },
        { to: "/grades", label: "Notas" },
      ].map((l) => (
        <Link key={l.to} to={l.to} className="rounded-lg border border-border bg-card p-4 text-card-foreground hover:bg-accent transition-colors">
          {l.label}
        </Link>
      ))}
    </div>
  </div>
);

export default Index;
