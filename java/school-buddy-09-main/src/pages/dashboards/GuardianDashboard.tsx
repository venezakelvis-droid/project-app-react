import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useStudents } from "@/hooks/useStudents";
import StatCard from "@/components/StatCard";
import SectionCard from "@/components/SectionCard";
import { Users, FileText, Users2 } from "lucide-react";

const GuardianDashboard = () => {
  const { students, loading, error, fetchStudents } = useStudents();

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Painel do Responsável</h1>
        <p className="text-muted-foreground">Acompanhe o desempenho e frequência de seus dependentes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Dependentes"
          value={students.length}
          description="Sob sua responsabilidade"
          icon="👥"
          variant="default"
        />
        <StatCard
          title="Acesso Facilitado"
          value="Boletim"
          description="e frequência"
          icon="📋"
          variant="accent"
        />
        <StatCard
          title="Monitoramento"
          value="Ativo"
          description="Acompanhe tudo"
          icon="👁️"
          variant="secondary"
        />
      </div>

      {/* Quick Actions */}
      <SectionCard
        title="Ações Rápidas"
        description="Acesse informações de seus dependentes"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/guardian/dependents"
            className="flex items-center gap-3 p-4 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all"
          >
            <Users className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-foreground text-sm">Ver Dependentes</p>
              <p className="text-xs text-muted-foreground">Detalhes dos alunos</p>
            </div>
          </Link>
          <Link
            to="/guardian/report-card"
            className="flex items-center gap-3 p-4 rounded-lg border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/40 transition-all"
          >
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-foreground text-sm">Ver Boletim</p>
              <p className="text-xs text-muted-foreground">Notas por disciplina</p>
            </div>
          </Link>
          <Link
            to="/guardian/attendance"
            className="flex items-center gap-3 p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all"
          >
            <Users2 className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="font-medium text-foreground text-sm">Ver Frequência</p>
              <p className="text-xs text-muted-foreground">Presença e faltas</p>
            </div>
          </Link>
        </div>
      </SectionCard>

      {/* Dependents List */}
      <SectionCard
        title="Dependentes Cadastrados"
        description={`Você tem ${students.length} dependente(s)`}
      >
        {error ? (
          <p className="text-destructive text-sm py-4">{error}</p>
        ) : loading ? (
          <p className="text-muted-foreground py-4">Carregando dependentes...</p>
        ) : students.length === 0 ? (
          <p className="text-muted-foreground py-4">Nenhum dependente encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {students.map((student) => (
              <div key={student.id} className="rounded-lg border border-border bg-muted/30 p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{student.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{student.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Nascimento: {student.birthDate || "Não informado"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default GuardianDashboard;
