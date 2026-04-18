import api from "@/api/client";

export interface SchoolClassRef {
  id: number;
  name: string;
}

export interface Student {
  id: number;
  name: string;
  email?: string;
  birthDate?: string;
  cpf?: string;
  phone?: string;
  enrollmentNumber?: string;
  enrollmentDate?: string;
  status?: string;
  classId: number;
  schoolClass?: SchoolClassRef;
}

export type StudentUpsert = {
  name: string;
  classId: number;
};

const studentService = {
  getAll: async (): Promise<Student[]> => {
    try {
      const response = await api.get("/students");
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar alunos.");
    }
  },

  getById: async (id: number): Promise<Student> => {
    try {
      const response = await api.get(`/students/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar aluno.");
    }
  },

  create: async (student: StudentUpsert): Promise<Student> => {
    try {
      const response = await api.post("/students", student);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao criar aluno.");
    }
  },

  update: async (id: number, student: StudentUpsert): Promise<Student> => {
    try {
      const response = await api.put(`/students/${id}`, student);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao atualizar aluno.");
    }
  },

  patch: async (id: number, student: Partial<StudentUpsert>): Promise<Student> => {
    try {
      const response = await api.patch(`/students/${id}`, student);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao atualizar parcialmente aluno.");
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/students/${id}`);
    } catch (error) {
      throw new Error("Erro ao deletar aluno.");
    }
  },

  getCurrentProfile: async (): Promise<Student> => {
    try {
      const response = await api.get("/students/profile");
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar perfil do aluno.");
    }
  },
};

export default studentService;
