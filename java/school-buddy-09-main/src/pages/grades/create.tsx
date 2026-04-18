import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GradeForm from "@/components/GradeForm";

const CreateGradePage = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Lançar Nota</h1>
      <GradeForm />

      <div className="flex gap-4">
        <Button type="button" onClick={() => navigate("/admin")} variant="outline">
          Voltar
        </Button>
      </div>
    </div>
  );
};

export default CreateGradePage;
