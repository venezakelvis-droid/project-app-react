import { useState, useEffect } from "react";
import attendanceService, { Attendance } from "@/services/attendanceService";

export const useAttendance = ({ fetchOnMount = true }: { fetchOnMount?: boolean } = {}) => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await attendanceService.getAll();
      setAttendance(data);
    } catch (err) {
      setError("Erro ao carregar frequência");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await attendanceService.getByStudent();
      setAttendance(data);
    } catch (err) {
      setError("Erro ao carregar sua frequência");
    } finally {
      setLoading(false);
    }
  };

  const createAttendance = async (attendanceData: Omit<Attendance, "id">) => {
    try {
      const newAttendance = await attendanceService.create(attendanceData);
      setAttendance([...attendance, newAttendance]);
      return newAttendance;
    } catch (err) {
      setError("Erro ao criar frequência");
      throw err;
    }
  };

  const deleteAttendance = async (id: number) => {
    try {
      await attendanceService.delete(id);
      setAttendance(attendance.filter((a) => a.id !== id));
    } catch (err) {
      setError("Erro ao deletar frequência");
      throw err;
    }
  };

  useEffect(() => {
    if (fetchOnMount) {
      fetchStudentAttendance();
    }
  }, [fetchOnMount]);

  return { attendance, loading, error, fetchAttendance, fetchStudentAttendance, createAttendance, deleteAttendance };
};
