import { useState, useEffect } from "react";
import gradeService, { Grade, GradeUpsert } from "@/services/gradeService";

export const useGrades = ({ fetchOnMount = true }: { fetchOnMount?: boolean } = {}) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGrades = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await gradeService.getAll();
      setGrades(data);
    } catch (err) {
      setError("Erro ao carregar notas");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentGrades = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await gradeService.getByStudent();
      setGrades(data);
    } catch (err) {
      setError("Erro ao carregar suas notas");
    } finally {
      setLoading(false);
    }
  };

  const createGrade = async (grade: GradeUpsert) => {
    try {
      const newGrade = await gradeService.create(grade);
      setGrades([...grades, newGrade]);
      return newGrade;
    } catch (err) {
      setError("Erro ao lançar nota");
      throw err;
    }
  };

  const fetchMyGrades = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await gradeService.getMyGrades();
      setGrades(data);
    } catch (err) {
      setError("Erro ao carregar suas notas lançadas");
    } finally {
      setLoading(false);
    }
  };

  const updateGrade = async (id: number, grade: GradeUpsert) => {
    try {
      const updated = await gradeService.updateGrade(id, grade);
      setGrades(grades.map((g) => (g.id === id ? updated : g)));
      return updated;
    } catch (err) {
      setError("Erro ao atualizar nota");
      throw err;
    }
  };

  const deleteGrade = async (id: number) => {
    try {
      await gradeService.deleteGrade(id);
      setGrades(grades.filter((g) => g.id !== id));
    } catch (err) {
      setError("Erro ao deletar nota");
      throw err;
    }
  };

  // keep backward name `deleteGrade` above; `deleteGradeLegacy` removed

  useEffect(() => {
    if (fetchOnMount) {
      fetchGrades();
    }
  }, [fetchOnMount]);

  return { grades, loading, error, fetchGrades, fetchStudentGrades, fetchMyGrades, createGrade, updateGrade, deleteGrade };
};
