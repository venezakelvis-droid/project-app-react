import { useStudents } from "@/hooks/useStudents";

const GuardianDependentsPage = () => {
  const { students, loading, error } = useStudents();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Dependentes</h1>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      {loading ? (
        <p className="text-muted-foreground">Carregando dependentes...</p>
      ) : students.length === 0 ? (
        <p className="text-muted-foreground">Nenhum dependente encontrado.</p>
      ) : (
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          {students.map((student) => (
            <div key={student.id} className="rounded-md border border-input bg-background p-4">
              <p className="text-lg font-semibold text-foreground">{student.name}</p>
              <p className="text-sm text-muted-foreground">Email: {student.email}</p>
              <p className="text-sm text-muted-foreground">Nascimento: {student.birthDate || "Não informado"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GuardianDependentsPage;
