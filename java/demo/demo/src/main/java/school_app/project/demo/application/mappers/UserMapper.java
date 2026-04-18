package school_app.project.demo.application.mappers;

import school_app.project.demo.application.dtos.UserDTO;
import school_app.project.demo.domain.entities.Role;
import school_app.project.demo.domain.entities.Student;
import school_app.project.demo.domain.entities.Teacher;
import school_app.project.demo.domain.entities.User;

import java.util.Set;
import java.util.stream.Collectors;

public class UserMapper {

    public static UserDTO toDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .roles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
                .studentId(user.getStudent() != null ? user.getStudent().getId() : null)
                .teacherId(user.getTeacher() != null ? user.getTeacher().getId() : null)
                .guardianStudentIds(user.getWards() != null ?
                        user.getWards().stream().map(Student::getId).collect(Collectors.toSet()) : null)
                .build();
    }

    public static User toEntity(UserDTO dto, Set<Role> roles, Student student, Teacher teacher) {
        return User.builder()
                .id(dto.getId())
                .name(dto.getName())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .roles(roles)
                .student(student)
                .teacher(teacher)
                .build();
    }
}
