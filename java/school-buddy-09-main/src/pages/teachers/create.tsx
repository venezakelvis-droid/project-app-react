import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTeachers } from "@/hooks/useTeachers";
import { Button } from "@/components/ui/button";

const CreateTeacherPage = () => {
  const navigate = useNavigate();
  const { createTeacher } = useTeachers();
  const [form, setForm] = useState({ name: "", email: "", specialty: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createTeacher(form);
      navigate("/teachers");
    } catch (err) {
      setError("Erro ao criar professor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Novo Professor</h1>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Nome</label>
          <input
            type="text"
            placeholder="Nome completo"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Email</label>
          <input
            type="email"
            placeholder="email@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Especialidade</label>
          <input
            type="text"
            placeholder="Ex: Matemática"
            value={form.specialty}
            onChange={(e) => setForm({ ...form, specialty: e.target.value })}
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
            onClick={() => navigate("/teachers")}
            variant="outline"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTeacherPage;
