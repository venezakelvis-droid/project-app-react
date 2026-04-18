package school_app.project.demo.application.dtos;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherDTO {

    private Long id;
    private String name;
    private String cpf;
    private String email;
    private String phone;
    private String specialty;
    private LocalDate hireDate;

}