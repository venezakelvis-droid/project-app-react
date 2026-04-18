package school_app.project.demo.domain.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private LocalDate birthDate;

    private String cpf;

    private String email;

    private String phone;

    private String enrollmentNumber;

    private LocalDate enrollmentDate;

    private String status;

    @OneToMany(mappedBy = "student", fetch = FetchType.LAZY)
    private List<Enrollment> enrollments = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "guardian_id")
    private User guardian;

    @ManyToOne
    @JoinColumn(name = "school_class_id", nullable = false)
    @NotNull(message = "Student must belong to a school class")
    private SchoolClass schoolClass;

}
