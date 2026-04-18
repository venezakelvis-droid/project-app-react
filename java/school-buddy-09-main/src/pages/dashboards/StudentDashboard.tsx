import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useEnrollments } from "@/hooks/useEnrollments";
import { useGrades } from "@/hooks/useGrades";
import StatCard from "@/components/StatCard";
import SectionCard from "@/components/SectionCard";
import { BookOpen, FileText, TrendingUp } from "lucide-react";

const StudentDashboard = () => {
  const { enrollments, loading: enrollLoading, fetchStudentEnrollments } = useEnrollments({ fetchOnMount: false });
  const { grades, loading: gradesLoading, fetchStudentGrades } = useGrades({ fetchOnMount: false });

  useEffect(() => {
    fetchStudentEnrollments();
    fetchStudentGrades();
  }, []);

  const averageGrade = grades.length > 0 
    ? (grades.reduce((sum, g) => sum + (g.finalAverage || 0), 0) / grades.length).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Seu Painel de Aluno</h1>
        <p className="text-muted-foreground">Acompanhe suas notas, frequência e matrículas</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Matrículas Ativas"
          value={enrollments.length}
          description="disciplinas"
          icon="📚"
          variant="default"
        />
        <StatCard
          title="Média Geral"
          value={averageGrade}
          description="Desempenho"
          icon="📊"
          variant="accent"
        />
        <StatCard
          title="Notas Registradas"
          value={grades.length}
          description="disciplinas avaliadas"
          icon="✓"
          variant="secondary"
        />
      </div>

      {/* Quick Actions */}
      <SectionCard
        title="Ações Rápidas"
        description="Acesse seus boletins e informações de frequência"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to="/student/report-card"
            className="flex items-center gap-3 p-4 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all"
          >
            <FileText className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">Ver Boletim</p>
              <p className="text-xs text-muted-foreground">Suas notas por disciplina</p>
            </div>
          </Link>
          <Link
            to="/student/attendance"
            className="flex items-center gap-3 p-4 rounded-lg border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/40 transition-all"
          >
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-foreground">Ver Frequência</p>
              <p className="text-xs text-muted-foreground">Seu índice de presença</p>
            </div>
          </Link>
        </div>
      </SectionCard>

      {/* Enrollments Section */}
      <SectionCard
        title="Suas Matrículas"
        description={`Você está matriculado em ${enrollments.length} disciplina(s)`}
      >
        {enrollLoading ? (
          <p className="text-muted-foreground">Carregando matrículas...</p>
        ) : enrollments.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma matrícula encontrada.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {enrollments.map((e) => (
              <div key={e.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                <BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">Turma {e.classId}</p>
                  <p className="text-xs text-muted-foreground">{e.enrollmentDate || "Data não informada"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Grades Preview Section */}
      <SectionCard
        title="Últimas Notas"
        description="Suas avaliações mais recentes"
      >
        {gradesLoading ? (
          <p className="text-muted-foreground">Carregando notas...</p>
        ) : grades.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma nota registrada ainda.</p>
        ) : (
          <div className="space-y-2">
            {grades.slice(0, 5).map((g) => (
              <div key={g.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium text-foreground">Disciplina {g.subjectId}</p>
                  <p className="text-xs text-muted-foreground">Matrícula {g.enrollmentId}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-primary">{g.value?.toFixed(1) || "-"}</p>
                  <p className="text-xs text-muted-foreground">{g.status || "Incompleto"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default StudentDashboard;
