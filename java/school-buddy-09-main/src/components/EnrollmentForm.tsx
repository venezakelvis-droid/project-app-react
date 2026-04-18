import { useState } from "react";
import { useEnrollments } from "@/hooks/useEnrollments";

const EnrollmentForm = () => {
  const { createEnrollment } = useEnrollments();
  const [form, setForm] = useState({ studentId: "", classId: "" });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createEnrollment({ studentId: Number(form.studentId), classId: Number(form.classId) });
      setResult("Matrícula realizada!");
      setForm({ studentId: "", classId: "" });
    } catch {
      setResult("Erro ao matricular.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handle} className="max-w-md space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Matricular Aluno</h2>
      {result && <p className="text-sm text-muted-foreground">{result}</p>}
      <input placeholder="ID do Aluno" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} required className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground" />
      <input placeholder="ID da Turma" value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })} required className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground" />
      <button type="submit" disabled={loading} className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 disabled:opacity-50">{loading ? "Matriculando..." : "Matricular"}</button>
    </form>
  );
};

export default EnrollmentForm;
