package school_app.project.demo.application.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubjectDTO {

    private Long id;
    private String name;
    private Integer workloadHours;
    private String description;
    private Long teacherId;

}