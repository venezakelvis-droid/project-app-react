package school_app.project.demo.application.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import school_app.project.demo.application.dtos.SubjectDTO;
import school_app.project.demo.domain.entities.Subject;
import school_app.project.demo.domain.entities.Teacher;
import school_app.project.demo.domain.exceptions.ResourceNotFoundException;
import school_app.project.demo.infrastructure.repositories.SubjectRepository;
import school_app.project.demo.infrastructure.repositories.TeacherRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SubjectServiceTest {

    @Mock
    private SubjectRepository subjectRepository;

    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private SubjectService subjectService;

    @Test
    void shouldCreateSubject() {
        SubjectDTO dto = SubjectDTO.builder()
                .name("Math")
                .teacherId(1L)
                .build();

        Teacher teacher = Teacher.builder().id(1L).build();
        Subject saved = Subject.builder().id(3L).name("Math").teacher(teacher).build();

        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher));
        when(subjectRepository.save(any(Subject.class))).thenReturn(saved);

        SubjectDTO result = subjectService.create(dto);

        assertEquals(3L, result.getId());
        assertEquals("Math", result.getName());
    }

    @Test
    void shouldThrowWhenTeacherMissing() {
        SubjectDTO dto = SubjectDTO.builder().teacherId(1L).build();

        when(teacherRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> subjectService.create(dto));
    }
}
