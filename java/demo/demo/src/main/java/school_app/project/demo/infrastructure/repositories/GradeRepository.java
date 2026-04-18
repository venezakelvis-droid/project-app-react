package school_app.project.demo.infrastructure.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import school_app.project.demo.domain.entities.Grade;

import java.util.List;
import java.util.Optional;

public interface GradeRepository extends JpaRepository<Grade, Long> {

    // Legacy methods for backward compatibility
    List<Grade> findByEnrollmentId(Long enrollmentId);
    List<Grade> findByEnrollmentStudentId(Long studentId);

    // New methods for direct relationships
    List<Grade> findByStudentId(Long studentId);
    List<Grade> findBySubjectId(Long subjectId);
    List<Grade> findByStudentIdAndSubjectId(Long studentId, Long subjectId);
    Optional<Grade> findByStudentIdAndSubjectIdAndSemester(Long studentId, Long subjectId, Integer semester);
    List<Grade> findByStudentIdAndSemester(Long studentId, Integer semester);
    List<Grade> findBySubjectIdAndSemester(Long subjectId, Integer semester);

}