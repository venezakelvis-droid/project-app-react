import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { useGrades } from "@/hooks/useGrades";
import { useClassesCurrentTeacher } from "@/hooks/useClassesCurrentTeacher";
import { useStudentsByClass } from "@/hooks/useStudentsByClass";
import { useSubjectsCurrentTeacherByClass } from "@/hooks/useSubjectsCurrentTeacherByClass";
import enrollmentService from "@/services/enrollmentService";
import gradeService from "@/services/gradeService";
import type { Grade } from "@/types";

type GradeType = "N1" | "N2" | "N3" | "N4";

type Props = {
  gradeId?: number;
  initialSemester?: 1 | 2;
  initialGradeType?: GradeType;
  onSaved?: () => void;
};

function getNoteField(semester: 1 | 2, gradeType: GradeType) {
  const idx = gradeType === "N1" ? 1 : gradeType === "N2" ? 2 : gradeType === "N3" ? 3 : 4;
  return `note${idx}Semester${semester}` as const;
}

function getValueFromGrade(grade: Grade | null, semester: 1 | 2, gradeType: GradeType) {
  if (!grade) return "";
  const field = getNoteField(semester, gradeType);
  const v = (grade as any)[field] as number | null | undefined;
  return v === null || v === undefined ? "" : String(v);
}

function normalizeFullPayload(grade: Grade, base: { enrollmentId: number; studentId: number; subjectId: number; semester: 1 | 2 }) {
  return {
    enrollmentId: base.enrollmentId,
    studentId: base.studentId,
    subjectId: base.subjectId,
    semester: base.semester,
    note1Semester1: grade.note1Semester1 ?? null,
    note2Semester1: grade.note2Semester1 ?? null,
    note3Semester1: grade.note3Semester1 ?? null,
    note4Semester1: grade.note4Semester1 ?? null,
    note1Semester2: grade.note1Semester2 ?? null,
    note2Semester2: grade.note2Semester2 ?? null,
    note3Semester2: grade.note3Semester2 ?? null,
    note4Semester2: grade.note4Semester2 ?? null,
  };
}

const GradeForm = ({ gradeId, initialSemester, initialGradeType, onSaved }: Props) => {
  const { role } = useAuth();
  const { createGrade, updateGrade } = useGrades({ fetchOnMount: false });

  // Wizard state
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [semester, setSemester] = useState<1 | 2>(initialSemester ?? 1);
  const [gradeType, setGradeType] = useState<GradeType>(initialGradeType ?? "N1");
  const [value, setValue] = useState<string>("");

  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [editingEnrollmentId, setEditingEnrollmentId] = useState<number | null>(null);
  const [editingLoaded, setEditingLoaded] = useState(false);

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { classes, loading: classesLoading } = useClassesCurrentTeacher();
  const { students, loading: studentsLoading } = useStudentsByClass(selectedClass);
  const { subjects, loading: subjectsLoading } = useSubjectsCurrentTeacherByClass(selectedClass);

  const progressLabel = `Step ${step}/5`;

  if (role !== "teacher") {
    return (
      <div className="rounded-md bg-yellow-100 p-4 text-yellow-800 max-w-2xl">
        Apenas professores podem lançar e gerenciar notas.
      </div>
    );
  }

  // Load grade for edit
  useEffect(() => {
    if (!gradeId) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const g = await gradeService.getById(gradeId);
        if (cancelled) return;
        setEditingGrade(g);
        setEditingEnrollmentId(g.enrollmentId);

        // Resolve class from enrollment
        if (g.enrollmentId) {
          const enrollment = await enrollmentService.getById(g.enrollmentId);
          if (cancelled) return;
          setSelectedClass(enrollment.schoolClassId ?? null);
        }

        setSelectedStudent(g.studentId ?? null);
        setSelectedSubject(g.subjectId ?? null);
        setSemester((g.semester as 1 | 2) ?? initialSemester ?? 1);
        setGradeType(initialGradeType ?? "N1");
        setValue(getValueFromGrade(g, (g.semester as 1 | 2) ?? initialSemester ?? 1, initialGradeType ?? "N1"));
        setEditingLoaded(true);
        setStep(1);
      } catch (e) {
        if (!cancelled) setError("Erro ao carregar nota para edição.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [gradeId, initialGradeType, initialSemester]);

  // Keep subject only if still valid when options change
  useEffect(() => {
    if (!selectedSubject) return;
    const stillValid = subjects.some((s) => s.id === selectedSubject);
    if (!stillValid) setSelectedSubject(null);
  }, [subjects, selectedSubject]);

  const classSelected = !!selectedClass;
  const studentSelected = !!selectedStudent;
  const subjectSelected = !!selectedSubject;
  const semesterSelected = !!semester;
  const gradeTypeSelected = !!gradeType;

  const numericValue = useMemo(() => (value === "" ? null : Number(value)), [value]);
  const valueValid = numericValue !== null && !Number.isNaN(numericValue) && numericValue >= 0 && numericValue <= 10;

  const currentStepValid = useMemo(() => {
    if (step === 1) return classSelected;
    if (step === 2) return classSelected && studentSelected;
    if (step === 3) return classSelected && studentSelected && subjectSelected;
    if (step === 4) return classSelected && studentSelected && subjectSelected && semesterSelected;
    return classSelected && studentSelected && subjectSelected && semesterSelected && gradeTypeSelected && valueValid;
  }, [classSelected, studentSelected, subjectSelected, semesterSelected, gradeTypeSelected, step, valueValid]);

  const isBusy = loading || classesLoading || studentsLoading || subjectsLoading;

  const goNext = () => {
    if (!currentStepValid) return;
    setStep((prev) => (prev === 5 ? 5 : ((prev + 1) as any)));
  };

  const goBack = () => setStep((prev) => (prev === 1 ? 1 : ((prev - 1) as any)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult("");

    if (!currentStepValid) {
      setError("Preencha os campos obrigatórios antes de continuar.");
      return;
    }

    if (!selectedStudent || !selectedSubject || !selectedClass) {
      setError("Selecione turma, aluno e disciplina.");
      return;
    }

    if (!valueValid || numericValue === null) {
      setError("A nota deve estar entre 0 e 10.");
      return;
    }

    setLoading(true);
    try {
      const noteField = getNoteField(semester, gradeType);

      if (gradeId) {
        if (!editingGrade || !editingEnrollmentId || !editingLoaded) {
          setError("Não foi possível carregar a nota para edição.");
          return;
        }

        const previousSemester = ((editingGrade.semester as 1 | 2) ?? semester) as 1 | 2;
        const previousGradeType = initialGradeType ?? gradeType;
        const previousField = getNoteField(previousSemester, previousGradeType);

        const base = {
          enrollmentId: editingEnrollmentId,
          studentId: selectedStudent,
          subjectId: selectedSubject,
          semester,
        };

        const payload: any = normalizeFullPayload(editingGrade, base);

        // Move grade if type/semester changed (PUT allows clearing with null)
        if (previousField !== noteField) {
          payload[previousField] = null;
        }
        payload[noteField] = numericValue;

        const updated = await updateGrade(gradeId, payload);
        setEditingGrade(updated);
        setResult("Nota atualizada com sucesso!");
        onSaved?.();
        return;
      }

      const enrollments = await enrollmentService.getByStudentAndSubject(selectedStudent, selectedSubject);
      if (!enrollments || enrollments.length === 0) {
        setError("Matrícula não encontrada para este aluno e disciplina");
        return;
      }
      const enrollment = enrollments[0];
      if (!enrollment?.id) {
        setError("Matrícula inválida.");
        return;
      }

      const gradeData: any = {
        enrollmentId: enrollment.id,
        studentId: selectedStudent,
        subjectId: selectedSubject,
        semester,
        [noteField]: numericValue,
      };

      await createGrade(gradeData);
      setResult("Nota lançada com sucesso!");
      setValue("");
      setGradeType("N1");
      setSemester(1);
      setStep(1);
      setSelectedClass(null);
      setSelectedStudent(null);
      setSelectedSubject(null);
      onSaved?.();
    } catch (err) {
      console.error(err);
      setError("Erro ao lançar nota. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6 rounded-lg border border-input bg-background p-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-foreground">
          {gradeId ? "Editar Nota" : "Lançar Nota"}
        </h2>
        <p className="text-sm text-muted-foreground">{progressLabel}</p>
        <div className="h-2 w-full rounded-full bg-muted">
          <div
            className="h-2 rounded-full bg-primary transition-all"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
          {error}
        </div>
      )}
      {result && (
        <div className="rounded-md bg-green-100 p-3 text-green-800 text-sm">
          {result}
        </div>
      )}

      {/* Step content */}
      <div className="animate-in fade-in-50 duration-300">
        {step === 1 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">Turma *</label>
            <select
              value={selectedClass || ""}
              onChange={(e) => {
                const newClassId = e.target.value ? Number(e.target.value) : null;
                setSelectedClass(newClassId);
                setSelectedStudent(null);
                setSelectedSubject(null);
                setSemester(initialSemester ?? 1);
                setGradeType(initialGradeType ?? "N1");
                setValue("");
              }}
              disabled={classesLoading || loading}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground disabled:opacity-50"
              required
            >
              <option value="">{classesLoading ? "Carregando turmas..." : "Selecione uma turma"}</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">Aluno *</label>
            <select
              value={selectedStudent || ""}
              onChange={(e) => {
                const nextStudent = e.target.value ? Number(e.target.value) : null;
                setSelectedStudent(nextStudent);

                // keep subject only if still valid
                if (selectedSubject && !subjects.some((s) => s.id === selectedSubject)) {
                  setSelectedSubject(null);
                }
              }}
              disabled={!selectedClass || studentsLoading}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground disabled:opacity-50"
              required
            >
              <option value="">
                {!selectedClass ? "Select a class first" : studentsLoading ? "Carregando alunos..." : "Selecione um aluno"}
              </option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">Disciplina *</label>
            <select
              value={selectedSubject || ""}
              onChange={(e) => setSelectedSubject(e.target.value ? Number(e.target.value) : null)}
              disabled={!selectedClass || subjectsLoading}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground disabled:opacity-50"
              required
            >
              <option value="">
                {!selectedClass ? "Select a class first" : subjectsLoading ? "Carregando disciplinas..." : "Selecione uma disciplina"}
              </option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">Semestre *</label>
            <select
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value) as 1 | 2)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
            >
              <option value={1}>1º Semestre</option>
              <option value={2}>2º Semestre</option>
            </select>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tipo da Nota *
              </label>
              <select
                value={gradeType}
                onChange={(e) => setGradeType(e.target.value as GradeType)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
              >
                <option value="N1">N1</option>
                <option value="N2">N2</option>
                <option value="N3">N3</option>
                <option value="N4">N4</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Valor da nota (0–10) *
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                placeholder="0 - 10"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground text-sm"
                required
              />
            </div>
          </div>
        )}
      </div>

      {/* Wizard controls */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 1 || isBusy}
          className="rounded-md border border-input bg-background px-4 py-2 text-foreground hover:bg-muted disabled:opacity-50"
        >
          Back
        </button>

        {step < 5 ? (
          <button
            type="button"
            onClick={goNext}
            disabled={!currentStepValid || isBusy}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={!currentStepValid || isBusy}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Salvando..." : gradeId ? "Salvar alterações" : "Lançar Nota"}
          </button>
        )}
      </div>
    </form>
  );
};

export default GradeForm;

