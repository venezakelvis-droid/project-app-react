package school_app.project.demo.infrastructure.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import school_app.project.demo.domain.entities.Enrollment;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    Optional<Enrollment> findByStudentIdAndSubjectId(Long studentId, Long subjectId);

    List<Enrollment> findByStudentId(Long studentId);

}
