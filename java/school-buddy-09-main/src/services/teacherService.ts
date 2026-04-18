import api from "@/api/client";
import type { SchoolClass } from "@/services/classService";
import type { Subject } from "@/services/subjectService";

export interface Teacher {
  id: number;
  name: string;
  email: string;
  specialty?: string;
  cpf?: string;
  phone?: string;
  hireDate?: string;
}

const teacherService = {
  getAll: async (): Promise<Teacher[]> => {
    try {
      const response = await api.get("/teachers");
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar professores.");
    }
  },

  getById: async (id: number): Promise<Teacher> => {
    try {
      const response = await api.get(`/teachers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar professor.");
    }
  },

  getCurrentTeacher: async (): Promise<Teacher> => {
    try {
      const response = await api.get("/teachers/me");
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar dados do professor autenticado.");
    }
  },

  // New backend rules (teacher works by class)
  getClassesByTeacher: async (): Promise<SchoolClass[]> => {
    try {
      const response = await api.get("/teachers/me/classes");
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar suas turmas.");
    }
  },

  getSubjectsByTeacherAndClass: async (classId: number): Promise<Subject[]> => {
    try {
      const response = await api.get(`/teachers/me/subjects?classId=${classId}`);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar suas disciplinas na turma.");
    }
  },

  create: async (teacher: Omit<Teacher, "id">): Promise<Teacher> => {
    try {
      const response = await api.post("/teachers", teacher);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao criar professor.");
    }
  },

  update: async (id: number, teacher: Partial<Teacher>): Promise<Teacher> => {
    try {
      const response = await api.put(`/teachers/${id}`, teacher);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao atualizar professor.");
    }
  },

  patch: async (id: number, teacher: Partial<Teacher>): Promise<Teacher> => {
    try {
      const response = await api.patch(`/teachers/${id}`, teacher);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao atualizar parcialmente professor.");
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/teachers/${id}`);
    } catch (error) {
      throw new Error("Erro ao deletar professor.");
    }
  },
};

export default teacherService;
