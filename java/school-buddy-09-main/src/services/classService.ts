import api from "@/api/client";

export interface SchoolClass {
  id?: number;
  name: string;
  schoolYear?: number;
  semester?: number;
  room?: string;
  shift?: string;
}

const classService = {
  getAll: async (): Promise<SchoolClass[]> => {
    try {
      const response = await api.get("/classes");
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar turmas.");
    }
  },

  getById: async (id: number): Promise<SchoolClass> => {
    try {
      const response = await api.get(`/classes/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar turma.");
    }
  },

  create: async (schoolClass: Omit<SchoolClass, "id">): Promise<SchoolClass> => {
    try {
      const response = await api.post("/classes", schoolClass);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao criar turma.");
    }
  },

  update: async (id: number, schoolClass: Partial<SchoolClass>): Promise<SchoolClass> => {
    try {
      const response = await api.put(`/classes/${id}`, schoolClass);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao atualizar turma.");
    }
  },

  patch: async (id: number, schoolClass: Partial<SchoolClass>): Promise<SchoolClass> => {
    try {
      const response = await api.patch(`/classes/${id}`, schoolClass);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao atualizar parcialmente turma.");
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/classes/${id}`);
    } catch (error) {
      throw new Error("Erro ao deletar turma.");
    }
  },

  getClassesByTeacherId: async (teacherId: number): Promise<SchoolClass[]> => {
    try {
      const response = await api.get(`/teachers/${teacherId}/classes`);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar turmas do professor.");
    }
  },

  getClassesCurrentTeacher: async (): Promise<SchoolClass[]> => {
    try {
      const response = await api.get("/teachers/me/classes");
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar suas turmas.");
    }
  },

  getStudentsByClassId: async (classId: number): Promise<any[]> => {
    try {
      const response = await api.get(`/classes/${classId}/students`);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar alunos da turma.");
    }
  },

  // Alias (new backend rule): students are loaded by class
  getStudentsByClass: async (classId: number): Promise<any[]> => {
    return classService.getStudentsByClassId(classId);
  },

  getSubjectsByTeacherAndClass: async (
    teacherId: number,
    classId: number
  ): Promise<any[]> => {
    try {
      const response = await api.get(
        `/subjects/teacher/${teacherId}/class/${classId}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar disciplinas do professor na turma.");
    }
  },

  getSubjectsCurrentTeacherByClass: async (classId: number): Promise<any[]> => {
    try {
      const response = await api.get(`/teachers/me/subjects?classId=${classId}`);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar suas disciplinas na turma.");
    }
  },
};

export default classService;

