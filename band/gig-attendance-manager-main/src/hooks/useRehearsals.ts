import { useCallback, useEffect, useState } from 'react';
import type { Attendance, Rehearsal } from '@/types';
import { attendanceService, rehearsalService } from '@/services/rehearsalService';

export function useRehearsals() {
  const [rehearsals, setRehearsals] = useState<Rehearsal[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  const refresh = useCallback(() => {
    setRehearsals(rehearsalService.list());
    setAttendance(attendanceService.list());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rehearsals, attendance, refresh };
}
