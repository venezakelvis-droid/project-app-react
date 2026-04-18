import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import studentService from "@/services/studentService";

vi.mock("@/services/studentService");

const mockedStudentService = studentService as unknown as {
  getCurrentProfile: ReturnType<typeof vi.fn>;
};

describe("useStudentProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch profile on mount when fetchOnMount is true", async () => {
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

    mockedStudentService.getCurrentProfile = vi.fn().mockResolvedValue(mockProfile);

    const { result } = renderHook(() => useStudentProfile({ fetchOnMount: true }));

    expect(result.current.loading).toBe(true);
    expect(result.current.profile).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.profile).toEqual(mockProfile);
    expect(result.current.error).toBe(null);
    expect(mockedStudentService.getCurrentProfile).toHaveBeenCalledTimes(1);
  });

  it("should not fetch profile on mount when fetchOnMount is false", () => {
    const { result } = renderHook(() => useStudentProfile({ fetchOnMount: false }));

    expect(result.current.loading).toBe(false);
    expect(result.current.profile).toBe(null);
    expect(result.current.error).toBe(null);
    expect(mockedStudentService.getCurrentProfile).not.toHaveBeenCalled();
  });

  it("should handle error when fetching profile", async () => {
    const errorMessage = "Erro ao buscar perfil";
    mockedStudentService.getCurrentProfile = vi.fn().mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useStudentProfile({ fetchOnMount: true }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.profile).toBe(null);
    expect(result.current.error).toBe("Erro ao carregar perfil");
  });

  it("should allow manual profile fetching", async () => {
    const mockProfile = {
      id: 1,
      name: "João Silva",
      email: "joao@email.com",
    };

    mockedStudentService.getCurrentProfile = vi.fn().mockResolvedValue(mockProfile);

    const { result } = renderHook(() => useStudentProfile({ fetchOnMount: false }));

    expect(result.current.profile).toBe(null);

    await result.current.fetchProfile();

    await waitFor(() => {
      expect(result.current.profile).toEqual(mockProfile);
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});