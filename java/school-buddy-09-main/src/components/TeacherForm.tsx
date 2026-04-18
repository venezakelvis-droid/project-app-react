import { useState } from "react";
import { useTeachers } from "@/hooks/useTeachers";

const TeacherForm = () => {
  const { createTeacher } = useTeachers();
  const [form, setForm] = useState({ name: "", email: "", specialty: "" });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTeacher(form);
      setResult("Professor criado!");
      setForm({ name: "", email: "", specialty: "" });
    } catch {
      setResult("Erro ao criar professor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md space-y-6">
      <form onSubmit={create} className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Novo Professor</h2>
        {result && <p className="text-sm text-muted-foreground">{result}</p>}
        <input placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground" />
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground" />
        <input placeholder="Especialidade (opcional)" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground" />
        <button type="submit" disabled={loading} className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 disabled:opacity-50">{loading ? "Salvando..." : "Salvar"}</button>
      </form>
    </div>
  );
};

export default TeacherForm;
