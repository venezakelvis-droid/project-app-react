import { useState, useEffect } from "react";
import classService, { SchoolClass } from "@/services/classService";

export const useClassesCurrentTeacher = () => {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await classService.getClassesCurrentTeacher();
      setClasses(data);
    } catch (err) {
      setError("Erro ao carregar turmas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return { classes, loading, error, fetchClasses };
};
