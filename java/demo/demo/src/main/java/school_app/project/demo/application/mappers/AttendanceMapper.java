package school_app.project.demo.application.mappers;

import school_app.project.demo.application.dtos.AttendanceDTO;
import school_app.project.demo.domain.entities.Attendance;
import school_app.project.demo.domain.entities.Enrollment;

public class AttendanceMapper {

    public static AttendanceDTO toDTO(Attendance attendance) {
        return AttendanceDTO.builder()
                .id(attendance.getId())
                .enrollmentId(attendance.getEnrollment().getId())
                .semester(attendance.getSemester())
                .totalClasses(attendance.getTotalClasses())
                .absences(attendance.getAbsences())
                .justifiedAbsences(attendance.getJustifiedAbsences())
                .delays(attendance.getDelays())
                .presencePercentage(attendance.getPresencePercentage())
                .build();
    }

    public static Attendance toEntity(AttendanceDTO dto, Enrollment enrollment) {
        Attendance attendance = Attendance.builder()
                .id(dto.getId())
                .enrollment(enrollment)
                .semester(dto.getSemester())
                .totalClasses(dto.getTotalClasses())
                .absences(dto.getAbsences())
                .justifiedAbsences(dto.getJustifiedAbsences())
                .delays(dto.getDelays())
                .build();

        attendance.calculatePresencePercentage();
        return attendance;
    }

}