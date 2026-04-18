import { useState, useEffect } from "react";
import api from "@/api/client";
import DashboardCard from "@/components/DashboardCard";

const StudentDashboard = () => {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);

  useEffect(() => {
    api.get("/enrollments/student").then((r) => setEnrollments(r.data)).catch(() => {});
    api.get("/grades/student").then((r) => setGrades(r.data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Painel do Aluno</h2>
      <DashboardCard title="Minhas Matrículas">
        {enrollments.length === 0 ? <p className="text-muted-foreground">Nenhuma matrícula.</p> : (
          <ul className="space-y-1">{enrollments.map((e, i) => <li key={i} className="text-sm text-card-foreground">{e.subjectName || `Disciplina ${e.subjectId}`}</li>)}</ul>
        )}
      </DashboardCard>
      <DashboardCard title="Minhas Notas">
        {grades.length === 0 ? <p className="text-muted-foreground">Nenhuma nota.</p> : (
          <ul className="space-y-1">{grades.map((g, i) => <li key={i} className="text-sm text-card-foreground">{g.subjectName || `Disciplina ${g.subjectId}`}: {g.value}</li>)}</ul>
        )}
      </DashboardCard>
    </div>
  );
};

export default StudentDashboard;
