package school_app.project.demo.domain.entities;

import jakarta.persistence.*;
import lombok.*;

/**
 * Grade entity following Brazilian standard: 2 semesters, 4 grades per semester (8 total per subject).
 * Now directly linked to Student, Subject, and Semester for better querying and calculations.
 * 
 * Calculation:
 * - Average Semester 1 = (note1S1 + note2S1 + note3S1 + note4S1) / 4
 * - Average Semester 2 = (note1S2 + note2S2 + note3S2 + note4S2) / 4
 * - Final Average = (averageSemester1 + averageSemester2) / 2
 * 
 * Status:
 * - APROVADO (Passed): >= 7.0
 * - RECUPERAÇÃO (Needs recovery): 5.0 to 6.9
 * - REPROVADO (Failed): < 5.0
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Direct relationships for better querying
    @ManyToOne
    private Student student;

    @ManyToOne
    private Subject subject;

    private Integer semester; // 1 or 2

    // Semester 1 grades (4 notes)
    private Double note1Semester1;
    private Double note2Semester1;
    private Double note3Semester1;
    private Double note4Semester1;

    // Semester 2 grades (4 notes)
    private Double note1Semester2;
    private Double note2Semester2;
    private Double note3Semester2;
    private Double note4Semester2;

    // Calculated averages
    private Double averageSemester1;
    private Double averageSemester2;
    
    // Final average
    private Double finalAverage;

    // Status: APROVADO, RECUPERAÇÃO, REPROVADO
    private String status;

    // Keep enrollment for backward compatibility
    @ManyToOne
    private Enrollment enrollment;

    /**
     * Calculates and updates all averages and status.
     * Should be called before persisting.
     */
    public void calculateAverages() {
        // Reset before calculation
        this.averageSemester1 = null;
        this.averageSemester2 = null;
        this.finalAverage = null;
        this.status = "INCOMPLETO";

        boolean hasSemester1 = hasAllSemester1Notes();
        boolean hasSemester2 = hasAllSemester2Notes();

        if (hasSemester1) {
            this.averageSemester1 = (note1Semester1 + note2Semester1 + note3Semester1 + note4Semester1) / 4.0;
        }

        if (hasSemester2) {
            this.averageSemester2 = (note1Semester2 + note2Semester2 + note3Semester2 + note4Semester2) / 4.0;
        }

        if (hasSemester1 && hasSemester2) {
            this.finalAverage = (this.averageSemester1 + this.averageSemester2) / 2.0;
        } else if (hasSemester1) {
            this.finalAverage = this.averageSemester1;
        } else if (hasSemester2) {
            this.finalAverage = this.averageSemester2;
        }

        updateStatus();
    }

    private void updateStatus() {
        if (this.finalAverage == null) {
            this.status = "INCOMPLETO";
        } else if (this.finalAverage >= 7.0) {
            this.status = "APROVADO";
        } else if (this.finalAverage >= 5.0) {
            this.status = "RECUPERAÇÃO";
        } else {
            this.status = "REPROVADO";
        }
    }

    private boolean hasAllSemester1Notes() {
        return note1Semester1 != null && note2Semester1 != null && 
               note3Semester1 != null && note4Semester1 != null;
    }

    private boolean hasAllSemester2Notes() {
        return note1Semester2 != null && note2Semester2 != null && 
               note3Semester2 != null && note4Semester2 != null;
    }

}