package school_app.project.demo.application.dtos;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDTO {

    private Long id;
    private String name;
    private LocalDate birthDate;
    private String cpf;
    private String email;
    private String phone;
    private String enrollmentNumber;
    private LocalDate enrollmentDate;
    private String status;
    private Long guardianId;
    private Long classId;

}