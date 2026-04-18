import { useState, useEffect } from "react";
import classService from "@/services/classService";

export interface SchoolClass {
  id: number;
  name: string;
  description?: string;
}

export const useClasses = () => {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await classService.getAll();
      setClasses(data);
    } catch (err) {
      setError("Erro ao carregar turmas.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createClass = async (schoolClass: Omit<SchoolClass, "id">) => {
    try {
      await classService.create(schoolClass);
      await fetchClasses();
    } catch (err) {
      setError("Erro ao criar turma.");
      throw err;
    }
  };

  const deleteClass = async (id: number) => {
    try {
      await classService.delete(id);
      await fetchClasses();
    } catch (err) {
      setError("Erro ao deletar turma.");
      throw err;
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return { classes, loading, error, fetchClasses, createClass, deleteClass };
};
