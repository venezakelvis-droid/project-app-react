package school_app.project.demo.application.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import school_app.project.demo.application.dtos.UserDTO;
import school_app.project.demo.domain.entities.Role;
import school_app.project.demo.domain.entities.Student;
import school_app.project.demo.domain.entities.User;
import school_app.project.demo.infrastructure.repositories.RoleRepository;
import school_app.project.demo.infrastructure.repositories.StudentRepository;
import school_app.project.demo.infrastructure.repositories.TeacherRepository;
import school_app.project.demo.infrastructure.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private TeacherRepository teacherRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void shouldAssignGuardianStudentsWhenCreatingGuardianUser() {
        Role guardianRole = Role.builder().id(1L).name("GUARDIAN").build();
        Student student = Student.builder().id(10L).build();

        when(roleRepository.findByName("GUARDIAN")).thenReturn(Optional.of(guardianRole));
        when(passwordEncoder.encode("12345678")).thenReturn("encoded-password");
        when(studentRepository.findById(10L)).thenReturn(Optional.of(student));

        User[] savedUser = new User[1];
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(100L);
            savedUser[0] = user;
            return user;
        });
        when(userRepository.findById(100L)).thenAnswer(invocation -> Optional.of(savedUser[0]));

        UserDTO dto = UserDTO.builder()
                .name("Guardian User")
                .email("guardian@email.com")
                .password("12345678")
                .roles(Set.of("GUARDIAN"))
                .guardianStudentIds(Set.of(10L))
                .build();

        UserDTO result = userService.createUser(dto);

        assertEquals(100L, result.getId());
        assertNotNull(result.getGuardianStudentIds());
        assertTrue(result.getGuardianStudentIds().contains(10L));
        assertNotNull(student.getGuardian());
        assertEquals(100L, student.getGuardian().getId());

        verify(userRepository).save(any(User.class));
        verify(studentRepository).save(student);
    }

    @Test
    void shouldUpdateGuardianAssignmentsWhenGuardianStudentIdsChange() {
        Role guardianRole = Role.builder().id(1L).name("GUARDIAN").build();
        User guardian = User.builder().id(100L).name("Guardian User").build();
        Student existingStudent = Student.builder().id(10L).guardian(guardian).build();
        Student newStudent = Student.builder().id(20L).build();

        when(userRepository.findById(100L)).thenReturn(Optional.of(guardian));
        when(roleRepository.findByName("GUARDIAN")).thenReturn(Optional.of(guardianRole));
        when(studentRepository.findByGuardianId(100L)).thenReturn(List.of(existingStudent));
        when(studentRepository.findById(20L)).thenReturn(Optional.of(newStudent));
        when(userRepository.save(any(User.class))).thenReturn(guardian);

        UserDTO dto = UserDTO.builder()
                .roles(Set.of("GUARDIAN"))
                .guardianStudentIds(Set.of(20L))
                .build();

        UserDTO result = userService.updateUser(100L, dto);

        assertNotNull(newStudent.getGuardian());
        assertEquals(100L, newStudent.getGuardian().getId());
        assertNull(existingStudent.getGuardian());
        assertNotNull(result.getGuardianStudentIds());
        assertTrue(result.getGuardianStudentIds().contains(20L));

        verify(studentRepository).save(existingStudent);
        verify(studentRepository).save(newStudent);
        verify(userRepository).save(guardian);
    }
}
