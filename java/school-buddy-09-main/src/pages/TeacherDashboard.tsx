import { useState, useEffect } from "react";
import api from "@/api/client";
import DashboardCard from "@/components/DashboardCard";
import GradeForm from "@/components/GradeForm";

const TeacherDashboard = () => {
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    api.get("/subjects/teacher").then((r) => setSubjects(r.data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Painel do Professor</h2>
      <DashboardCard title="Minhas Disciplinas">
        {subjects.length === 0 ? <p className="text-muted-foreground">Nenhuma disciplina.</p> : (
          <ul className="space-y-1">{subjects.map((s, i) => <li key={i} className="text-sm text-card-foreground">{s.name}</li>)}</ul>
        )}
      </DashboardCard>
      <DashboardCard title="Lançar Nota">
        <GradeForm />
      </DashboardCard>
    </div>
  );
};

export default TeacherDashboard;
