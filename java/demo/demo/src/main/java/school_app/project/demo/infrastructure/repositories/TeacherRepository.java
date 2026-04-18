package school_app.project.demo.infrastructure.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import school_app.project.demo.domain.entities.Teacher;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {

}