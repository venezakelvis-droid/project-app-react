import api from "@/api/client";

export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role?: string;
  studentId?: number;
  teacherId?: number;
}

const userService = {
  getAll: async (): Promise<User[]> => {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar usuários.");
    }
  },

  getById: async (id: number): Promise<User> => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar usuário.");
    }
  },

  create: async (user: Omit<User, "id">): Promise<User> => {
    try {
      const response = await api.post("/users", user);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao criar usuário.");
    }
  },

  update: async (id: number, user: Partial<User>): Promise<User> => {
    try {
      const response = await api.put(`/users/${id}`, user);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao atualizar usuário.");
    }
  },

  patch: async (id: number, user: Partial<User>): Promise<User> => {
    try {
      const response = await api.patch(`/users/${id}`, user);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao atualizar parcialmente usuário.");
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      throw new Error("Erro ao deletar usuário.");
    }
  },
};

export default userService;
