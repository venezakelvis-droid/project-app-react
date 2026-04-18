package school_app.project.demo.infrastructure.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import school_app.project.demo.domain.entities.Student;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByCpf(String cpf);

    boolean existsByCpf(String cpf);

    List<Student> findByGuardianId(Long guardianId);

    @Query("SELECT s FROM Student s WHERE s.id IN " +
            "(SELECT u.student.id FROM User u WHERE u.id = :userId AND u.student IS NOT NULL)")
    Optional<Student> findByUserId(@Param("userId") Long userId);

    @Query("SELECT DISTINCT s FROM Student s WHERE s.schoolClass.id = :classId")
    List<Student> findBySchoolClassId(@Param("classId") Long classId);
}
