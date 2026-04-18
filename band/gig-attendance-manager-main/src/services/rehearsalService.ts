import { KEYS, storage } from './storage';
import type { Attendance, AttendanceStatus, Rehearsal } from '@/types';

const uid = () => Math.random().toString(36).slice(2, 10);

export const rehearsalService = {
  list(): Rehearsal[] {
    return storage
      .get<Rehearsal[]>(KEYS.rehearsals, [])
      .slice()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },
  create(input: Omit<Rehearsal, 'id' | 'createdAt'>): Rehearsal {
    const all = storage.get<Rehearsal[]>(KEYS.rehearsals, []);
    const r: Rehearsal = { ...input, id: uid(), createdAt: new Date().toISOString() };
    storage.set(KEYS.rehearsals, [...all, r]);
    return r;
  },
  remove(id: string) {
    const all = storage.get<Rehearsal[]>(KEYS.rehearsals, []);
    storage.set(KEYS.rehearsals, all.filter((r) => r.id !== id));
    // cascade attendance
    const att = storage.get<Attendance[]>(KEYS.attendance, []);
    storage.set(KEYS.attendance, att.filter((a) => a.rehearsalId !== id));
  },
};

export const attendanceService = {
  list(): Attendance[] {
    return storage.get<Attendance[]>(KEYS.attendance, []);
  },
  byRehearsal(rehearsalId: string): Attendance[] {
    return this.list().filter((a) => a.rehearsalId === rehearsalId);
  },
  forUserAndRehearsal(userId: string, rehearsalId: string): Attendance | undefined {
    return this.list().find((a) => a.userId === userId && a.rehearsalId === rehearsalId);
  },
  respond(input: {
    rehearsalId: string;
    userId: string;
    userName: string;
    status: Extract<AttendanceStatus, 'confirmed' | 'declined'>;
  }): Attendance {
    const all = this.list();
    const existing = all.find(
      (a) => a.rehearsalId === input.rehearsalId && a.userId === input.userId,
    );
    if (existing) {
      const updated = { ...existing, status: input.status, respondedAt: new Date().toISOString() };
      storage.set(
        KEYS.attendance,
        all.map((a) => (a.id === existing.id ? updated : a)),
      );
      return updated;
    }
    const created: Attendance = {
      id: uid(),
      rehearsalId: input.rehearsalId,
      userId: input.userId,
      userName: input.userName,
      status: input.status,
      respondedAt: new Date().toISOString(),
    };
    storage.set(KEYS.attendance, [...all, created]);
    return created;
  },
  setFinalStatus(attendanceId: string, status: Extract<AttendanceStatus, 'present' | 'absent'>) {
    const all = this.list();
    storage.set(
      KEYS.attendance,
      all.map((a) => (a.id === attendanceId ? { ...a, status } : a)),
    );
  },
};
