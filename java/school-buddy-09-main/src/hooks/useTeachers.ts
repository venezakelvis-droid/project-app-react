import { useState, useEffect } from "react";
import teacherService, { Teacher } from "@/services/teacherService";

export const useTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await teacherService.getAll();
      setTeachers(data);
    } catch (err) {
      setError("Erro ao carregar professores");
    } finally {
      setLoading(false);
    }
  };

  const createTeacher = async (teacher: Omit<Teacher, "id">) => {
    try {
      const newTeacher = await teacherService.create(teacher);
      setTeachers([...teachers, newTeacher]);
      return newTeacher;
    } catch (err) {
      setError("Erro ao criar professor");
      throw err;
    }
  };

  const deleteTeacher = async (id: number) => {
    try {
      await teacherService.delete(id);
      setTeachers(teachers.filter((t) => t.id !== id));
    } catch (err) {
      setError("Erro ao deletar professor");
      throw err;
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return { teachers, loading, error, fetchTeachers, createTeacher, deleteTeacher };
};
