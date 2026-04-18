import StudentList from "@/components/StudentList";
import StudentForm from "@/components/StudentForm";
import TeacherForm from "@/components/TeacherForm";
import SubjectForm from "@/components/SubjectForm";
import EnrollmentForm from "@/components/EnrollmentForm";
import DashboardCard from "@/components/DashboardCard";

const AdminDashboard = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-foreground">Painel Admin</h2>
    <DashboardCard title="Alunos">
      <StudentList />
      <div className="mt-4 border-t border-border pt-4"><StudentForm /></div>
    </DashboardCard>
    <DashboardCard title="Professores"><TeacherForm /></DashboardCard>
    <DashboardCard title="Disciplinas"><SubjectForm /></DashboardCard>
    <DashboardCard title="Matrículas"><EnrollmentForm /></DashboardCard>
  </div>
);

export default AdminDashboard;
