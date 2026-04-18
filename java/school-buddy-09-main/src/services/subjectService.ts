import api from "@/api/client";

export interface Subject {
  id: number;
  name: string;
  teacherId?: number;
  workloadHours?: number;
  description?: string;
}

const subjectService = {
  getAll: async (): Promise<Subject[]> => {
    try {
      const response = await api.get("/subjects");
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar disciplinas.");
    }
  },

  getByTeacher: async (): Promise<Subject[]> => {
    try {
      const response = await api.get("/subjects/teacher");
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar disciplinas do professor.");
    }
  },

  getById: async (id: number): Promise<Subject> => {
    try {
      const response = await api.get(`/subjects/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar disciplina.");
    }
  },

  create: async (subject: Omit<Subject, "id">): Promise<Subject> => {
    try {
      const response = await api.post("/subjects", subject);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao criar disciplina.");
    }
  },

  update: async (id: number, subject: Partial<Subject>): Promise<Subject> => {
    try {
      const response = await api.put(`/subjects/${id}`, subject);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao atualizar disciplina.");
    }
  },

  patch: async (id: number, subject: Partial<Subject>): Promise<Subject> => {
    try {
      const response = await api.patch(`/subjects/${id}`, subject);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao atualizar parcialmente disciplina.");
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/subjects/${id}`);
    } catch (error) {
      throw new Error("Erro ao deletar disciplina.");
    }
  },
};

export default subjectService;
