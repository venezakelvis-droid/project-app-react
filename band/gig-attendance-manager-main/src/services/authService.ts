import { KEYS, storage } from './storage';
import type { User } from '@/types';

interface StoredUser extends User {
  password: string;
}

export const authService = {
  login(username: string, password: string): User | null {
    const users = storage.get<StoredUser[]>(KEYS.users, []);
    const found = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password,
    );
    if (!found) return null;
    const { password: _pw, ...safe } = found;
    storage.set(KEYS.session, safe);
    return safe;
  },
  logout() {
    storage.remove(KEYS.session);
  },
  current(): User | null {
    return storage.get<User | null>(KEYS.session, null);
  },
};
