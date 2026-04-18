package school_app.project.demo.application.mappers;

import school_app.project.demo.application.dtos.SubjectDTO;
import school_app.project.demo.domain.entities.Subject;
import school_app.project.demo.domain.entities.Teacher;

public class SubjectMapper {

    public static SubjectDTO toDTO(Subject subject){

        return SubjectDTO.builder()
                .id(subject.getId())
                .name(subject.getName())
                .description(subject.getDescription())
                .workloadHours(subject.getWorkloadHours())
                .teacherId(subject.getTeacher().getId())
                .build();
    }

    public static Subject toEntity(SubjectDTO dto, Teacher teacher){

        return Subject.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .workloadHours(dto.getWorkloadHours())
                .teacher(teacher)
                .build();
    }

}