import { useState, useEffect } from "react";
import enrollmentService, { Enrollment } from "@/services/enrollmentService";

export const useEnrollments = ({ fetchOnMount = true }: { fetchOnMount?: boolean } = {}) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrollments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await enrollmentService.getAll();
      setEnrollments(data);
    } catch (err) {
      setError("Erro ao carregar matrículas");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentEnrollments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await enrollmentService.getByStudent();
      setEnrollments(data);
    } catch (err) {
      setError("Erro ao carregar suas matrículas");
    } finally {
      setLoading(false);
    }
  };

  const createEnrollment = async (enrollment: Omit<Enrollment, "id">) => {
    try {
      const newEnrollment = await enrollmentService.create(enrollment);
      setEnrollments([...enrollments, newEnrollment]);
      return newEnrollment;
    } catch (err) {
      setError("Erro ao criar matrícula");
      throw err;
    }
  };

  const deleteEnrollment = async (id: number) => {
    try {
      await enrollmentService.delete(id);
      setEnrollments(enrollments.filter((e) => e.id !== id));
    } catch (err) {
      setError("Erro ao deletar matrícula");
      throw err;
    }
  };

  useEffect(() => {
    if (fetchOnMount) {
      fetchEnrollments();
    }
  }, [fetchOnMount]);

  return { enrollments, loading, error, fetchEnrollments, fetchStudentEnrollments, createEnrollment, deleteEnrollment };
};
