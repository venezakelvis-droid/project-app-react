import { useEffect } from "react";
import { useGrades } from "@/hooks/useGrades";
import { useStudents } from "@/hooks/useStudents";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

const GuardianReportCardPage = () => {
  const { grades, loading: gradesLoading, error: gradesError, fetchStudentGrades } = useGrades({ fetchOnMount: false });
  const { students, loading: studentsLoading, error: studentsError, fetchStudents } = useStudents();

  useEffect(() => {
    fetchStudentGrades();
    fetchStudents();
  }, []);

  const getStatusColor = (status: string) => {
    if (!status) return "";
    if (status === "APROVADO" || status === "APPROVED") return "text-green-600";
    if (status === "RECUPERAÇÃO") return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusIcon = (status: string) => {
    if (!status) return null;
    if (status === "APROVADO" || status === "APPROVED") return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (status === "RECUPERAÇÃO") return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  const studentNames = new Map(students.map((student) => [student.id, student.name]));
  const isLoading = gradesLoading || studentsLoading;
  const error = gradesError || studentsError;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Boletim dos Dependentes</h1>

      {error && <p className="text-destructive text-sm">{error}</p>}

      {isLoading ? (
        <p className="text-muted-foreground">Carregando boletins...</p>
      ) : grades.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma nota encontrada para seus dependentes.</p>
      ) : (
        <div className="space-y-8">
          {grades.map((grade, idx) => (
            <div key={grade.id ?? idx} className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Aluno: {grade.studentId ? studentNames.get(grade.studentId) ?? `#${grade.studentId}` : `Matrícula ${grade.enrollmentId}`}
                  </h2>
                  <p className="text-sm text-muted-foreground">Disciplina {grade.subjectId || grade.enrollmentId}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(grade.status || "")}
                  <span className={`text-sm font-medium uppercase ${getStatusColor(grade.status || "")}`}>
                    {grade.status || "Incompleto"}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold text-foreground">1º Semestre</h3>
                <div className="mb-4 grid gap-3 sm:grid-cols-4">
                  {[
                    { label: "Nota 1", value: grade.note1Semester1 },
                    { label: "Nota 2", value: grade.note2Semester1 },
                    { label: "Nota 3", value: grade.note3Semester1 },
                    { label: "Nota 4", value: grade.note4Semester1 },
                  ].map((note, i) => (
                    <div key={i} className="rounded-md border border-input bg-background p-3 text-center">
                      <p className="text-xs text-muted-foreground">{note.label}</p>
                      <p className="text-lg font-semibold text-foreground">{note.value?.toFixed(1) || "-"}</p>
                    </div>
                  ))}
                </div>
                {grade.averageSemester1 !== null && grade.averageSemester1 !== undefined && (
                  <div className="rounded-md border-l-4 border-l-primary bg-primary/10 p-3">
                    <p className="text-sm text-muted-foreground">Média 1º Semestre</p>
                    <p className="text-2xl font-bold text-primary">{grade.averageSemester1.toFixed(2)}</p>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold text-foreground">2º Semestre</h3>
                <div className="mb-4 grid gap-3 sm:grid-cols-4">
                  {[
                    { label: "Nota 1", value: grade.note1Semester2 },
                    { label: "Nota 2", value: grade.note2Semester2 },
                    { label: "Nota 3", value: grade.note3Semester2 },
                    { label: "Nota 4", value: grade.note4Semester2 },
                  ].map((note, i) => (
                    <div key={i} className="rounded-md border border-input bg-background p-3 text-center">
                      <p className="text-xs text-muted-foreground">{note.label}</p>
                      <p className="text-lg font-semibold text-foreground">{note.value?.toFixed(1) || "-"}</p>
                    </div>
                  ))}
                </div>
                {grade.averageSemester2 !== null && grade.averageSemester2 !== undefined && (
                  <div className="rounded-md border-l-4 border-l-secondary bg-secondary/10 p-3">
                    <p className="text-sm text-muted-foreground">Média 2º Semestre</p>
                    <p className="text-2xl font-bold text-secondary">{grade.averageSemester2.toFixed(2)}</p>
                  </div>
                )}
              </div>

              {grade.finalAverage !== null && grade.finalAverage !== undefined && (
                <div className="rounded-md border-t-4 border-t-primary bg-primary/5 p-4">
                  <p className="text-sm font-medium text-muted-foreground">Média Final</p>
                  <p className="text-3xl font-bold text-primary">{grade.finalAverage.toFixed(2)}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GuardianReportCardPage;
