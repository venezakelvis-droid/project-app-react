import { useState, useEffect } from "react";
import studentService, { Student } from "@/services/studentService";

export const useStudentProfile = ({ fetchOnMount = true }: { fetchOnMount?: boolean } = {}) => {
  const [profile, setProfile] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentService.getCurrentProfile();
      setProfile(data);
    } catch (err) {
      setError("Erro ao carregar perfil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchOnMount) {
      fetchProfile();
    }
  }, [fetchOnMount]);

  return { profile, loading, error, fetchProfile };
};