import { useSubjects } from "@/hooks/useSubjects";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/AuthContext";
import { useNavigate } from "react-router-dom";

const SubjectsPage = () => {
  const { subjects, loading, error, deleteSubject } = useSubjects();
  const navigate = useNavigate();
  const { role } = useAuth();
  const canManageSubjects = role !== "teacher";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Disciplinas</h1>
        {canManageSubjects && (
          <Button onClick={() => navigate("/subjects/create")} className="bg-primary text-primary-foreground hover:opacity-90">
            Nova Disciplina
          </Button>
        )}
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : subjects.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma disciplina cadastrada.</p>
      ) : (
        <div className="rounded-lg border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Nome</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Descrição</th>
                {canManageSubjects && (
                  <th className="px-4 py-3 text-right font-semibold text-foreground">Ações</th>
                )}
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.id} className="border-b border-border hover:bg-muted/50">
                  <td className="px-4 py-3 text-card-foreground">{subject.name}</td>
                  <td className="px-4 py-3 text-card-foreground">{subject.description || "-"}</td>
                  {canManageSubjects && (
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => deleteSubject(subject.id)}
                        className="text-sm text-destructive hover:underline"
                      >
                        Deletar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubjectsPage;
