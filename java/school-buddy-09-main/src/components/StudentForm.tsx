import { useEffect, useState } from "react";
import { useStudents } from "@/hooks/useStudents";
import { useClasses } from "@/hooks/useClasses";
import studentService from "@/services/studentService";

type Props = {
  studentId?: number;
  onSaved?: () => void;
};

const StudentForm = ({ studentId, onSaved }: Props) => {
  const { createStudent, updateStudent } = useStudents();
  const { classes, loading: classesLoading } = useClasses();
  
  const [form, setForm] = useState({ 
    name: "",
    classId: null as number | null
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStudent, setLoadingStudent] = useState(false);

  useEffect(() => {
    if (!studentId) return;
    let cancelled = false;

    const load = async () => {
      setLoadingStudent(true);
      setError("");
      try {
        const s = await studentService.getById(studentId);
        if (cancelled) return;
        setForm({
          name: s.name ?? "",
          classId: s.classId ?? null,
        });
      } catch {
        if (!cancelled) setError("Erro ao carregar aluno para edição.");
      } finally {
        if (!cancelled) setLoadingStudent(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [studentId]);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!form.classId) {
      setError("Selecione uma turma obrigatoriamente.");
      return;
    }
    
    setLoading(true);
    try {
      const payload = { name: form.name, classId: form.classId };
      if (studentId) {
        await updateStudent(studentId, payload);
        alert("Aluno atualizado com sucesso!");
      } else {
        await createStudent(payload);
        setForm({ name: "", classId: null });
        alert("Aluno criado com sucesso!");
      }
      onSaved?.();
    } catch {
      setError(studentId ? "Erro ao atualizar aluno." : "Erro ao criar aluno.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handle} className="max-w-md space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        {studentId ? "Editar Aluno" : "Novo Aluno"}
      </h2>
      {error && <p className="text-destructive text-sm">{error}</p>}
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Turma *
        </label>
        <select
          value={form.classId || ""}
          onChange={(e) => setForm({ ...form, classId: e.target.value ? Number(e.target.value) : null })}
          required
          disabled={classesLoading || loadingStudent}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground disabled:opacity-50"
        >
          <option value="">
            {classesLoading ? "Carregando turmas..." : "Selecione uma turma"}
          </option>
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <input 
        placeholder="Nome" 
        value={form.name} 
        onChange={(e) => setForm({ ...form, name: e.target.value })} 
        required 
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground" 
      />
      
      <button 
        type="submit" 
        disabled={loading || classesLoading || loadingStudent} 
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 disabled:opacity-50"
      >
        {loading || loadingStudent ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
};

export default StudentForm;
