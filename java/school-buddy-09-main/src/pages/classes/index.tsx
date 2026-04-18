import { useClasses } from "@/hooks/useClasses";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ClassesPage = () => {
  const { classes, loading, error, deleteClass } = useClasses();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Turmas</h1>
        <Button onClick={() => navigate("/classes/create")} className="bg-primary text-primary-foreground hover:opacity-90">
          Nova Turma
        </Button>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : classes.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma turma cadastrada.</p>
      ) : (
        <div className="rounded-lg border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Nome</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Descrição</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((schoolClass) => (
                <tr key={schoolClass.id} className="border-b border-border hover:bg-muted/50">
                  <td className="px-4 py-3 text-card-foreground">{schoolClass.name}</td>
                  <td className="px-4 py-3 text-card-foreground">{schoolClass.description || "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteClass(schoolClass.id)}
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

export default ClassesPage;
