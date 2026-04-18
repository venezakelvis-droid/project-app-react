import { useState, useEffect } from "react";
import subjectService, { Subject } from "@/services/subjectService";

export const useSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await subjectService.getAll();
      setSubjects(data);
    } catch (err) {
      setError("Erro ao carregar matérias");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherSubjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await subjectService.getByTeacher();
      setSubjects(data);
    } catch (err) {
      setError("Erro ao carregar suas matérias");
    } finally {
      setLoading(false);
    }
  };

  const createSubject = async (subject: Omit<Subject, "id">) => {
    try {
      const newSubject = await subjectService.create(subject);
      setSubjects([...subjects, newSubject]);
      return newSubject;
    } catch (err) {
      setError("Erro ao criar matéria");
      throw err;
    }
  };

  const deleteSubject = async (id: number) => {
    try {
      await subjectService.delete(id);
      setSubjects(subjects.filter((s) => s.id !== id));
    } catch (err) {
      setError("Erro ao deletar matéria");
      throw err;
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return { subjects, loading, error, fetchSubjects, fetchTeacherSubjects, createSubject, deleteSubject };
};
