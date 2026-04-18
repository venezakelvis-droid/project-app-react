package school_app.project.demo.application.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SchoolClassDTO {
    private Long id;
    private String name;
    private Integer schoolYear;
    private Integer semester;
    private String room;
    private String shift;
}
