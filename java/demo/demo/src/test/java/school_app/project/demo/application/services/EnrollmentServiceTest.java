package school_app.project.demo.application.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import school_app.project.demo.application.dtos.EnrollmentDTO;
import school_app.project.demo.domain.entities.Enrollment;
import school_app.project.demo.domain.entities.SchoolClass;
import school_app.project.demo.domain.entities.Student;
import school_app.project.demo.domain.entities.Subject;
import school_app.project.demo.domain.exceptions.EnrollmentAlreadyExistsException;
import school_app.project.demo.domain.exceptions.ResourceNotFoundException;
import school_app.project.demo.infrastructure.repositories.EnrollmentRepository;
import school_app.project.demo.infrastructure.repositories.SchoolClassRepository;
import school_app.project.demo.infrastructure.repositories.StudentRepository;
import school_app.project.demo.infrastructure.repositories.SubjectRepository;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EnrollmentServiceTest {

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private SubjectRepository subjectRepository;

    @Mock
    private SchoolClassRepository schoolClassRepository;

    @InjectMocks
    private EnrollmentService enrollmentService;

    @Test
    void shouldEnrollStudent() {
        EnrollmentDTO dto = EnrollmentDTO.builder()
                .studentId(1L)
                .subjectId(2L)
                .schoolClassId(3L)
                .enrollmentDate(LocalDate.now())
                .status("ACTIVE")
                .build();

        Student student = Student.builder().id(1L).build();
        Subject subject = Subject.builder().id(2L).build();
        SchoolClass schoolClass = SchoolClass.builder().id(3L).build();
        Enrollment saved = Enrollment.builder().id(4L).student(student).subject(subject).schoolClass(schoolClass).build();

        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(subjectRepository.findById(2L)).thenReturn(Optional.of(subject));
        when(schoolClassRepository.findById(3L)).thenReturn(Optional.of(schoolClass));
        when(enrollmentRepository.findByStudentIdAndSubjectId(1L, 2L)).thenReturn(Optional.empty());
        when(enrollmentRepository.save(any(Enrollment.class))).thenReturn(saved);

        EnrollmentDTO result = enrollmentService.enroll(dto);

        assertEquals(4L, result.getId());
        assertEquals(1L, result.getStudentId());
    }

    @Test
    void shouldThrowWhenDuplicateEnrollment() {
        EnrollmentDTO dto = EnrollmentDTO.builder().studentId(1L).subjectId(2L).schoolClassId(3L).build();
        Student student = Student.builder().id(1L).build();
        Subject subject = Subject.builder().id(2L).build();
        Enrollment existing = Enrollment.builder().id(5L).student(student).subject(subject).build();

        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(subjectRepository.findById(2L)).thenReturn(Optional.of(subject));
        when(schoolClassRepository.findById(3L)).thenReturn(Optional.of(SchoolClass.builder().id(3L).build()));
        when(enrollmentRepository.findByStudentIdAndSubjectId(1L, 2L)).thenReturn(Optional.of(existing));

        assertThrows(EnrollmentAlreadyExistsException.class, () -> enrollmentService.enroll(dto));
    }

    @Test
    void shouldThrowWhenStudentMissing() {
        when(studentRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> enrollmentService.enroll(EnrollmentDTO.builder().studentId(1L).subjectId(2L).schoolClassId(3L).build()));
    }
}
