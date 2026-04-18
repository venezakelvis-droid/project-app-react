package school_app.project.demo.application.dtos;

import lombok.*;

/**
 * DTO for Attendance tracking per subject per semester.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceDTO {

    private Long id;
    private Long enrollmentId;
    private Integer semester;
    private Integer totalClasses;
    private Integer absences;
    private Integer justifiedAbsences;
    private Integer delays;
    private Double presencePercentage;

}