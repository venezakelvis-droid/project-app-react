package school_app.project.demo.infrastructure.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import school_app.project.demo.domain.entities.Attendance;

import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByEnrollmentId(Long enrollmentId);

    List<Attendance> findByEnrollmentStudentId(Long studentId);

    List<Attendance> findByEnrollmentIdAndSemester(Long enrollmentId, Integer semester);

}