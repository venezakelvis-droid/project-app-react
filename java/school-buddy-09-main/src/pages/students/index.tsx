import StudentList from "@/components/StudentList";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/AuthContext";
import { useNavigate } from "react-router-dom";

const StudentsPage = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const canCreate = role === "admin";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Alunos</h1>
        {canCreate && (
          <Button onClick={() => navigate("/students/create")} className="bg-primary text-primary-foreground hover:opacity-90">
            Novo Aluno
          </Button>
        )}
      </div>
      <StudentList />
    </div>
  );
};

export default StudentsPage;
