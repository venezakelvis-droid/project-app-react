export interface SchoolClass {
  id: number;
  name: string;
  description?: string;
  schoolYear?: number;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  birthDate?: string;
  classId: number;
  schoolClass?: SchoolClass;
}

export interface Teacher {
  id: number;
  name: string;
  email: string;
}

export interface Subject {
  id: number;
  name: string;
  teacherId?: number;
}

export interface Enrollment {
  studentId: number;
  subjectId: number;
}

export interface Grade {
  id?: number;
  studentId?: number;
  subjectId?: number;
  semester?: number;
  enrollmentId: number;
  /** Populated by backend for list views (avoid extra API calls) */
  studentName?: string | null;
  subjectName?: string | null;
  schoolClassName?: string | null;
  // Semester 1 - 4 notes
  note1Semester1?: number | null;
  note2Semester1?: number | null;
  note3Semester1?: number | null;
  note4Semester1?: number | null;
  // Semester 2 - 4 notes
  note1Semester2?: number | null;
  note2Semester2?: number | null;
  note3Semester2?: number | null;
  note4Semester2?: number | null;
  // Calculated averages
  averageSemester1?: number;
  averageSemester2?: number;
  finalAverage?: number;
  // Status: APROVADO | RECUPERAÇÃO | REPROVADO | INCOMPLETO
  status?: string;
}


export interface Attendance {
  id?: number;
  enrollmentId: number;
  semester: number; // 1 or 2
  totalClasses: number;
  absences: number;
  justifiedAbsences: number;
  delays: number;
  presencePercentage?: number;
}
