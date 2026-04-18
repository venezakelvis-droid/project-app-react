package school_app.project.demo.infrastructure.seed;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import school_app.project.demo.application.services.UserService;
import school_app.project.demo.domain.entities.*;
import school_app.project.demo.infrastructure.repositories.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;
    private final SubjectRepository subjectRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final GradeRepository gradeRepository;
    private final AttendanceRepository attendanceRepository;
    private final UserService userService;

    @Override
    public void run(String... args) {
        if (studentRepository.count() > 0) return;
        if (userRepository.count() > 0) return;
        seedDatabase();
    }

    private void seedDatabase() {
        // 1. FIRST: Create Teachers
        Teacher t1 = teacherRepository.save(Teacher.builder()
                .name("João Silva").cpf("123.456.789-00").email("joao@email.com")
                .phone("11999999999").specialty("Mathematics").hireDate(LocalDate.of(2020, 1, 15)).build());
        
        Teacher t2 = teacherRepository.save(Teacher.builder()
                .name("Maria Santos").cpf("123.456.789-01").email("maria@email.com")
                .phone("11999999998").specialty("Portuguese").hireDate(LocalDate.of(2021, 3, 10)).build());
        
        Teacher t3 = teacherRepository.save(Teacher.builder()
                .name("Pedro Oliveira").cpf("123.456.789-02").email("pedro@email.com")
                .phone("11999999997").specialty("Science").hireDate(LocalDate.of(2022, 5, 20)).build());

        // 2. SECOND: Create SchoolClasses (linked to Teachers)
        SchoolClass sc1 = schoolClassRepository.save(SchoolClass.builder()
                .name("1A").schoolYear(1).semester(1).room("101").shift("MORNING").teacher(t1).build());
        SchoolClass sc2 = schoolClassRepository.save(SchoolClass.builder()
                .name("1B").schoolYear(1).semester(1).room("102").shift("MORNING").teacher(t2).build());
        SchoolClass sc3 = schoolClassRepository.save(SchoolClass.builder()
                .name("2A").schoolYear(2).semester(1).room("201").shift("AFTERNOON").teacher(t1).build());

        // 3. THIRD: Create Subjects (linked to Teachers)
        Subject s1 = subjectRepository.save(Subject.builder().name("Mathematics").workloadHours(80).description("Math basics").teacher(t1).build());
        Subject s2 = subjectRepository.save(Subject.builder().name("Portuguese").workloadHours(60).description("Language skills").teacher(t2).build());
        Subject s3 = subjectRepository.save(Subject.builder().name("Science").workloadHours(90).description("Natural sciences").teacher(t3).build());
        Subject s4 = subjectRepository.save(Subject.builder().name("History").workloadHours(60).description("World history").teacher(t1).build());
        Subject s5 = subjectRepository.save(Subject.builder().name("Geography").workloadHours(60).description("Geography basics").teacher(t2).build());

        // 4. FOURTH: Create Students WITH schoolClass (MANDATORY NOW)
        Student st1 = studentRepository.save(Student.builder()
                .name("Ana Costa").cpf("987.654.321-00").email("ana@email.com")
                .phone("21988888888").enrollmentNumber("2024001").enrollmentDate(LocalDate.of(2024, 1, 10))
                .status("ACTIVE").schoolClass(sc1).build());
        
        Student st2 = studentRepository.save(Student.builder()
                .name("Bruno Ferreira").cpf("987.654.321-01").email("bruno@email.com")
                .phone("21988888887").enrollmentNumber("2024002").enrollmentDate(LocalDate.of(2024, 1, 10))
                .status("ACTIVE").schoolClass(sc1).build());
        
        Student st3 = studentRepository.save(Student.builder()
                .name("Carla Mendes").cpf("987.654.321-02").email("carla@email.com")
                .phone("21988888886").enrollmentNumber("2024003").enrollmentDate(LocalDate.of(2024, 1, 10))
                .status("ACTIVE").schoolClass(sc2).build());
        
        Student st4 = studentRepository.save(Student.builder()
                .name("Diego Alves").cpf("987.654.321-03").email("diego@email.com")
                .phone("21988888885").enrollmentNumber("2024004").enrollmentDate(LocalDate.of(2024, 1, 10))
                .status("ACTIVE").schoolClass(sc2).build());
        
        Student st5 = studentRepository.save(Student.builder()
                .name("Elisa Rocha").cpf("987.654.321-04").email("elisa@email.com")
                .phone("21988888884").enrollmentNumber("2024005").enrollmentDate(LocalDate.of(2024, 1, 10))
                .status("ACTIVE").schoolClass(sc3).build());

        // Create Enrollments for Class 1A
        // Student st1 in 1A: Math (t1), Portuguese (t2)
        Enrollment e1 = enrollmentRepository.save(Enrollment.builder().student(st1).subject(s1).schoolClass(sc1).enrollmentDate(LocalDate.of(2024, 2, 1)).status("ACTIVE").build());
        Enrollment e2 = enrollmentRepository.save(Enrollment.builder().student(st1).subject(s2).schoolClass(sc1).enrollmentDate(LocalDate.of(2024, 2, 1)).status("ACTIVE").build());
        
        // Student st2 in 1A: Portuguese (t2), Science (t3)
        Enrollment e3 = enrollmentRepository.save(Enrollment.builder().student(st2).subject(s2).schoolClass(sc1).enrollmentDate(LocalDate.of(2024, 2, 1)).status("ACTIVE").build());
        Enrollment e4 = enrollmentRepository.save(Enrollment.builder().student(st2).subject(s3).schoolClass(sc1).enrollmentDate(LocalDate.of(2024, 2, 1)).status("ACTIVE").build());
        
        // Create Enrollments for Class 1B
        // Student st3 in 1B: Portuguese (t2), History (t1)
        Enrollment e5 = enrollmentRepository.save(Enrollment.builder().student(st3).subject(s2).schoolClass(sc2).enrollmentDate(LocalDate.of(2024, 2, 1)).status("ACTIVE").build());
        Enrollment e6 = enrollmentRepository.save(Enrollment.builder().student(st3).subject(s4).schoolClass(sc2).enrollmentDate(LocalDate.of(2024, 2, 1)).status("ACTIVE").build());
        
        // Student st4 in 1B: Science (t3), Geography (t2)
        Enrollment e7 = enrollmentRepository.save(Enrollment.builder().student(st4).subject(s3).schoolClass(sc2).enrollmentDate(LocalDate.of(2024, 2, 1)).status("ACTIVE").build());
        Enrollment e8 = enrollmentRepository.save(Enrollment.builder().student(st4).subject(s5).schoolClass(sc2).enrollmentDate(LocalDate.of(2024, 2, 1)).status("ACTIVE").build());
        
        // Create Enrollments for Class 2A
        // Student st5 in 2A: Math (t1), History (t1)
        Enrollment e9 = enrollmentRepository.save(Enrollment.builder().student(st5).subject(s1).schoolClass(sc3).enrollmentDate(LocalDate.of(2024, 2, 1)).status("ACTIVE").build());
        Enrollment e10 = enrollmentRepository.save(Enrollment.builder().student(st5).subject(s4).schoolClass(sc3).enrollmentDate(LocalDate.of(2024, 2, 1)).status("ACTIVE").build());

        // Create Grade rows per student + subject + semester
        seedGrade(e1, st1, s1, 1, 8.5, 8.5, 8.5, 8.5, null, null, null, null); // Math S1
        seedGrade(e1, st1, s1, 2, null, null, null, null, 8.0, 8.5, 8.0, 8.5); // Math S2
        seedGrade(e2, st1, s2, 1, 9.0, 8.5, 8.5, 9.0, null, null, null, null); // Portuguese S1
        seedGrade(e2, st1, s2, 2, null, null, null, null, 8.0, 8.5, 7.5, 8.0); // Portuguese S2

        seedGrade(e3, st2, s2, 1, 7.5, 8.0, 7.5, 8.0, null, null, null, null); // Portuguese S1
        seedGrade(e3, st2, s2, 2, null, null, null, null, 6.0, 6.5, 7.0, 6.5); // Portuguese S2
        seedGrade(e4, st2, s3, 1, 8.0, 7.5, 8.0, 7.0, null, null, null, null); // Science S1
        seedGrade(e4, st2, s3, 2, null, null, null, null, 7.5, 7.0, 7.5, 7.0); // Science S2

        seedGrade(e5, st3, s1, 1, 8.0, 7.5, 8.0, 8.0, null, null, null, null); // Math S1
        seedGrade(e5, st3, s1, 2, null, null, null, null, 7.0, 7.5, 7.0, 7.5); // Math S2
        seedGrade(e6, st3, s4, 1, 7.5, 8.0, 7.5, 8.0, null, null, null, null); // History S1
        seedGrade(e6, st3, s4, 2, null, null, null, null, 6.5, 7.0, 6.5, 7.0); // History S2

        seedGrade(e7, st4, s3, 1, 8.5, 8.0, 8.5, 8.0, null, null, null, null); // Science S1
        seedGrade(e7, st4, s3, 2, null, null, null, null, 6.0, 6.5, 6.0, 6.5); // Science S2
        seedGrade(e8, st4, s5, 1, 7.5, 7.0, 7.5, 7.0, null, null, null, null); // Geography S1
        seedGrade(e8, st4, s5, 2, null, null, null, null, 8.0, 8.0, 8.0, 8.0); // Geography S2

        seedGrade(e9, st5, s4, 1, 9.0, 8.5, 9.0, 8.5, null, null, null, null); // History S1
        seedGrade(e9, st5, s4, 2, null, null, null, null, 7.0, 7.5, 7.0, 7.5); // History S2
        seedGrade(e10, st5, s5, 1, 8.0, 8.0, 8.5, 8.0, null, null, null, null); // Geography S1
        seedGrade(e10, st5, s5, 2, null, null, null, null, 7.5, 7.5, 7.5, 7.5); // Geography S2

        // Create Attendance records (Brazilian standard: per semester per subject)
        // Student 1 - Mathematics: Semester 1 (90% presence), Semester 2 (85% presence)
        Attendance att1s1 = Attendance.builder()
                .enrollment(e1).semester(1).totalClasses(80).absences(5).justifiedAbsences(3).delays(2).build();
        att1s1.calculatePresencePercentage();
        attendanceRepository.save(att1s1);

        Attendance att1s2 = Attendance.builder()
                .enrollment(e1).semester(2).totalClasses(80).absences(8).justifiedAbsences(4).delays(1).build();
        att1s2.calculatePresencePercentage();
        attendanceRepository.save(att1s2);

        // Student 2 - Portuguese: Semester 1 (95% presence), Semester 2 (80% presence)
        Attendance att2s1 = Attendance.builder()
                .enrollment(e2).semester(1).totalClasses(60).absences(2).justifiedAbsences(1).delays(0).build();
        att2s1.calculatePresencePercentage();
        attendanceRepository.save(att2s1);

        Attendance att2s2 = Attendance.builder()
                .enrollment(e2).semester(2).totalClasses(60).absences(10).justifiedAbsences(2).delays(3).build();
        att2s2.calculatePresencePercentage();
        attendanceRepository.save(att2s2);

        // Student 3 - Science: Semester 1 (88% presence), Semester 2 (92% presence)
        Attendance att3s1 = Attendance.builder()
                .enrollment(e3).semester(1).totalClasses(90).absences(8).justifiedAbsences(2).delays(1).build();
        att3s1.calculatePresencePercentage();
        attendanceRepository.save(att3s1);

        Attendance att3s2 = Attendance.builder()
                .enrollment(e3).semester(2).totalClasses(90).absences(5).justifiedAbsences(2).delays(0).build();
        att3s2.calculatePresencePercentage();
        attendanceRepository.save(att3s2);

        // Student 4 - History: Semester 1 (100% presence), Semester 2 (75% presence)
        Attendance att4s1 = Attendance.builder()
                .enrollment(e4).semester(1).totalClasses(60).absences(0).justifiedAbsences(0).delays(0).build();
        att4s1.calculatePresencePercentage();
        attendanceRepository.save(att4s1);

        Attendance att4s2 = Attendance.builder()
                .enrollment(e4).semester(2).totalClasses(60).absences(12).justifiedAbsences(3).delays(2).build();
        att4s2.calculatePresencePercentage();
        attendanceRepository.save(att4s2);

        // Student 5 - Geography: Semester 1 (82% presence), Semester 2 (90% presence)
        Attendance att5s1 = Attendance.builder()
                .enrollment(e5).semester(1).totalClasses(60).absences(9).justifiedAbsences(1).delays(1).build();
        att5s1.calculatePresencePercentage();
        attendanceRepository.save(att5s1);

        Attendance att5s2 = Attendance.builder()
                .enrollment(e5).semester(2).totalClasses(60).absences(4).justifiedAbsences(2).delays(0).build();
        att5s2.calculatePresencePercentage();
        attendanceRepository.save(att5s2);

        // Create Roles
        userService.ensureRole("ADMIN");
        userService.ensureRole("TEACHER");
        userService.ensureRole("STUDENT");
        userService.ensureRole("GUARDIAN");

        // Create Users
        userService.createUser("Admin User", "admin@gmail.com", "12345678", Set.of("ADMIN"), null, null);
        userService.createUser("João Silva", "joao@email.com", "12345678", Set.of("TEACHER"), null, t1);
        userService.createUser("Ana Costa", "ana@email.com", "12345678", Set.of("STUDENT"), st1, null);
        userService.createUser("Bruno Ferreira", "bruno@email.com", "12345678", Set.of("STUDENT"), st2, null);
        userService.createUser("Carlos Pereira", "carlos.guardian@email.com", "12345678", Set.of("GUARDIAN"), null, null, List.of(st1, st2));

        userService.createUser("ADMIN", "admin2@gmail.com", "123456789", Set.of("ADMIN"), null, null);
        //userService.createUser("Professor João", "teacher@gmail.com", "12345678", Set.of("TEACHER"), null, t2);
        //userService.createUser("Aluno Ana", "student@gmail.com", "12345678", Set.of("STUDENT"), st1, null);
    }

    private Grade seedGrade(Enrollment enrollment, Student student, Subject subject, Integer semester,
            Double note1Semester1, Double note2Semester1, Double note3Semester1, Double note4Semester1,
            Double note1Semester2, Double note2Semester2, Double note3Semester2, Double note4Semester2) {
        Grade grade = Grade.builder()
                .enrollment(enrollment)
                .student(student)
                .subject(subject)
                .semester(semester)
                .note1Semester1(note1Semester1)
                .note2Semester1(note2Semester1)
                .note3Semester1(note3Semester1)
                .note4Semester1(note4Semester1)
                .note1Semester2(note1Semester2)
                .note2Semester2(note2Semester2)
                .note3Semester2(note3Semester2)
                .note4Semester2(note4Semester2)
                .build();
        grade.calculateAverages();
        return gradeRepository.save(grade);
    }
}
