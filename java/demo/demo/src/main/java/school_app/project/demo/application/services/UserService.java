package school_app.project.demo.application.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import school_app.project.demo.application.dtos.UserDTO;
import school_app.project.demo.application.mappers.UserMapper;
import school_app.project.demo.domain.entities.Role;
import school_app.project.demo.domain.entities.Student;
import school_app.project.demo.domain.entities.Teacher;
import school_app.project.demo.domain.entities.User;
import school_app.project.demo.infrastructure.repositories.RoleRepository;
import school_app.project.demo.infrastructure.repositories.StudentRepository;
import school_app.project.demo.infrastructure.repositories.TeacherRepository;
import school_app.project.demo.infrastructure.repositories.UserRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final PasswordEncoder passwordEncoder;

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Transactional
    public User createUser(String name, String email, String rawPassword, Set<String> roles, Student student, Teacher teacher) {
        return createUser(name, email, rawPassword, roles, student, teacher, null);
    }

    @Transactional
    public User createUser(String name, String email, String rawPassword, Set<String> roles, Student student, Teacher teacher, List<Student> guardianStudents) {
        Set<Role> roleEntities = new HashSet<>();
        for (String roleName : roles) {
            Role role = roleRepository.findByName(roleName)
                    .orElseThrow(() -> new IllegalStateException("Role not found: " + roleName));
            roleEntities.add(role);
        }

        User user = User.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(rawPassword))
                .roles(roleEntities)
                .student(student)
                .teacher(teacher)
                .build();

        User saved = userRepository.save(user);

        if (guardianStudents != null) {
            guardianStudents.forEach(studentEntity -> {
                studentEntity.setGuardian(saved);
                studentRepository.save(studentEntity);
            });
        }

        return saved;
    }

    @Transactional
    public Role ensureRole(String name) {
        return roleRepository.findByName(name)
                .orElseGet(() -> roleRepository.save(Role.builder().name(name).build()));
    }

    @Transactional
    public UserDTO createUser(UserDTO dto) {
        Set<Role> roles = dto.getRoles().stream()
                .map(name -> roleRepository.findByName(name)
                        .orElseThrow(() -> new RuntimeException("Role not found: " + name)))
                .collect(Collectors.toSet());

        Student student = dto.getStudentId() != null ?
                studentRepository.findById(dto.getStudentId())
                        .orElseThrow(() -> new RuntimeException("Student not found")) : null;

        Teacher teacher = dto.getTeacherId() != null ?
                teacherRepository.findById(dto.getTeacherId())
                        .orElseThrow(() -> new RuntimeException("Teacher not found")) : null;

        User user = User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .roles(roles)
                .student(student)
                .teacher(teacher)
                .build();

        User saved = userRepository.save(user);

        if (dto.getGuardianStudentIds() != null) {
            assignGuardianToStudents(saved, dto.getGuardianStudentIds());
            saved = userRepository.findById(saved.getId()).orElse(saved);
        }

        return UserMapper.toDTO(saved);
    }

    private void assignGuardianToStudents(User guardian, java.util.Set<Long> studentIds) {
        java.util.List<Student> assignedStudents = studentIds.stream()
                .map(studentId -> studentRepository.findById(studentId)
                        .orElseThrow(() -> new RuntimeException("Student not found")))
                .peek(student -> {
                    student.setGuardian(guardian);
                    studentRepository.save(student);
                })
                .toList();
        guardian.setWards(assignedStudents);
    }

    private void removeGuardianFromStudents(User guardian, java.util.Set<Long> studentIds) {
        studentRepository.findByGuardianId(guardian.getId()).stream()
                .filter(student -> !studentIds.contains(student.getId()))
                .forEach(student -> {
                    student.setGuardian(null);
                    studentRepository.save(student);
                });
    }

    public List<UserDTO> findAllUsers() {
        return userRepository.findAll().stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
    }

    public UserDTO findUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserMapper.toDTO(user);
    }

    @Transactional
    public UserDTO updateUser(Long id, UserDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        if (dto.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        if (dto.getRoles() != null) {
            Set<Role> roles = dto.getRoles().stream()
                    .map(name -> roleRepository.findByName(name)
                            .orElseThrow(() -> new RuntimeException("Role not found: " + name)))
                    .collect(Collectors.toSet());
            user.setRoles(roles);
        }

        Student student = dto.getStudentId() != null ?
                studentRepository.findById(dto.getStudentId())
                        .orElseThrow(() -> new RuntimeException("Student not found")) : null;
        user.setStudent(student);

        Teacher teacher = dto.getTeacherId() != null ?
                teacherRepository.findById(dto.getTeacherId())
                        .orElseThrow(() -> new RuntimeException("Teacher not found")) : null;
        user.setTeacher(teacher);

        if (dto.getGuardianStudentIds() != null) {
            removeGuardianFromStudents(user, dto.getGuardianStudentIds());
        }

        User saved = userRepository.save(user);

        if (dto.getGuardianStudentIds() != null) {
            assignGuardianToStudents(saved, dto.getGuardianStudentIds());
            saved = userRepository.findById(saved.getId()).orElse(saved);
        }

        return UserMapper.toDTO(saved);
    }

    @Transactional
    public UserDTO patchUser(Long id, UserDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getPassword() != null) user.setPassword(passwordEncoder.encode(dto.getPassword()));

        if (dto.getRoles() != null) {
            Set<Role> roles = dto.getRoles().stream()
                    .map(name -> roleRepository.findByName(name)
                            .orElseThrow(() -> new RuntimeException("Role not found: " + name)))
                    .collect(Collectors.toSet());
            user.setRoles(roles);
        }

        if (dto.getStudentId() != null) {
            Student student = studentRepository.findById(dto.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            user.setStudent(student);
        }

        if (dto.getTeacherId() != null) {
            Teacher teacher = teacherRepository.findById(dto.getTeacherId())
                    .orElseThrow(() -> new RuntimeException("Teacher not found"));
            user.setTeacher(teacher);
        }

        if (dto.getGuardianStudentIds() != null) {
            removeGuardianFromStudents(user, dto.getGuardianStudentIds());
        }

        User saved = userRepository.save(user);

        if (dto.getGuardianStudentIds() != null) {
            assignGuardianToStudents(saved, dto.getGuardianStudentIds());
            saved = userRepository.findById(saved.getId()).orElse(saved);
        }

        return UserMapper.toDTO(saved);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }
}
