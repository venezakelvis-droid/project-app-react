package school_app.project.demo.application.dtos;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrollmentDTO {

    private Long id;
    private Long studentId;
    private Long subjectId;
    private Long schoolClassId;
    private LocalDate enrollmentDate;
    private String status;

}
