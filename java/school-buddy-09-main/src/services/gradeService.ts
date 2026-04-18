import api from "@/api/client";
import { Grade } from "@/types";

export type GradeUpsert = Partial<Grade> & {
  enrollmentId: number;
};

const gradeService = {
  getAll: async (): Promise<Grade[]> => {
    try {
      const response = await api.get("/grades");
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar notas.");
    }
  },

  getByStudent: async (): Promise<Grade[]> => {
    try {
      const response = await api.get("/grades/student");
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar notas do aluno.");
    }
  },

  getById: async (id: number): Promise<Grade> => {
    try {
      const response = await api.get(`/grades/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar nota.");
    }
  },

  create: async (grade: Omit<Grade, "id">): Promise<Grade> => {
    try {
      const response = await api.post("/grades", grade);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao criar nota.");
    }
  },

  update: async (id: number, grade: GradeUpsert): Promise<Grade> => {
    try {
      const response = await api.put(`/grades/${id}`, grade);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao atualizar nota.");
    }
  },

  patch: async (id: number, grade: GradeUpsert): Promise<Grade> => {
    try {
      const response = await api.patch(`/grades/${id}`, grade);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao atualizar parcialmente nota.");
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/grades/${id}`);
    } catch (error) {
      throw new Error("Erro ao deletar nota.");
    }
  },

  /** Teacher-only: GET /grades/me (never use GET /enrollments/{id} to hydrate grades). */
  getMyGrades: async (): Promise<Grade[]> => {
    try {
      const response = await api.get("/grades/me");
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar suas notas lançadas.");
    }
  },

  updateGrade: async (id: number, data: GradeUpsert): Promise<Grade> => {
    return gradeService.update(id, data);
  },

  deleteGrade: async (id: number): Promise<void> => {
    return gradeService.delete(id);
  },
};

export default gradeService;
