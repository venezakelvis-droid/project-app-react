package school_app.project.demo.application.utils;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import school_app.project.demo.domain.entities.Student;
import school_app.project.demo.domain.entities.Teacher;
import school_app.project.demo.domain.entities.User;
import school_app.project.demo.infrastructure.repositories.StudentRepository;
import school_app.project.demo.infrastructure.repositories.TeacherRepository;
import school_app.project.demo.infrastructure.repositories.UserRepository;
import school_app.project.demo.infrastructure.security.SecurityUtils;

import java.util.Optional;

/**
 * Centraliza a lógica de autorização e filtragem de dados por role do usuário logado
 */
@Component
@RequiredArgsConstructor
public class AuthorizationHelper {

    private final SecurityUtils securityUtils;
    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;

    /**
     * Obtém o usuário logado
     */
    public User getCurrentUser() {
        String email = securityUtils.getCurrentUserEmail();
        if (email == null) {
            throw new RuntimeException("No authenticated user found");
        }
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    /**
     * Obtém o Teacher do usuário logado (se for teacher)
     */
    public Optional<Teacher> getCurrentUserAsTeacher() {
        if (!securityUtils.isTeacher()) {
            return Optional.empty();
        }
        User user = getCurrentUser();
        return user.getTeacher() != null ? 
                teacherRepository.findById(user.getTeacher().getId()) : 
                Optional.empty();
    }

    /**
     * Obtém o Student do usuário logado (se for student)
     */
    public Optional<Student> getCurrentUserAsStudent() {
        if (!securityUtils.isStudent()) {
            return Optional.empty();
        }
        User user = getCurrentUser();
        return user.getStudent() != null ? 
                studentRepository.findById(user.getStudent().getId()) : 
                Optional.empty();
    }

    /**
     * Verifica se é ADMIN
     */
    public boolean isAdmin() {
        return securityUtils.isAdmin();
    }

    /**
     * Verifica se é TEACHER
     */
    public boolean isTeacher() {
        return securityUtils.isTeacher();
    }

    /**
     * Verifica se é STUDENT
     */
    public boolean isStudent() {
        return securityUtils.isStudent();
    }

    /**
     * Verifica se é GUARDIAN
     */
    public boolean isGuardian() {
        return securityUtils.isGuardian();
    }

    /**
     * Obtém o ID do Teacher logado
     */
    public Long getCurrentTeacherId() {
        return getCurrentUserAsTeacher()
                .map(Teacher::getId)
                .orElseThrow(() -> new RuntimeException("Current user is not a teacher"));
    }

    /**
     * Obtém o ID do Student logado
     */
    public Long getCurrentStudentId() {
        return getCurrentUserAsStudent()
                .map(Student::getId)
                .orElseThrow(() -> new RuntimeException("Current user is not a student"));
    }

    /**
     * Verifica se o Guardião atual é responsável pelo estudante
     */
    public boolean isGuardianOfStudent(Long studentId) {
        if (!isGuardian()) {
            return false;
        }
        User currentUser = getCurrentUser();
        return studentRepository.findById(studentId)
                .map(student -> student.getGuardian() != null && student.getGuardian().getId().equals(currentUser.getId()))
                .orElse(false);
    }
}
