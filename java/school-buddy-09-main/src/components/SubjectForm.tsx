import { useState } from "react";
import { useSubjects } from "@/hooks/useSubjects";

const SubjectForm = () => {
  const { createSubject } = useSubjects();
  const [form, setForm] = useState({ name: "", description: "" });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createSubject(form);
      setResult("Disciplina criada!");
      setForm({ name: "", description: "" });
    } catch {
      setResult("Erro ao criar disciplina.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handle} className="max-w-md space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Nova Disciplina</h2>
      {result && <p className="text-sm text-muted-foreground">{result}</p>}
      <input placeholder="Nome da Disciplina" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground" />
      <textarea placeholder="Descrição (opcional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground" />
      <button type="submit" disabled={loading} className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 disabled:opacity-50">{loading ? "Salvando..." : "Salvar"}</button>
    </form>
  );
};

export default SubjectForm;
