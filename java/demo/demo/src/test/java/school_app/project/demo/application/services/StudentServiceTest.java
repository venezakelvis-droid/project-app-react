package school_app.project.demo.application.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import school_app.project.demo.application.dtos.StudentDTO;
import school_app.project.demo.application.utils.AuthorizationHelper;
import school_app.project.demo.domain.entities.Student;
import school_app.project.demo.domain.exceptions.ResourceNotFoundException;
import school_app.project.demo.infrastructure.repositories.StudentRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private AuthorizationHelper authorizationHelper;

    @InjectMocks
    private StudentService studentService;

    @Test
    void shouldCreateStudent() {
        StudentDTO dto = StudentDTO.builder()
                .name("Alice")
                .cpf("123")
                .email("a@x.com")
                .build();

        Student saved = Student.builder()
                .id(1L)
                .name("Alice")
                .cpf("123")
                .email("a@x.com")
                .build();

        when(studentRepository.save(any(Student.class))).thenReturn(saved);

        StudentDTO result = studentService.create(dto);

        assertEquals(1L, result.getId());
        assertEquals("Alice", result.getName());
        verify(studentRepository).save(any(Student.class));
    }

    @Test
    void shouldFindStudentById() {
        Student student = Student.builder()
                .id(1L)
                .name("Bob")
                .build();

        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(authorizationHelper.isAdmin()).thenReturn(true);

        StudentDTO result = studentService.findById(1L);

        assertEquals("Bob", result.getName());
    }

    @Test
    void shouldThrowWhenStudentNotFound() {
        when(studentRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> studentService.findById(1L));
    }

    @Test
    void shouldDeleteStudentWhenExists() {
        Student student = Student.builder().id(1L).build();
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(authorizationHelper.isAdmin()).thenReturn(true);

        studentService.delete(1L);

        verify(studentRepository).deleteById(1L);
    }

    @Test
    void shouldThrowWhenDeleteMissingStudent() {
        when(studentRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> studentService.delete(1L));
    }
}
