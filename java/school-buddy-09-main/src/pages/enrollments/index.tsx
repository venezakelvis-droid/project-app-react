import { useEnrollments } from "@/hooks/useEnrollments";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const EnrollmentsPage = () => {
  const { enrollments, loading, error, deleteEnrollment } = useEnrollments();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Matrículas</h1>
        <Button onClick={() => navigate("/enrollments/create")} className="bg-primary text-primary-foreground hover:opacity-90">
          Nova Matrícula
        </Button>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : enrollments.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma matrícula cadastrada.</p>
      ) : (
        <div className="rounded-lg border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-3 text-left font-semibold text-foreground">ID Aluno</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">ID Turma</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Data de Inscrição</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment) => (
                <tr key={enrollment.id} className="border-b border-border hover:bg-muted/50">
                  <td className="px-4 py-3 text-card-foreground">{enrollment.studentId}</td>
                  <td className="px-4 py-3 text-card-foreground">{enrollment.classId}</td>
                  <td className="px-4 py-3 text-card-foreground">{enrollment.enrollmentDate || "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteEnrollment(enrollment.id)}
                      className="text-sm text-destructive hover:underline"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EnrollmentsPage;
