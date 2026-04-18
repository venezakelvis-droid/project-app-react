import { useNavigate, useParams } from "react-router-dom";
import StudentForm from "@/components/StudentForm";
import { Button } from "@/components/ui/button";

const CreateStudentPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const studentId = params.id ? Number(params.id) : undefined;

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-3xl font-bold text-foreground">
        {studentId ? "Editar Aluno" : "Novo Aluno"}
      </h1>

      <StudentForm studentId={studentId} onSaved={() => navigate("/students")} />

      <div className="flex gap-4">
        <Button type="button" onClick={() => navigate("/students")} variant="outline">
          Voltar
        </Button>
      </div>
    </div>
  );
};

export default CreateStudentPage;
