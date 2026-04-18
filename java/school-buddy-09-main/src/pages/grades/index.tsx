import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { useGrades } from "@/hooks/useGrades";
import type { Grade } from "@/types";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type GradeType = "N1" | "N2" | "N3" | "N4";

type GradeRow = {
  gradeId: number;
  studentId: number;
  subjectId: number;
  semester: 1 | 2;
  gradeType: GradeType;
  value: number;
  studentLabel: string;
  subjectLabel: string;
  classLabel: string;
};

function getNoteValue(grade: Grade, semester: 1 | 2, gradeType: GradeType) {
  const idx = gradeType === "N1" ? 1 : gradeType === "N2" ? 2 : gradeType === "N3" ? 3 : 4;
  const field = `note${idx}Semester${semester}` as keyof Grade;
  const v = grade[field] as unknown as number | null | undefined;
  return v ?? null;
}

export default function GradesListPage() {
  const nav = useNavigate();
  const { role } = useAuth();
  const { grades, loading, error, fetchMyGrades, deleteGrade } = useGrades({ fetchOnMount: false });

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (role !== "teacher") return;
    fetchMyGrades();
  }, [role]);

  const rows: GradeRow[] = useMemo(() => {
    const out: GradeRow[] = [];
    for (const g of grades) {
      if (!g.id || !g.studentId || !g.subjectId) continue;
      const semesters: (1 | 2)[] = [1, 2];
      const types: GradeType[] = ["N1", "N2", "N3", "N4"];
      const studentLabel = g.studentName?.trim() || `#${g.studentId}`;
      const subjectLabel = g.subjectName?.trim() || `#${g.subjectId}`;
      const classLabel = g.schoolClassName?.trim() || "—";
      for (const sem of semesters) {
        for (const t of types) {
          const v = getNoteValue(g, sem, t);
          if (v === null || v === undefined) continue;
          out.push({
            gradeId: g.id,
            studentId: g.studentId,
            subjectId: g.subjectId,
            semester: sem,
            gradeType: t,
            value: v,
            studentLabel,
            subjectLabel,
            classLabel,
          });
        }
      }
    }
    return out;
  }, [grades]);

  if (role !== "teacher") {
    return null;
  }

  const onConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleting(true);
    try {
      await deleteGrade(confirmDeleteId);
      await fetchMyGrades();
    } finally {
      setDeleting(false);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Notas Lançadas</h1>
        <Button onClick={() => nav("/grades/create")} className="bg-primary text-primary-foreground hover:opacity-90">
          Lançar nova nota
        </Button>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}
      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : rows.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma nota lançada.</p>
      ) : (
        <div className="rounded-lg border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Aluno</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Turma</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Disciplina</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Semestre</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Tipo</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Valor</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={`${r.gradeId}-${r.semester}-${r.gradeType}-${idx}`} className="border-b border-border hover:bg-muted/50">
                  <td className="px-4 py-3 text-card-foreground">{r.studentLabel}</td>
                  <td className="px-4 py-3 text-card-foreground">{r.classLabel}</td>
                  <td className="px-4 py-3 text-card-foreground">{r.subjectLabel}</td>
                  <td className="px-4 py-3 text-card-foreground">{r.semester}º</td>
                  <td className="px-4 py-3 text-card-foreground">{r.gradeType}</td>
                  <td className="px-4 py-3 text-card-foreground">{r.value.toFixed(1)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => nav(`/grades/edit/${r.gradeId}?semester=${r.semester}&gradeType=${r.gradeType}`)}
                        className="text-sm text-primary hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(r.gradeId)}
                        className="text-sm text-destructive hover:underline"
                      >
                        Deletar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AlertDialog open={confirmDeleteId !== null} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar nota?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A nota será removida permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deletando..." : "Deletar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
