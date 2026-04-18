package school_app.project.demo.infrastructure.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import school_app.project.demo.domain.entities.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
