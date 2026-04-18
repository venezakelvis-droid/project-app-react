import { useEffect } from "react";
import { useAttendance } from "@/hooks/useAttendance";

const GuardianAttendancePage = () => {
  const { attendance, loading, error, fetchStudentAttendance } = useAttendance({ fetchOnMount: false });

  useEffect(() => {
    fetchStudentAttendance();
  }, []);

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 75) return "text-green-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 75) return "Excelente";
    if (percentage >= 50) return "Regular";
    return "Crítico";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Frequência dos Dependentes</h1>

      {error && <p className="text-destructive text-sm">{error}</p>}

      {loading ? (
        <p className="text-muted-foreground">Carregando frequência...</p>
      ) : attendance.length === 0 ? (
        <p className="text-muted-foreground">Nenhum registro de frequência encontrado para seus dependentes.</p>
      ) : (
        <div className="space-y-8">
          {attendance.map((att, idx) => (
            <div key={att.id ?? idx} className="rounded-lg border border-border bg-card p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Disciplina {att.enrollmentId}</h2>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${getAttendanceColor(att.presencePercentage || 0)}`}>
                    {att.presencePercentage?.toFixed(1) || 0}% - {getAttendanceStatus(att.presencePercentage || 0)}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">{att.semester}º Semestre</h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-md border border-input bg-background p-4 text-center">
                  <p className="text-xs text-muted-foreground">Faltas</p>
                  <p className="text-2xl font-bold text-foreground">{att.absences || 0}</p>
                </div>

                <div className="rounded-md border border-input bg-background p-4 text-center">
                  <p className="text-xs text-muted-foreground">Justificadas</p>
                  <p className="text-2xl font-bold text-foreground">{att.justifiedAbsences || 0}</p>
                </div>

                <div className="rounded-md border border-input bg-background p-4 text-center">
                  <p className="text-xs text-muted-foreground">Atrasos</p>
                  <p className="text-2xl font-bold text-foreground">{att.delays || 0}</p>
                </div>

                <div className="rounded-md border border-input bg-background p-4 text-center">
                  <p className="text-xs text-muted-foreground">Total Aulas</p>
                  <p className="text-2xl font-bold text-foreground">{att.totalClasses || 0}</p>
                </div>
              </div>

              {att.presencePercentage !== null && att.presencePercentage !== undefined && (
                <div className="mt-6 rounded-md border-t-4 border-t-primary bg-primary/5 p-4">
                  <p className="text-sm font-medium text-muted-foreground">Percentual de Presença</p>
                  <p className={`text-3xl font-bold ${getAttendanceColor(att.presencePercentage)}`}>
                    {att.presencePercentage.toFixed(1)}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Status: {getAttendanceStatus(att.presencePercentage)}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GuardianAttendancePage;
