import { useState, useEffect } from "react";
import classService from "@/services/classService";
import { Subject } from "@/types";

export const useSubjectsCurrentTeacherByClass = (classId: number | null) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = async () => {
    if (!classId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await classService.getSubjectsCurrentTeacherByClass(classId);
      setSubjects(data);
    } catch (err) {
      setError("Erro ao carregar disciplinas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [classId]);

  return { subjects, loading, error, fetchSubjects };
};
