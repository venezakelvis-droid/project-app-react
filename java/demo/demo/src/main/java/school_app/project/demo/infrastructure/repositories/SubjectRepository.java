package school_app.project.demo.infrastructure.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import school_app.project.demo.domain.entities.Subject;

import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject, Long> {

    List<Subject> findByTeacherId(Long teacherId);

    @Query("SELECT DISTINCT s FROM Subject s " +
            "WHERE s.teacher.id = :teacherId AND EXISTS (" +
            "  SELECT 1 FROM Enrollment e WHERE e.subject.id = s.id AND e.schoolClass.id = :classId" +
            ")")
    List<Subject> findByTeacherAndClass(@Param("teacherId") Long teacherId, @Param("classId") Long classId);

}
