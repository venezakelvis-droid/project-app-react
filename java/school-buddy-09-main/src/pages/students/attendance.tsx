import { useEffect } from "react";
import { useAttendance } from "@/hooks/useAttendance";
import { XCircle, FileText, Clock, Users } from "lucide-react";

const StudentAttendancePage = () => {
    const { attendance, loading, error, fetchStudentAttendance } = useAttendance({ fetchOnMount: false });

    useEffect(() => {
        fetchStudentAttendance();
    }, []);

    const getAttendanceColor = (percentage: number) => {
        if (percentage >= 75) return "text-green-600";
        if (percentage >= 50) return "text-yellow-600";
        return "text-red-600";
    };

    const getAttendanceStatus = (percentage: number) => {
        if (percentage >= 75) return "Excelente";
        if (percentage >= 50) return "Regular";
        return "Crítico";
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Frequência</h1>

            {error && <p className="text-destructive text-sm">{error}</p>}

            {loading ? (
                <p className="text-muted-foreground">Carregando frequência...</p>
            ) : attendance.length === 0 ? (
                <p className="text-muted-foreground">Nenhum registro de frequência encontrado.</p>
            ) : (
                <div className="space-y-8">
                    {attendance.map((att, idx) => (
                        <div key={att.id || idx} className="rounded-lg border border-border bg-card p-6">
                            {/* Header */}
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-foreground">
                                    Disciplina {att.enrollmentId}
                                </h2>
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    <span className={`text-sm font-medium ${getAttendanceColor(att.presencePercentage || 0)}`}>
                                        {att.presencePercentage?.toFixed(1) || 0}% - {getAttendanceStatus(att.presencePercentage || 0)}
                                    </span>
                                </div>
                            </div>

                            {/* Semester Info */}
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-foreground">{att.semester}º Semestre</h3>
                            </div>

                            {/* Attendance Stats */}
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="rounded-md border border-input bg-background p-4 text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <XCircle className="w-4 h-4 text-red-500" />
                                        <p className="text-sm text-muted-foreground">Faltas</p>
                                    </div>
                                    <p className="text-2xl font-bold text-foreground">{att.absences || 0}</p>
                                </div>

                                <div className="rounded-md border border-input bg-background p-4 text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <FileText className="w-4 h-4 text-blue-500" />
                                        <p className="text-sm text-muted-foreground">Justificadas</p>
                                    </div>
                                    <p className="text-2xl font-bold text-foreground">{att.justifiedAbsences || 0}</p>
                                </div>

                                <div className="rounded-md border border-input bg-background p-4 text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Clock className="w-4 h-4 text-yellow-500" />
                                        <p className="text-sm text-muted-foreground">Atrasos</p>
                                    </div>
                                    <p className="text-2xl font-bold text-foreground">{att.delays || 0}</p>
                                </div>

                                <div className="rounded-md border border-input bg-background p-4 text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Users className="w-4 h-4 text-green-500" />
                                        <p className="text-sm text-muted-foreground">Total Aulas</p>
                                    </div>
                                    <p className="text-2xl font-bold text-foreground">{att.totalClasses || 0}</p>
                                </div>
                            </div>

                            {/* Presence Percentage */}
                            {att.presencePercentage !== null && att.presencePercentage !== undefined && (
                                <div className="mt-6 rounded-md border-t-4 border-t-primary bg-primary/5 p-4">
                                    <p className="text-sm font-medium text-muted-foreground">Percentual de Presença</p>
                                    <p className={`text-3xl font-bold ${getAttendanceColor(att.presencePercentage)}`}>
                                        {att.presencePercentage.toFixed(1)}%
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Status: {getAttendanceStatus(att.presencePercentage)}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentAttendancePage;
