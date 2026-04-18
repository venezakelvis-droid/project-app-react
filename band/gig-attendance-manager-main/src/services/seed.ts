import { KEYS, storage } from './storage';
import type { Attendance, Rehearsal, User } from '@/types';

interface StoredUser extends User {
  password: string;
}

const SEED_USERS: StoredUser[] = [
  { id: 'u1', username: 'admin', password: 'admin', name: 'Comandante Silva', role: 'admin', instrument: 'Regente & Maestro' },
  { id: 'u2', username: 'bruno', password: '1234', name: 'Bruno Almeida', role: 'user', instrument: 'Trompete' },
  { id: 'u3', username: 'carla', password: '1234', name: 'Carla Mendes', role: 'user', instrument: 'Trombone' },
  { id: 'u4', username: 'diego', password: '1234', name: 'Diego Santos', role: 'user', instrument: 'Bateria' },
];

const today = new Date();
const inDays = (d: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + d);
  date.setHours(20, 0, 0, 0);
  return date.toISOString();
};

const SEED_REHEARSALS: Rehearsal[] = [
  { id: 'r1', title: 'Ensaio Geral — Formação de rua', date: inDays(2), location: 'Quartel Central, Pátio de Formação', notes: 'Trajer uniforme completo para ajustes.', createdAt: new Date().toISOString() },
  { id: 'r2', title: 'Treino de marcha — 7 de Setembro', date: inDays(7), location: 'Avenida Principal', notes: 'Chegar 30min antes para alongamento.', createdAt: new Date().toISOString() },
  { id: 'r3', title: 'Ensaio de percussão', date: inDays(14), location: 'Quartel Central, Sala de Música', createdAt: new Date().toISOString() },
];

const SEED_ATTENDANCE: Attendance[] = [
  { id: 'a1', rehearsalId: 'r1', userId: 'u2', userName: 'Bruno Almeida', status: 'confirmed', respondedAt: new Date().toISOString() },
  { id: 'a2', rehearsalId: 'r1', userId: 'u3', userName: 'Carla Mendes', status: 'confirmed', respondedAt: new Date().toISOString() },
];

export function seedIfNeeded() {
  if (storage.get(KEYS.seeded, false)) return;
  storage.set(KEYS.users, SEED_USERS);
  storage.set(KEYS.rehearsals, SEED_REHEARSALS);
  storage.set(KEYS.attendance, SEED_ATTENDANCE);
  storage.set(KEYS.seeded, true);
}
