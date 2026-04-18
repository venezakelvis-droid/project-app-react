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

import attendanceService from "@/services/attendanceService";
import api from "@/api/client";

const mockedApi = api as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  patch: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

describe("attendanceService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("should fetch all attendance records", async () => {
      const mockData = [
        {
          id: 1,
          enrollmentId: 1,
          semester: 1,
          totalClasses: 80,
          absences: 5,
          justifiedAbsences: 3,
          delays: 2,
          presencePercentage: 93.75,
        },
      ];

      mockedApi.get.mockResolvedValue({ data: mockData });

      const result = await attendanceService.getAll();

      expect(mockedApi.get).toHaveBeenCalledWith("/attendance");
      expect(result).toEqual(mockData);
    });

    it("should throw error on API failure", async () => {
      mockedApi.get.mockRejectedValue(new Error("API Error"));

      await expect(attendanceService.getAll()).rejects.toThrow("Erro ao buscar frequência.");
    });
  });

  describe("getByStudent", () => {
    it("should fetch student attendance records", async () => {
      const mockData = [
        {
          id: 1,
          enrollmentId: 1,
          semester: 1,
          totalClasses: 80,
          absences: 5,
          justifiedAbsences: 3,
          delays: 2,
          presencePercentage: 93.75,
        },
      ];

      mockedApi.get.mockResolvedValue({ data: mockData });

      const result = await attendanceService.getByStudent();

      expect(mockedApi.get).toHaveBeenCalledWith("/attendance/student");
      expect(result).toEqual(mockData);
    });
  });

  describe("getById", () => {
    it("should fetch attendance record by id", async () => {
      const mockData = {
        id: 1,
        enrollmentId: 1,
        semester: 1,
        totalClasses: 80,
        absences: 5,
        justifiedAbsences: 3,
        delays: 2,
        presencePercentage: 93.75,
      };

      mockedApi.get.mockResolvedValue({ data: mockData });

      const result = await attendanceService.getById(1);

      expect(mockedApi.get).toHaveBeenCalledWith("/attendance/1");
      expect(result).toEqual(mockData);
    });
  });

  describe("create", () => {
    it("should create new attendance record", async () => {
      const newAttendance = {
        enrollmentId: 1,
        semester: 1,
        totalClasses: 80,
        absences: 5,
        justifiedAbsences: 3,
        delays: 2,
      };

      const createdAttendance = { ...newAttendance, id: 1, presencePercentage: 93.75 };

      mockedApi.post.mockResolvedValue({ data: createdAttendance });

      const result = await attendanceService.create(newAttendance);

      expect(mockedApi.post).toHaveBeenCalledWith("/attendance", newAttendance);
      expect(result).toEqual(createdAttendance);
    });
  });

  describe("update", () => {
    it("should update attendance record", async () => {
      const updateData = { absences: 6, justifiedAbsences: 4 };
      const updatedAttendance = {
        id: 1,
        enrollmentId: 1,
        semester: 1,
        totalClasses: 80,
        absences: 6,
        justifiedAbsences: 4,
        delays: 2,
        presencePercentage: 92.5,
      };

      mockedApi.put.mockResolvedValue({ data: updatedAttendance });

      const result = await attendanceService.update(1, updateData);

      expect(mockedApi.put).toHaveBeenCalledWith("/attendance/1", updateData);
      expect(result).toEqual(updatedAttendance);
    });
  });

  describe("delete", () => {
    it("should delete attendance record", async () => {
      mockedApi.delete.mockResolvedValue({});

      await attendanceService.delete(1);

      expect(mockedApi.delete).toHaveBeenCalledWith("/attendance/1");
    });
  });
});
