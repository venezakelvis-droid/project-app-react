package school_app.project.demo.application.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import school_app.project.demo.application.dtos.StudentDTO;
import school_app.project.demo.application.dtos.SubjectDTO;
import school_app.project.demo.application.dtos.GradeDTO;
import school_app.project.demo.application.utils.AuthorizationHelper;
import school_app.project.demo.domain.entities.*;
import school_app.project.demo.infrastructure.repositories.*;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@DisplayName("Teacher Permission Tests - CRITICAL SECURITY VALIDATION")
public class TeacherPermissionTests {

    @Mock
    private StudentRepository studentRepository;
    
    @Mock
    private SubjectRepository subjectRepository;
    
    @Mock
    private EnrollmentRepository enrollmentRepository;
    
    @Mock
    private GradeRepository gradeRepository;
    
    @Mock
    private TeacherRepository teacherRepository;
    
    @Mock
    private AuthorizationHelper authorizationHelper;

    @InjectMocks
    private StudentService studentService;
    
    @InjectMocks
    private SubjectService subjectService;
    
    @InjectMocks
    private GradeService gradeService;

    private Student testStudent;
    private Subject testSubject;
    private Teacher teacherA;
    private Teacher teacherB;
    private Enrollment testEnrollment;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Create test teachers
        teacherA = Teacher.builder()
                .id(1L)
                .name("Teacher A")
                .cpf("111.111.111-11")
                .email("teachera@email.com")
                .build();

        teacherB = Teacher.builder()
                .id(2L)
                .name("Teacher B")
                .cpf("222.222.222-22")
                .email("teacherb@email.com")
                .build();

        // Create test student
        testStudent = Student.builder()
                .id(1L)
                .name("Student Test")
                .cpf("999.999.999-99")
                .email("student@email.com")
                .build();

        // Create test subject (owned by teacherA)
        testSubject = Subject.builder()
                .id(1L)
                .name("Mathematics")
                .description("Math Subject")
                .teacher(teacherA)
                .build();

        // Create test enrollment
        testEnrollment = Enrollment.builder()
                .id(1L)
                .student(testStudent)
                .subject(testSubject)
                .build();
    }

    // ============== STUDENT UPDATE/DELETE TESTS ==============

    @Test
    @DisplayName("TEACHER CANNOT UPDATE STUDENT - Must return error")
    void testTeacherCannotUpdateStudent() {
        // Setup: Teacher is authenticated
        when(authorizationHelper.isAdmin()).thenReturn(false);
        when(authorizationHelper.isTeacher()).thenReturn(true);
        
        when(studentRepository.findById(1L)).thenReturn(Optional.of(testStudent));

        StudentDTO dto = new StudentDTO();
        dto.setName("Updated Name");

        // Act & Assert: Must throw error
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            studentService.update(1L, dto);
        });

        assertTrue(exception.getMessage().contains("Access denied"));
        assertTrue(exception.getMessage().contains("Only admins can update students"));
    }

    @Test
    @DisplayName("TEACHER CANNOT DELETE STUDENT - Must return error")
    void testTeacherCannotDeleteStudent() {
        // Setup: Teacher is authenticated
        when(authorizationHelper.isAdmin()).thenReturn(false);
        when(authorizationHelper.isTeacher()).thenReturn(true);
        
        when(studentRepository.findById(1L)).thenReturn(Optional.of(testStudent));

        // Act & Assert: Must throw error
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            studentService.delete(1L);
        });

        assertTrue(exception.getMessage().contains("Access denied"));
        assertTrue(exception.getMessage().contains("Only admins can delete students"));
        
        // Verify delete was NOT called
        verify(studentRepository, never()).deleteById(1L);
    }

    @Test
    @DisplayName("ADMIN CAN UPDATE STUDENT - Success")
    void testAdminCanUpdateStudent() {
        // Setup: Admin is authenticated
        when(authorizationHelper.isAdmin()).thenReturn(true);
        
        Student updatedStudent = Student.builder()
                .id(1L)
                .name("Updated Name")
                .cpf("999.999.999-99")
                .email("student@email.com")
                .build();
        
        when(studentRepository.findById(1L)).thenReturn(Optional.of(testStudent));
        when(studentRepository.save(any(Student.class))).thenReturn(updatedStudent);

        StudentDTO dto = new StudentDTO();
        dto.setName("Updated Name");

        // Act
        StudentDTO result = studentService.update(1L, dto);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Name", result.getName());
        verify(studentRepository).save(any(Student.class));
    }

    // ============== SUBJECT UPDATE/DELETE TESTS ==============

    @Test
    @DisplayName("TEACHER CANNOT UPDATE SUBJECT - Must return error")
    void testTeacherCannotUpdateSubject() {
        // Setup: Teacher is authenticated
        when(authorizationHelper.isAdmin()).thenReturn(false);
        when(authorizationHelper.isTeacher()).thenReturn(true);
        
        when(subjectRepository.findById(1L)).thenReturn(Optional.of(testSubject));

        SubjectDTO dto = new SubjectDTO();
        dto.setName("Updated Subject");
        dto.setTeacherId(1L);

        // Act & Assert: Must throw error
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            subjectService.update(1L, dto);
        });

        assertTrue(exception.getMessage().contains("Access denied"));
        assertTrue(exception.getMessage().contains("Only admins can update subjects"));
    }

    @Test
    @DisplayName("TEACHER CANNOT DELETE SUBJECT - Must return error")
    void testTeacherCannotDeleteSubject() {
        // Setup: Teacher is authenticated
        when(authorizationHelper.isAdmin()).thenReturn(false);
        when(authorizationHelper.isTeacher()).thenReturn(true);
        
        when(subjectRepository.findById(1L)).thenReturn(Optional.of(testSubject));

        // Act & Assert: Must throw error
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            subjectService.delete(1L);
        });

        assertTrue(exception.getMessage().contains("Access denied"));
        assertTrue(exception.getMessage().contains("Only admins can delete subjects"));
        
        // Verify delete was NOT called
        verify(subjectRepository, never()).deleteById(1L);
    }

    @Test
    @DisplayName("ADMIN CAN UPDATE SUBJECT - Success")
    void testAdminCanUpdateSubject() {
        // Setup: Admin is authenticated
        when(authorizationHelper.isAdmin()).thenReturn(true);
        
        Subject updatedSubject = Subject.builder()
                .id(1L)
                .name("Updated Subject")
                .description("Updated")
                .teacher(teacherA)
                .build();
        
        when(subjectRepository.findById(1L)).thenReturn(Optional.of(testSubject));
        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacherA));
        when(subjectRepository.save(any(Subject.class))).thenReturn(updatedSubject);

        SubjectDTO dto = new SubjectDTO();
        dto.setName("Updated Subject");
        dto.setTeacherId(1L);

        // Act
        SubjectDTO result = subjectService.update(1L, dto);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Subject", result.getName());
        verify(subjectRepository).save(any(Subject.class));
    }

    // ============== GRADE ENTRY AUTHORIZATION TESTS ==============

    @Test
    @DisplayName("TEACHER CANNOT CREATE GRADE FOR UNOWNED SUBJECT - Must deny")
    void testTeacherCannotCreateGradeForOthersSubject() {
        // Setup: TeacherB tries to grade a subject owned by teacherA
        when(authorizationHelper.isAdmin()).thenReturn(false);
        when(authorizationHelper.isTeacher()).thenReturn(true);
        when(authorizationHelper.getCurrentTeacherId()).thenReturn(2L); // TeacherB

        testSubject.setTeacher(teacherA); // Subject belongs to TeacherA

        when(studentRepository.findById(1L)).thenReturn(Optional.of(testStudent));
        when(subjectRepository.findById(1L)).thenReturn(Optional.of(testSubject));
        when(enrollmentRepository.findById(1L)).thenReturn(Optional.of(testEnrollment));

        GradeDTO dto = new GradeDTO();
        dto.setStudentId(1L);
        dto.setSubjectId(1L);
        dto.setEnrollmentId(1L);

        // Act & Assert: Must deny access
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            gradeService.create(dto);
        });

        assertTrue(exception.getMessage().contains("Access denied"));
        assertTrue(exception.getMessage().contains("You can only create grades for your subjects"));
    }

    @Test
    @DisplayName("TEACHER CANNOT CREATE GRADE FOR STUDENT NOT ENROLLED - Must deny")
    void testTeacherCannotCreateGradeForNotEnrolledStudent() {
        // Setup: TeacherA tries to grade student not enrolled in their subject
        when(authorizationHelper.isAdmin()).thenReturn(false);
        when(authorizationHelper.isTeacher()).thenReturn(true);
        when(authorizationHelper.getCurrentTeacherId()).thenReturn(1L); // TeacherA

        testSubject.setTeacher(teacherA);

        Student otherStudent = Student.builder()
                .id(2L)
                .name("Other Student")
                .build();
        
        Enrollment wrongEnrollment = Enrollment.builder()
                .id(2L)
                .student(otherStudent)
                .subject(testSubject)
                .build();

        when(studentRepository.findById(1L)).thenReturn(Optional.of(testStudent));
        when(subjectRepository.findById(1L)).thenReturn(Optional.of(testSubject));
        when(enrollmentRepository.findById(2L)).thenReturn(Optional.of(wrongEnrollment));

        GradeDTO dto = new GradeDTO();
        dto.setStudentId(1L);
        dto.setSubjectId(1L);
        dto.setEnrollmentId(2L);

        // Act & Assert: Must deny access
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            gradeService.create(dto);
        });

        assertTrue(exception.getMessage().contains("Access denied"));
    }

    @Test
    @DisplayName("TEACHER CAN CREATE GRADE FOR OWN SUBJECT AND ENROLLED STUDENT - Success")
    void testTeacherCanCreateGradeForOwnSubjectAndEnrolledStudent() {
        // Setup: TeacherA creates grade for their subject and enrolled student
        when(authorizationHelper.isAdmin()).thenReturn(false);
        when(authorizationHelper.isTeacher()).thenReturn(true);
        when(authorizationHelper.getCurrentTeacherId()).thenReturn(1L); // TeacherA

        testSubject.setTeacher(teacherA);
        testEnrollment.setStudent(testStudent);
        testEnrollment.setSubject(testSubject);

        Grade savedGrade = Grade.builder()
                .id(1L)
                .student(testStudent)
                .subject(testSubject)
                .enrollment(testEnrollment)
                .note1Semester1(8.0)
                .build();

        when(studentRepository.findById(1L)).thenReturn(Optional.of(testStudent));
        when(subjectRepository.findById(1L)).thenReturn(Optional.of(testSubject));
        when(enrollmentRepository.findById(1L)).thenReturn(Optional.of(testEnrollment));
        when(gradeRepository.save(any(Grade.class))).thenReturn(savedGrade);

        GradeDTO dto = new GradeDTO();
        dto.setStudentId(1L);
        dto.setSubjectId(1L);
        dto.setEnrollmentId(1L);
        dto.setNote1Semester1(8.0);

        // Act
        assertDoesNotThrow(() -> {
            gradeService.create(dto);
        });

        // Assert: Grade was saved
        verify(gradeRepository).save(any(Grade.class));
    }

    @Test
    @DisplayName("ADMIN CAN CREATE GRADE FOR ANY SUBJECT/STUDENT - Success")
    void testAdminCanCreateGradeForAnything() {
        // Setup: Admin can create grades for anyone
        when(authorizationHelper.isAdmin()).thenReturn(true);

        Grade savedGrade = Grade.builder()
                .id(1L)
                .student(testStudent)
                .subject(testSubject)
                .enrollment(testEnrollment)
                .note1Semester1(8.0)
                .build();

        when(studentRepository.findById(1L)).thenReturn(Optional.of(testStudent));
        when(subjectRepository.findById(1L)).thenReturn(Optional.of(testSubject));
        when(enrollmentRepository.findById(1L)).thenReturn(Optional.of(testEnrollment));
        when(gradeRepository.save(any(Grade.class))).thenReturn(savedGrade);

        GradeDTO dto = new GradeDTO();
        dto.setStudentId(1L);
        dto.setSubjectId(1L);
        dto.setEnrollmentId(1L);
        dto.setNote1Semester1(8.0);

        // Act
        assertDoesNotThrow(() -> {
            gradeService.create(dto);
        });

        // Assert: Grade was saved
        verify(gradeRepository).save(any(Grade.class));
    }

}
