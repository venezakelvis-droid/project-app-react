import { useState, useEffect } from "react";
import classService from "@/services/classService";
import { Student } from "@/types";

export const useStudentsByClass = (classId: number | null) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    if (!classId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await classService.getStudentsByClassId(classId);
      setStudents(data);
    } catch (err) {
      setError("Erro ao carregar alunos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [classId]);

  return { students, loading, error, fetchStudents };
};
