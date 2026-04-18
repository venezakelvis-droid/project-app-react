import { describe, it, expect, vi } from "vitest";

vi.mock("@/api/client", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

import studentService from "@/services/studentService";
import api from "@/api/client";

const mockedApi = api as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  patch: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

describe("studentService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCurrentProfile", () => {
    it("should fetch current student profile", async () => {
      const mockProfile = {
        id: 1,
        name: "João Silva",
        email: "joao@email.com",
        birthDate: "2000-01-01",
        cpf: "123.456.789-00",
        phone: "11999999999",
        enrollmentNumber: "2024001",
        enrollmentDate: "2024-01-10",
        status: "ACTIVE",
      };

      mockedApi.get.mockResolvedValue({ data: mockProfile });

      const result = await studentService.getCurrentProfile();

      expect(mockedApi.get).toHaveBeenCalledWith("/students/profile");
      expect(result).toEqual(mockProfile);
    });

    it("should throw error on API failure", async () => {
      mockedApi.get.mockRejectedValue(new Error("API Error"));

      await expect(studentService.getCurrentProfile()).rejects.toThrow("Erro ao buscar perfil do aluno.");
    });
  });

  describe("getAll", () => {
    it("should fetch all students", async () => {
      const mockStudents = [
        {
          id: 1,
          name: "João Silva",
          email: "joao@email.com",
          cpf: "123.456.789-00",
        },
        {
          id: 2,
          name: "Maria Santos",
          email: "maria@email.com",
          cpf: "123.456.789-01",
        },
      ];

      mockedApi.get.mockResolvedValue({ data: mockStudents });

      const result = await studentService.getAll();

      expect(mockedApi.get).toHaveBeenCalledWith("/students");
      expect(result).toEqual(mockStudents);
    });
  });

  describe("create", () => {
    it("should create new student", async () => {
      const newStudent = {
        name: "João Silva",
        classId: 1,
      };

      const createdStudent = { ...newStudent, id: 1 };

      mockedApi.post.mockResolvedValue({ data: createdStudent });

      const result = await studentService.create(newStudent);

      expect(mockedApi.post).toHaveBeenCalledWith("/students", newStudent);
      expect(result).toEqual(createdStudent);
    });
  });
});