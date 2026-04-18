package school_app.project.demo.application.mappers;

import school_app.project.demo.domain.entities.Student;
import school_app.project.demo.application.dtos.StudentDTO;

public class StudentMapper {

    public static StudentDTO toDTO(Student student) {

        return StudentDTO.builder()
                .id(student.getId())
                .name(student.getName())
                .birthDate(student.getBirthDate())
                .cpf(student.getCpf())
                .email(student.getEmail())
                .phone(student.getPhone())
                .enrollmentNumber(student.getEnrollmentNumber())
                .enrollmentDate(student.getEnrollmentDate())
                .status(student.getStatus())
                .guardianId(student.getGuardian() != null ? student.getGuardian().getId() : null)
                .classId(student.getSchoolClass() != null ? student.getSchoolClass().getId() : null)
                .build();
    }

    public static Student toEntity(StudentDTO dto) {

        return Student.builder()
                .id(dto.getId())
                .name(dto.getName())
                .birthDate(dto.getBirthDate())
                .cpf(dto.getCpf())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .enrollmentNumber(dto.getEnrollmentNumber())
                .enrollmentDate(dto.getEnrollmentDate())
                .status(dto.getStatus())
                .build();
    }

}
