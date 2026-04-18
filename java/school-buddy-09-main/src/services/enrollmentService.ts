import api from "@/api/client";

export interface Enrollment {
  id?: number;
  studentId: number;
  subjectId: number;
  schoolClassId?: number;
  enrollmentDate?: string;
  status?: string;
}

const enrollmentService = {
  getAll: async (): Promise<Enrollment[]> => {
    try {
      const response = await api.get("/enrollments");
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar matrículas.");
    }
  },

  getByStudent: async (): Promise<Enrollment[]> => {
    try {
      const response = await api.get("/enrollments/student");
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar matrículas do aluno.");
    }
  },

  getById: async (id: number): Promise<Enrollment> => {
    try {
      const response = await api.get(`/enrollments/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar matrícula.");
    }
  },

  create: async (enrollment: Omit<Enrollment, "id">): Promise<Enrollment> => {
    try {
      const response = await api.post("/enrollments", enrollment);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao criar matrícula.");
    }
  },

  update: async (id: number, enrollment: Partial<Enrollment>): Promise<Enrollment> => {
    try {
      const response = await api.put(`/enrollments/${id}`, enrollment);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao atualizar matrícula.");
    }
  },

  patch: async (id: number, enrollment: Partial<Enrollment>): Promise<Enrollment> => {
    try {
      const response = await api.patch(`/enrollments/${id}`, enrollment);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao atualizar parcialmente matrícula.");
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/enrollments/${id}`);
    } catch (error) {
      throw new Error("Erro ao deletar matrícula.");
    }
  },

  getByStudentAndSubject: async (
    studentId: number,
    subjectId: number
  ): Promise<Enrollment[]> => {
    try {
      const response = await api.get(
        `/enrollments?studentId=${studentId}&subjectId=${subjectId}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar matrícula do aluno e disciplina.");
    }
  },
};

export default enrollmentService;
