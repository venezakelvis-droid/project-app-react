import api from "@/api/client";
import { Attendance } from "@/types";

const attendanceService = {
  getAll: async (): Promise<Attendance[]> => {
    try {
      const response = await api.get("/attendance");
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar frequência.");
    }
  },

  getByStudent: async (): Promise<Attendance[]> => {
    try {
      const response = await api.get("/attendance/student");
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar frequência do aluno.");
    }
  },

  getById: async (id: number): Promise<Attendance> => {
    try {
      const response = await api.get(`/attendance/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar frequência.");
    }
  },

  getByEnrollment: async (enrollmentId: number): Promise<Attendance[]> => {
    try {
      const response = await api.get(`/attendance/enrollment/${enrollmentId}`);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar frequência da matrícula.");
    }
  },

  create: async (attendance: Omit<Attendance, "id">): Promise<Attendance> => {
    try {
      const response = await api.post("/attendance", attendance);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao criar frequência.");
    }
  },

  update: async (id: number, attendance: Partial<Attendance>): Promise<Attendance> => {
    try {
      const response = await api.put(`/attendance/${id}`, attendance);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao atualizar frequência.");
    }
  },

  patch: async (id: number, attendance: Partial<Attendance>): Promise<Attendance> => {
    try {
      const response = await api.patch(`/attendance/${id}`, attendance);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao atualizar parcialmente frequência.");
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/attendance/${id}`);
    } catch (error) {
      throw new Error("Erro ao deletar frequência.");
    }
  },
};

export default attendanceService;
