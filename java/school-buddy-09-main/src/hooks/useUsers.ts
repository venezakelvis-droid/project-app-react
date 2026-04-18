import { useState, useEffect } from "react";
import userService from "../services/userService";

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError("Erro ao carregar usuários.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (user: Omit<User, "id">) => {
    try {
      await userService.createUser(user);
      await fetchUsers();
    } catch (err) {
      setError("Erro ao criar usuário.");
      throw err;
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await userService.deleteUser(id);
      await fetchUsers();
    } catch (err) {
      setError("Erro ao deletar usuário.");
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, fetchUsers, createUser, deleteUser };
};
