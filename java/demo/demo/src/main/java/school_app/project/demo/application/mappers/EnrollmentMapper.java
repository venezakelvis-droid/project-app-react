package school_app.project.demo.application.mappers;

import school_app.project.demo.application.dtos.EnrollmentDTO;
import school_app.project.demo.domain.entities.*;

public class EnrollmentMapper {

    public static EnrollmentDTO toDTO(Enrollment enrollment){

        return EnrollmentDTO.builder()
                .id(enrollment.getId())
                .studentId(enrollment.getStudent().getId())
                .subjectId(enrollment.getSubject().getId())
                .schoolClassId(enrollment.getSchoolClass().getId())
                .enrollmentDate(enrollment.getEnrollmentDate())
                .status(enrollment.getStatus())
                .build();
    }

    public static Enrollment toEntity(
            EnrollmentDTO dto,
            Student student,
            Subject subject,
            SchoolClass schoolClass){

        return Enrollment.builder()
                .id(dto.getId())
                .student(student)
                .subject(subject)
                .schoolClass(schoolClass)
                .enrollmentDate(dto.getEnrollmentDate())
                .status(dto.getStatus())
                .build();
    }

}