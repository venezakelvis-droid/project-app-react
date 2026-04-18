package school_app.project.demo.application.dtos;

import lombok.*;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String password;
    private Set<String> roles;
    private Long studentId;
    private Long teacherId;
    private java.util.Set<Long> guardianStudentIds;
}
