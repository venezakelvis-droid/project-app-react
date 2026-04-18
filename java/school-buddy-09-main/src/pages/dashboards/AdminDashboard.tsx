import { useState } from "react";
import { Users, BookOpen, ClipboardList, Layers } from "lucide-react";
import StatCard from "@/components/StatCard";
import SectionCard from "@/components/SectionCard";
import StudentList from "@/components/StudentList";
import StudentForm from "@/components/StudentForm";
import TeacherForm from "@/components/TeacherForm";
import SubjectForm from "@/components/SubjectForm";
import EnrollmentForm from "@/components/EnrollmentForm";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<"alunos" | "professores" | "disciplinas" | "matriculas">("alunos");

  const sections = [
    { id: "alunos", label: "Alunos", icon: <Users className="w-4 h-4" /> },
    { id: "professores", label: "Professores", icon: <BookOpen className="w-4 h-4" /> },
    { id: "disciplinas", label: "Disciplinas", icon: <ClipboardList className="w-4 h-4" /> },
    { id: "matriculas", label: "Matrículas", icon: <Layers className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Painel de Administração</h1>
        <p className="text-muted-foreground">Gerencie alunos, professores, disciplinas e matrículas</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Alunos"
          value="5"
          description="Alunos ativos"
          icon="👥"
          variant="default"
        />
        <StatCard
          title="Total de Professores"
          value="3"
          description="Professores"
          icon="👨‍🏫"
          variant="accent"
        />
        <StatCard
          title="Total de Disciplinas"
          value="5"
          description="Disciplinas ativas"
          icon="📚"
          variant="secondary"
        />
        <StatCard
          title="Total de Matrículas"
          value="10"
          description="Registros"
          icon="📋"
          variant="default"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-border overflow-x-auto pb-0 bg-background rounded-t-lg">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id as any)}
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
              activeSection === section.id
                ? "text-primary border-b-2 border-primary bg-primary/5"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {section.icon}
            {section.label}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {/* Alunos Section */}
        {activeSection === "alunos" && (
          <div className="space-y-4 animate-in fade-in-50 duration-300">
            <SectionCard
              title="Gerenciar Alunos"
              description="Visualize, adicione ou remova alunos do sistema"
            >
              <StudentList />
            </SectionCard>
            <SectionCard
              title="Adicionar Novo Aluno"
              description="Preencha o formulário abaixo para cadastrar um novo aluno"
            >
              <StudentForm />
            </SectionCard>
          </div>
        )}

        {/* Professores Section */}
        {activeSection === "professores" && (
          <div className="animate-in fade-in-50 duration-300">
            <SectionCard
              title="Gerenciar Professores"
              description="Adicione ou gerencie professores do sistema"
            >
              <TeacherForm />
            </SectionCard>
          </div>
        )}

        {/* Disciplinas Section */}
        {activeSection === "disciplinas" && (
          <div className="animate-in fade-in-50 duration-300">
            <SectionCard
              title="Gerenciar Disciplinas"
              description="Crie ou modifique disciplinas"
            >
              <SubjectForm />
            </SectionCard>
          </div>
        )}

        {/* Matrículas Section */}
        {activeSection === "matriculas" && (
          <div className="animate-in fade-in-50 duration-300">
            <SectionCard
              title="Gerenciar Matrículas"
              description="Matrícule alunos em disciplinas"
            >
              <EnrollmentForm />
            </SectionCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
