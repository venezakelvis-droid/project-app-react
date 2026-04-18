import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEnrollments } from "@/hooks/useEnrollments";
import { Button } from "@/components/ui/button";

const CreateEnrollmentPage = () => {
  const navigate = useNavigate();
  const { createEnrollment } = useEnrollments();
  const [form, setForm] = useState({ studentId: "", classId: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createEnrollment({ studentId: Number(form.studentId), classId: Number(form.classId) });
      navigate("/enrollments");
    } catch (err) {
      setError("Erro ao criar matrícula.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Nova Matrícula</h1>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">ID do Aluno</label>
          <input
            type="number"
            placeholder="1"
            value={form.studentId}
            onChange={(e) => setForm({ ...form, studentId: e.target.value })}
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">ID da Turma</label>
          <input
            type="number"
            placeholder="1"
            value={form.classId}
            onChange={(e) => setForm({ ...form, classId: e.target.value })}
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground"
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-primary text-primary-foreground hover:opacity-90"
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
          <Button
            type="button"
            onClick={() => navigate("/enrollments")}
            variant="outline"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateEnrollmentPage;
