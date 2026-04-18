import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/auth/AuthContext";

describe("Navbar student links", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows Boletim and Frequência for student role", () => {
    localStorage.setItem("token", "test-token");
    localStorage.setItem("role", "student");
    localStorage.setItem("userName", "Aluno Teste");

    render(
      <MemoryRouter>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("Boletim")).toBeInTheDocument();
    expect(screen.getByText("Frequência")).toBeInTheDocument();
  });
});
