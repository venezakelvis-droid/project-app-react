import { useTeachers } from "@/hooks/useTeachers";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TeachersPage = () => {
  const { teachers, loading, error, deleteTeacher } = useTeachers();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Professores</h1>
        <Button onClick={() => navigate("/teachers/create")} className="bg-primary text-primary-foreground hover:opacity-90">
          Novo Professor
        </Button>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : teachers.length === 0 ? (
        <p className="text-muted-foreground">Nenhum professor cadastrado.</p>
      ) : (
        <div className="rounded-lg border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Nome</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Especialidade</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="border-b border-border hover:bg-muted/50">
                  <td className="px-4 py-3 text-card-foreground">{teacher.name}</td>
                  <td className="px-4 py-3 text-card-foreground">{teacher.email}</td>
                  <td className="px-4 py-3 text-card-foreground">{teacher.specialty || "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteTeacher(teacher.id)}
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

export default TeachersPage;
