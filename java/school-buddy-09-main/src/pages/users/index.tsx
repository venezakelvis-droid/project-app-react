import { useUsers } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const UsersPage = () => {
  const { users, loading, error, deleteUser } = useUsers();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Usuários</h1>
        <Button onClick={() => navigate("/users/create")} className="bg-primary text-primary-foreground hover:opacity-90">
          Novo Usuário
        </Button>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : users.length === 0 ? (
        <p className="text-muted-foreground">Nenhum usuário cadastrado.</p>
      ) : (
        <div className="rounded-lg border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Nome</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Rol</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                  <td className="px-4 py-3 text-card-foreground">{user.name}</td>
                  <td className="px-4 py-3 text-card-foreground">{user.email}</td>
                  <td className="px-4 py-3 text-card-foreground">{user.role || "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-sm text-destructive hover:underline"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
