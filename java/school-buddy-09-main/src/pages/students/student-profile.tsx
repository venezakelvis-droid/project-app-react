import { useEffect } from "react";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { User, Mail, Phone, Calendar, FileText, Hash } from "lucide-react";

const StudentProfilePage = () => {
    const { profile, loading, error, fetchProfile } = useStudentProfile({ fetchOnMount: false });

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
                <p className="text-muted-foreground">Carregando perfil...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
                <p className="text-destructive text-sm">{error}</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
                <p className="text-muted-foreground">Perfil não encontrado.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>

            <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-foreground">{profile.name}</h2>
                        <p className="text-muted-foreground">Aluno</p>
                    </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="text-foreground">{profile.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Telefone</p>
                                <p className="text-foreground">{profile.phone || "Não informado"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">CPF</p>
                                <p className="text-foreground">{profile.cpf || "Não informado"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Hash className="w-5 h-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Número de Matrícula</p>
                                <p className="text-foreground">{profile.enrollmentNumber || "Não informado"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                                <p className="text-foreground">
                                    {profile.birthDate ? new Date(profile.birthDate).toLocaleDateString('pt-BR') : "Não informado"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Data de Matrícula</p>
                                <p className="text-foreground">
                                    {profile.enrollmentDate ? new Date(profile.enrollmentDate).toLocaleDateString('pt-BR') : "Não informado"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            profile.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                            profile.status === 'INACTIVE' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                            {profile.status === 'ACTIVE' ? 'Ativo' :
                             profile.status === 'INACTIVE' ? 'Inativo' : 'Suspenso'}
                        </div>
                        <span className="text-sm text-muted-foreground">Status da Matrícula</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfilePage;