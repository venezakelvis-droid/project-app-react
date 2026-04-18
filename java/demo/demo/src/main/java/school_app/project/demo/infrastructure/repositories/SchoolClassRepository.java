package school_app.project.demo.infrastructure.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import school_app.project.demo.domain.entities.SchoolClass;

import java.util.List;

public interface SchoolClassRepository extends JpaRepository<SchoolClass, Long> {

    @Query("SELECT DISTINCT sc FROM SchoolClass sc " +
            "JOIN sc.enrollments e " +
            "JOIN e.subject s " +
            "JOIN s.teacher t " +
            "WHERE t.id = :teacherId")
    List<SchoolClass> findByTeacherId(@Param("teacherId") Long teacherId);

    @Query("SELECT DISTINCT sc FROM SchoolClass sc " +
            "JOIN sc.enrollments e " +
            "WHERE e.student.id = :studentId")
    List<SchoolClass> findByStudentId(@Param("studentId") Long studentId);
}
