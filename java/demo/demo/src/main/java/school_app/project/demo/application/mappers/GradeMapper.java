package school_app.project.demo.application.mappers;

import school_app.project.demo.application.dtos.GradeDTO;
import school_app.project.demo.domain.entities.Enrollment;
import school_app.project.demo.domain.entities.Grade;
import school_app.project.demo.domain.entities.Student;
import school_app.project.demo.domain.entities.Subject;

public class GradeMapper {

    public static GradeDTO toDTO(Grade grade) {

        String schoolClassName = null;
        if (grade.getEnrollment() != null && grade.getEnrollment().getSchoolClass() != null) {
            schoolClassName = grade.getEnrollment().getSchoolClass().getName();
        }

        return GradeDTO.builder()
                .id(grade.getId())
                .studentId(grade.getStudent() != null ? grade.getStudent().getId() : null)
                .subjectId(grade.getSubject() != null ? grade.getSubject().getId() : null)
                .semester(grade.getSemester())
                .enrollmentId(grade.getEnrollment() != null ? grade.getEnrollment().getId() : null)
                .studentName(grade.getStudent() != null ? grade.getStudent().getName() : null)
                .subjectName(grade.getSubject() != null ? grade.getSubject().getName() : null)
                .schoolClassName(schoolClassName)
                .note1Semester1(grade.getNote1Semester1())
                .note2Semester1(grade.getNote2Semester1())
                .note3Semester1(grade.getNote3Semester1())
                .note4Semester1(grade.getNote4Semester1())
                .note1Semester2(grade.getNote1Semester2())
                .note2Semester2(grade.getNote2Semester2())
                .note3Semester2(grade.getNote3Semester2())
                .note4Semester2(grade.getNote4Semester2())
                .averageSemester1(grade.getAverageSemester1())
                .averageSemester2(grade.getAverageSemester2())
                .finalAverage(grade.getFinalAverage())
                .status(grade.getStatus())
                .build();
    }

    public static Grade toEntity(GradeDTO dto, Student student, Subject subject, Enrollment enrollment) {

        Grade grade = Grade.builder()
                .id(dto.getId())
                .student(student)
                .subject(subject)
                .semester(dto.getSemester())
                .enrollment(enrollment)
                .note1Semester1(dto.getNote1Semester1())
                .note2Semester1(dto.getNote2Semester1())
                .note3Semester1(dto.getNote3Semester1())
                .note4Semester1(dto.getNote4Semester1())
                .note1Semester2(dto.getNote1Semester2())
                .note2Semester2(dto.getNote2Semester2())
                .note3Semester2(dto.getNote3Semester2())
                .note4Semester2(dto.getNote4Semester2())
                .build();
        
        grade.calculateAverages();
        return grade;
    }

}