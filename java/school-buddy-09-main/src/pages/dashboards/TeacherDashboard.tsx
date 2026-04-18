import { useSubjects } from "@/hooks/useSubjects";
import StatCard from "@/components/StatCard";
import SectionCard from "@/components/SectionCard";
import { useNavigate } from "react-router-dom";
import { BookOpen, PlusCircle } from "lucide-react";

const TeacherDashboard = () => {
  const { subjects, loading } = useSubjects();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Painel do Professor</h1>
        <p className="text-muted-foreground">Gerencie suas disciplinas e lançamento de notas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Disciplinas Atribuídas"
          value={subjects.length}
          description="disciplinas ativas"
          icon="📚"
          variant="default"
        />
        <StatCard
          title="Ação Rápida"
          value="Lançar"
          description="Notas e frequência"
          icon="✏️"
          variant="accent"
        />
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Minhas Disciplinas */}
        <SectionCard
          title="Minhas Disciplinas"
          description={`Você é responsável por ${subjects.length} disciplina(s)`}
        >
          {loading ? (
            <p className="text-muted-foreground py-4">Carregando disciplinas...</p>
          ) : subjects.length === 0 ? (
            <p className="text-muted-foreground py-4">Nenhuma disciplina atribuída.</p>
          ) : (
            <div className="space-y-2">
              {subjects.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <BookOpen className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">Disciplina ID: {s.id}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Quick Actions */}
        <SectionCard
          title="Ações Rápidas"
          description="Acesse funcionalidades principais"
        >
          <div className="space-y-3">
            <button
              onClick={() => navigate("/grades/create")}
              className="w-full flex items-center gap-3 p-4 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all"
            >
              <PlusCircle className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium text-foreground">Lançar Notas</p>
                <p className="text-xs text-muted-foreground">Registre notas dos alunos</p>
              </div>
            </button>
            <button
              onClick={() => navigate("/grades")}
              className="w-full flex items-center gap-3 p-4 rounded-lg border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 hover:border-green-500/40 transition-all"
            >
              <PlusCircle className="w-5 h-5 text-green-700 flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium text-foreground">Notas Lançadas</p>
                <p className="text-xs text-muted-foreground">Edite ou remova notas já lançadas</p>
              </div>
            </button>
            <button
              onClick={() => navigate("/students")}
              className="w-full flex items-center gap-3 p-4 rounded-lg border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/40 transition-all"
            >
              <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium text-foreground">Ver Alunos</p>
                <p className="text-xs text-muted-foreground">Consulte lista de alunos</p>
              </div>
            </button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default TeacherDashboard;
