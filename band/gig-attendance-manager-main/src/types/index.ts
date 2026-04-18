export type Role = 'admin' | 'user';

export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
  instrument?: string;
  avatar?: string;
}

export interface Rehearsal {
  id: string;
  title: string;
  date: string; // ISO
  location: string;
  notes?: string;
  createdAt: string;
}

export type AttendanceStatus = 'confirmed' | 'declined' | 'present' | 'absent';

export interface Attendance {
  id: string;
  rehearsalId: string;
  userId: string;
  userName: string;
  status: AttendanceStatus;
  respondedAt: string;
}
