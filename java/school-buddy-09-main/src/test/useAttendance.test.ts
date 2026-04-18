import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useAttendance } from "@/hooks/useAttendance";
import attendanceService from "@/services/attendanceService";

vi.mock("@/services/attendanceService");

const mockedAttendanceService = attendanceService as unknown as {
  getByStudent: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

describe("useAttendance", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch attendance on mount when fetchOnMount is true", async () => {
    const mockAttendance = [
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

    mockedAttendanceService.getByStudent = vi.fn().mockResolvedValue(mockAttendance);

    const { result } = renderHook(() => useAttendance({ fetchOnMount: true }));

    expect(result.current.loading).toBe(true);
    expect(result.current.attendance).toEqual([]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.attendance).toEqual(mockAttendance);
    expect(result.current.error).toBe(null);
    expect(mockedAttendanceService.getByStudent).toHaveBeenCalledTimes(1);
  });

  it("should not fetch attendance on mount when fetchOnMount is false", () => {
    const { result } = renderHook(() => useAttendance({ fetchOnMount: false }));

    expect(result.current.loading).toBe(false);
    expect(result.current.attendance).toEqual([]);
    expect(result.current.error).toBe(null);
    expect(mockedAttendanceService.getByStudent).not.toHaveBeenCalled();
  });

  it("should handle error when fetching attendance", async () => {
    const errorMessage = "Erro ao buscar frequência";
    mockedAttendanceService.getByStudent = vi.fn().mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useAttendance({ fetchOnMount: true }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.attendance).toEqual([]);
    expect(result.current.error).toBe("Erro ao carregar sua frequência");
  });

  it("should create attendance record", async () => {
    const newAttendance = {
      enrollmentId: 1,
      semester: 1,
      totalClasses: 80,
      absences: 5,
      justifiedAbsences: 3,
      delays: 2,
    };

    const createdAttendance = { ...newAttendance, id: 1, presencePercentage: 93.75 };

    mockedAttendanceService.getByStudent = vi.fn().mockResolvedValue([]);
    mockedAttendanceService.create = vi.fn().mockResolvedValue(createdAttendance);

    const { result } = renderHook(() => useAttendance({ fetchOnMount: false }));

    await result.current.createAttendance(newAttendance);

    await waitFor(() => {
      expect(result.current.attendance).toEqual([createdAttendance]);
    });
  });

  it("should delete attendance record", async () => {
    const existingAttendance = [
      { id: 1, enrollmentId: 1, semester: 1, totalClasses: 80, absences: 5, justifiedAbsences: 3, delays: 2, presencePercentage: 93.75 },
      { id: 2, enrollmentId: 1, semester: 2, totalClasses: 80, absences: 3, justifiedAbsences: 1, delays: 1, presencePercentage: 96.25 },
    ];

    mockedAttendanceService.getByStudent = vi.fn().mockResolvedValue(existingAttendance);
    mockedAttendanceService.delete = vi.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() => useAttendance({ fetchOnMount: false }));

    // Set initial state by fetching
    await result.current.fetchStudentAttendance();

    await waitFor(() => {
      expect(result.current.attendance).toEqual(existingAttendance);
    });

    await result.current.deleteAttendance(1);

    await waitFor(() => {
      expect(result.current.attendance).toEqual([existingAttendance[1]]);
    });
    expect(mockedAttendanceService.delete).toHaveBeenCalledWith(1);
  });
});