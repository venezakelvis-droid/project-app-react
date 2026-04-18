package school_app.project.demo.application.mappers;

import school_app.project.demo.domain.entities.Teacher;
import school_app.project.demo.application.dtos.TeacherDTO;

public class TeacherMapper {

    public static TeacherDTO toDTO(Teacher teacher){
        return TeacherDTO.builder()
                .id(teacher.getId())
                .name(teacher.getName())
                .cpf(teacher.getCpf())
                .email(teacher.getEmail())
                .phone(teacher.getPhone())
                .specialty(teacher.getSpecialty())
                .hireDate(teacher.getHireDate())
                .build();
    }

    public static Teacher toEntity(TeacherDTO dto){
        return Teacher.builder()
                .id(dto.getId())
                .name(dto.getName())
                .cpf(dto.getCpf())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .specialty(dto.getSpecialty())
                .hireDate(dto.getHireDate())
                .build();
    }

}