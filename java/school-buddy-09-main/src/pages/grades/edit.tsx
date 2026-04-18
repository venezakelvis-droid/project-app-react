import { useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import GradeForm from "@/components/GradeForm";
import { Button } from "@/components/ui/button";

type GradeType = "N1" | "N2" | "N3" | "N4";

export default function EditGradePage() {
  const nav = useNavigate();
  const params = useParams();
  const [search] = useSearchParams();

  const gradeId = params.id ? Number(params.id) : NaN;
  const semesterParam = search.get("semester");
  const gradeTypeParam = search.get("gradeType");

  const initialSemester = useMemo(() => {
    const s = semesterParam ? Number(semesterParam) : null;
    return s === 2 ? 2 : 1;
  }, [semesterParam]);

  const initialGradeType = useMemo<GradeType>(() => {
    if (gradeTypeParam === "N2" || gradeTypeParam === "N3" || gradeTypeParam === "N4") return gradeTypeParam;
    return "N1";
  }, [gradeTypeParam]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Editar Nota</h1>
        <Button variant="outline" onClick={() => nav("/grades")}>
          Voltar
        </Button>
      </div>

      {Number.isFinite(gradeId) ? (
        <GradeForm
          gradeId={gradeId}
          initialSemester={initialSemester}
          initialGradeType={initialGradeType}
          onSaved={() => nav("/grades")}
        />
      ) : (
        <p className="text-destructive text-sm">ID de nota inválido.</p>
      )}
    </div>
  );
}

