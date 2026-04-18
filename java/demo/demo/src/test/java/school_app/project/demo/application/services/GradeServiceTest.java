package school_app.project.demo.application.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import school_app.project.demo.application.dtos.GradeDTO;
import school_app.project.demo.application.utils.AuthorizationHelper;
import school_app.project.demo.domain.entities.Enrollment;
import school_app.project.demo.domain.entities.Grade;
import school_app.project.demo.domain.entities.Student;
import school_app.project.demo.domain.entities.Subject;
import school_app.project.demo.domain.exceptions.GradeInvalidException;
import school_app.project.demo.domain.exceptions.ResourceNotFoundException;
import school_app.project.demo.infrastructure.repositories.EnrollmentRepository;
import school_app.project.demo.infrastructure.repositories.GradeRepository;
import school_app.project.demo.infrastructure.repositories.StudentRepository;
import school_app.project.demo.infrastructure.repositories.SubjectRepository;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GradeServiceTest {

    @Mock
    private GradeRepository gradeRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private SubjectRepository subjectRepository;

    @Mock
    private AuthorizationHelper authorizationHelper;

    @InjectMocks
    private GradeService gradeService;

    @Test
    void shouldCreateApprovedGrade() {
        GradeDTO dto = GradeDTO.builder()
                .studentId(1L)
                .subjectId(1L)
                .semester(1)
                .note1Semester1(8.0)
                .note2Semester1(8.0)
                .note3Semester1(8.0)
                .note4Semester1(8.0)
                .note1Semester2(7.0)
                .note2Semester2(7.0)
                .note3Semester2(7.0)
                .note4Semester2(7.0)
                .build();

        Student student = Student.builder().id(1L).build();
        Subject subject = Subject.builder().id(1L).build();
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(subjectRepository.findById(1L)).thenReturn(Optional.of(subject));
        when(gradeRepository.save(any(Grade.class))).thenAnswer(invocation -> {
            Grade grade = invocation.getArgument(0);
            grade.setId(1L);
            return grade;
        });

        GradeDTO result = gradeService.create(dto);

        assertEquals(1L, result.getId());
        assertEquals(8.0, result.getAverageSemester1());
        assertEquals(7.0, result.getAverageSemester2());
        assertEquals(7.5, result.getFinalAverage());
        assertEquals("APROVADO", result.getStatus());
    }

    @Test
    void shouldCreateFailedGrade() {
        GradeDTO dto = GradeDTO.builder()
                .studentId(1L)
                .subjectId(1L)
                .semester(1)
                .note1Semester1(5.0)
                .note2Semester1(5.0)
                .note3Semester1(5.0)
                .note4Semester1(5.0)
                .note1Semester2(4.0)
                .note2Semester2(4.0)
                .note3Semester2(4.0)
                .note4Semester2(4.0)
                .build();

        Student student = Student.builder().id(1L).build();
        Subject subject = Subject.builder().id(1L).build();
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(subjectRepository.findById(1L)).thenReturn(Optional.of(subject));
        when(gradeRepository.save(any(Grade.class))).thenAnswer(invocation -> invocation.getArgument(0));

        GradeDTO result = gradeService.create(dto);

        assertEquals(5.0, result.getAverageSemester1());
        assertEquals(4.0, result.getAverageSemester2());
        assertEquals(4.5, result.getFinalAverage());
        assertEquals("REPROVADO", result.getStatus());
    }

    @Test
    void shouldCreateRecoveryGrade() {
        GradeDTO dto = GradeDTO.builder()
                .studentId(1L)
                .subjectId(1L)
                .semester(1)
                .note1Semester1(6.0)
                .note2Semester1(6.0)
                .note3Semester1(6.0)
                .note4Semester1(6.0)
                .note1Semester2(5.0)
                .note2Semester2(5.0)
                .note3Semester2(5.0)
                .note4Semester2(5.0)
                .build();

        Student student = Student.builder().id(1L).build();
        Subject subject = Subject.builder().id(1L).build();
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(subjectRepository.findById(1L)).thenReturn(Optional.of(subject));
        when(gradeRepository.save(any(Grade.class))).thenAnswer(invocation -> invocation.getArgument(0));

        GradeDTO result = gradeService.create(dto);

        assertEquals(6.0, result.getAverageSemester1());
        assertEquals(5.0, result.getAverageSemester2());
        assertEquals(5.5, result.getFinalAverage());
        assertEquals("RECUPERAÇÃO", result.getStatus());
    }

    @Test
    void shouldThrowWhenGradeInvalid() {
        GradeDTO dto = GradeDTO.builder()
                .studentId(1L)
                .subjectId(1L)
                .semester(1)
                .note1Semester1(11.0)
                .note2Semester1(5.0)
                .note3Semester1(5.0)
                .note4Semester1(5.0)
                .note1Semester2(5.0)
                .note2Semester2(5.0)
                .note3Semester2(5.0)
                .note4Semester2(5.0)
                .build();

        Student student = Student.builder().id(1L).build();
        Subject subject = Subject.builder().id(1L).build();
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(subjectRepository.findById(1L)).thenReturn(Optional.of(subject));

        assertThrows(GradeInvalidException.class, () -> gradeService.create(dto));
    }

    @Test
    void shouldThrowWhenStudentMissing() {
        when(studentRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> gradeService.create(GradeDTO.builder()
                .studentId(1L)
                .subjectId(1L)
                .semester(1)
                .note1Semester1(8.0)
                .note2Semester1(8.0)
                .note3Semester1(8.0)
                .note4Semester1(8.0)
                .note1Semester2(8.0)
                .note2Semester2(8.0)
                .note3Semester2(8.0)
                .note4Semester2(8.0)
                .build()));
    }

    @Test
    void shouldCalculateSubjectFinalAverage() {
        Student student = Student.builder().id(1L).build();
        Subject subject = Subject.builder().id(1L).build();

        Grade grade1 = Grade.builder()
                .student(student)
                .subject(subject)
                .semester(1)
                .finalAverage(8.0)
                .build();

        Grade grade2 = Grade.builder()
                .student(student)
                .subject(subject)
                .semester(2)
                .finalAverage(7.0)
                .build();

        when(authorizationHelper.isAdmin()).thenReturn(true);
        when(gradeRepository.findByStudentIdAndSubjectId(1L, 1L))
                .thenReturn(List.of(grade1, grade2));

        Double result = gradeService.calculateSubjectFinalAverage(1L, 1L);

        assertEquals(7.5, result);
    }

    @Test
    void shouldCalculateStudentOverallAverage() {
        Student student = Student.builder().id(1L).build();
        Subject subject1 = Subject.builder().id(1L).build();
        Subject subject2 = Subject.builder().id(2L).build();

        Grade grade1 = Grade.builder()
                .student(student)
                .subject(subject1)
                .semester(1)
                .finalAverage(8.0)
                .build();

        Grade grade2 = Grade.builder()
                .student(student)
                .subject(subject2)
                .semester(1)
                .finalAverage(7.0)
                .build();

        when(authorizationHelper.isAdmin()).thenReturn(true);
        when(gradeRepository.findByStudentId(1L))
                .thenReturn(List.of(grade1, grade2));

        Double result = gradeService.calculateStudentOverallAverage(1L);

        assertEquals(7.5, result);
    }
}
