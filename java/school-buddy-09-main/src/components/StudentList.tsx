import { useStudents } from "@/hooks/useStudents";
import { useAuth } from "@/auth/AuthContext";
import { useNavigate } from "react-router-dom";

const StudentList = () => {
  const { students, loading, error, deleteStudent } = useStudents();
  const { role } = useAuth();
  const navigate = useNavigate();
  const canManageStudents = role === "admin";

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-foreground">Alunos</h2>
      {error && <p className="text-destructive text-sm">{error}</p>}
      {loading && <p className="text-muted-foreground">Carregando...</p>}
      {(students?.length ?? 0) === 0 && !loading && (
        <p className="text-muted-foreground">Nenhum aluno.</p>
      )}
      {!loading && (
        <div className="space-y-2 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 font-semibold text-foreground">Nome</th>
                <th className="text-left py-2 px-3 font-semibold text-foreground">Email</th>
                <th className="text-left py-2 px-3 font-semibold text-foreground">Turma</th>
                {canManageStudents && <th className="text-left py-2 px-3 font-semibold text-foreground">Ações</th>}
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} className="border-b border-border hover:bg-muted/50 transition">
                  <td className="py-2 px-3 text-card-foreground">{s.name}</td>
                  <td className="py-2 px-3 text-card-foreground">{s.email || "—"}</td>
                  <td className="py-2 px-3 text-card-foreground">{s.schoolClass?.name || "—"}</td>
                  {canManageStudents && (
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => navigate(`/students/edit/${s.id}`)}
                          className="text-sm text-primary hover:underline"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => deleteStudent(s.id)}
                          className="text-sm text-destructive hover:underline"
                        >
                          Deletar
                        </button>
                      </div>
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

export default StudentList;
