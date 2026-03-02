export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType {
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}