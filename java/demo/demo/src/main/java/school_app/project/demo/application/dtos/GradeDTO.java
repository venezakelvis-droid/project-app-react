package school_app.project.demo.application.dtos;

import lombok.*;

/**
 * DTO for Grade following Brazilian standard.
 * Contains 8 grades: 4 per semester.
 * Now includes direct relationships to Student, Subject, and Semester.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GradeDTO {

    private Long id;
    private Long studentId;
    private Long subjectId;
    private Integer semester;
    private Long enrollmentId; // Keep for backward compatibility

    /** Display fields (populated server-side; avoids extra client calls) */
    private String studentName;
    private String subjectName;
    private String schoolClassName;
    
    // Semester 1 grades
    private Double note1Semester1;
    private Double note2Semester1;
    private Double note3Semester1;
    private Double note4Semester1;
    
    // Semester 2 grades
    private Double note1Semester2;
    private Double note2Semester2;
    private Double note3Semester2;
    private Double note4Semester2;
    
    // Calculated averages
    private Double averageSemester1;
    private Double averageSemester2;
    private Double finalAverage;
    
    // Status
    private String status;

}
