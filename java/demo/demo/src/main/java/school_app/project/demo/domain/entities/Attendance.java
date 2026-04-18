package school_app.project.demo.domain.entities;

import jakarta.persistence.*;
import lombok.*;

/**
 * Attendance entity for tracking student attendance per subject per semester.
 * Following Brazilian educational standards.
 *
 * Calculations:
 * - Presence Percentage = ((totalClasses - (absences - justifiedAbsences)) / totalClasses) * 100
 * - Justified absences don't count against attendance percentage
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Semester: 1 or 2
    private Integer semester;

    // Total number of classes in the semester
    private Integer totalClasses;

    // Number of absences
    private Integer absences;

    // Number of justified absences
    private Integer justifiedAbsences;

    // Number of delays
    private Integer delays;

    // Calculated presence percentage
    private Double presencePercentage;

    @ManyToOne
    private Enrollment enrollment;

    /**
     * Calculates and updates the presence percentage.
     * Should be called before persisting.
     */
    public void calculatePresencePercentage() {
        if (totalClasses != null && totalClasses > 0) {
            // Justified absences don't count against attendance
            int effectiveAbsences = (absences != null ? absences : 0) - (justifiedAbsences != null ? justifiedAbsences : 0);
            if (effectiveAbsences < 0) {
                effectiveAbsences = 0;
            }
            this.presencePercentage = ((double) (totalClasses - effectiveAbsences) / totalClasses) * 100.0;
        } else {
            this.presencePercentage = 0.0;
        }
    }

}
