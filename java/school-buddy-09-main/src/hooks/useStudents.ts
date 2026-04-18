import { useState, useEffect } from "react";
import studentService, { Student, StudentUpsert } from "@/services/studentService";

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError("Erro ao carregar alunos");
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (student: StudentUpsert) => {
    try {
      const newStudent = await studentService.create(student);
      setStudents([...students, newStudent]);
      return newStudent;
    } catch (err) {
      setError("Erro ao criar aluno");
      throw err;
    }
  };

  const updateStudent = async (id: number, student: StudentUpsert) => {
    try {
      const updated = await studentService.update(id, student);
      setStudents(students.map((s) => (s.id === id ? updated : s)));
      return updated;
    } catch (err) {
      setError("Erro ao atualizar aluno");
      throw err;
    }
  };

  const deleteStudent = async (id: number) => {
    try {
      await studentService.delete(id);
      setStudents(students.filter((s) => s.id !== id));
    } catch (err) {
      setError("Erro ao deletar aluno");
      throw err;
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return { students, loading, error, fetchStudents, createStudent, updateStudent, deleteStudent };
};
