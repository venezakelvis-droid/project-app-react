import type { LoginCredentials } from "../types";

export async function loginRequest({
  email,
  password,
}: LoginCredentials): Promise<string> {
  // Simulação de API
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "admin@email.com" && password === "123456") {
        resolve("fake-jwt-token-123");
      } else {
        reject(new Error("Credenciais inválidas"));
      }
    }, 1000);
  });
}