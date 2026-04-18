package school_app.project.demo.domain.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Integer workloadHours;

    private String description;

    @ManyToOne
    private Teacher teacher;

    @OneToMany(mappedBy = "subject")
    private List<Enrollment> enrollments;

}