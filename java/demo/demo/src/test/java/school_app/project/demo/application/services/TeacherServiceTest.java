package school_app.project.demo.application.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import school_app.project.demo.application.dtos.TeacherDTO;
import school_app.project.demo.domain.entities.Teacher;
import school_app.project.demo.domain.exceptions.ResourceNotFoundException;
import school_app.project.demo.infrastructure.repositories.TeacherRepository;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TeacherServiceTest {

    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherService teacherService;

    @Test
    void shouldCreateTeacher() {
        TeacherDTO dto = TeacherDTO.builder()
                .name("Carlos")
                .cpf("321")
                .build();

        Teacher saved = Teacher.builder()
                .id(2L)
                .name("Carlos")
                .cpf("321")
                .build();

        when(teacherRepository.save(any(Teacher.class))).thenReturn(saved);

        TeacherDTO result = teacherService.create(dto);

        assertEquals(2L, result.getId());
        assertEquals("Carlos", result.getName());
    }

    @Test
    void shouldThrowWhenTeacherNotFound() {
        when(teacherRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> teacherService.findById(1L));
    }
}
