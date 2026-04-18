import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import api from "@/api/client";
import { AlertCircle, Loader2 } from "lucide-react";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email: form.email, password: form.password });
      const { token, role, name } = response.data;
      login(token, role);
      localStorage.setItem("userName", name);
      nav(`/${role}`);
    } catch (err: any) {
      setError(err.response?.status === 401 ? "Email ou senha inválidos." : "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card Container */}
        <div className="rounded-2xl bg-white shadow-2xl overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-primary to-blue-600 px-6 py-8 text-white">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">🏫</div>
              <h1 className="text-3xl font-bold">School Buddy</h1>
              <p className="text-primary-foreground/80 text-sm mt-2">Sistema de Gestão Escolar</p>
            </div>
          </div>

          {/* Form Container */}
          <div className="px-6 py-8 space-y-6">
            {error && (
              <div className="flex gap-3 rounded-lg bg-red-50 border border-red-200 p-4">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handle} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="seu.email@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-primary to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:from-primary/90 hover:to-blue-600/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </button>
            </form>

            {/* Demo credentials hint */}
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
              <p className="text-xs font-medium text-slate-600 mb-3">Credenciais de Teste:</p>
              <div className="space-y-2 text-xs text-slate-600">
                <p>👤 Admin: <code className="bg-white px-2 py-1 rounded">admin@gmail.com</code></p>
                <p>📚 Aluno: <code className="bg-white px-2 py-1 rounded">ana@email.com</code></p>
                <p>👨‍🏫 Prof: <code className="bg-white px-2 py-1 rounded">joao@email.com</code></p>
                <p>🔑 Senha: <code className="bg-white px-2 py-1 rounded">12345678</code></p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border bg-muted/30 px-6 py-4 text-center">
            <p className="text-xs text-muted-foreground">
              © 2026 School Buddy. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
