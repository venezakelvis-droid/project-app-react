import { useState, useEffect } from "react";
import classService, { SchoolClass } from "@/services/classService";

export const useClassesByTeacher = (teacherId: number | null) => {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = async () => {
    if (!teacherId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await classService.getClassesByTeacherId(teacherId);
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
  }, [teacherId]);

  return { classes, loading, error, fetchClasses };
};
