import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSubjects } from "@/hooks/useSubjects";
import { Button } from "@/components/ui/button";

const CreateSubjectPage = () => {
  const navigate = useNavigate();
  const { createSubject } = useSubjects();
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createSubject(form);
      navigate("/subjects");
    } catch (err) {
      setError("Erro ao criar disciplina.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Nova Disciplina</h1>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Nome</label>
          <input
            type="text"
            placeholder="Matemática"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Descrição</label>
          <textarea
            placeholder="Descrição da disciplina"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
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
            onClick={() => navigate("/subjects")}
            variant="outline"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateSubjectPage;
