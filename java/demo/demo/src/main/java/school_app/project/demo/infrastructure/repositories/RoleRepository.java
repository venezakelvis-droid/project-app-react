package school_app.project.demo.infrastructure.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import school_app.project.demo.domain.entities.Role;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);
}
