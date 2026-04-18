// Tiny localStorage wrapper — easy to swap for an API later.
export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  },
  remove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};

export const KEYS = {
  users: 'np_users',
  session: 'np_session',
  rehearsals: 'np_rehearsals',
  attendance: 'np_attendance',
  seeded: 'np_seeded_v1',
} as const;
