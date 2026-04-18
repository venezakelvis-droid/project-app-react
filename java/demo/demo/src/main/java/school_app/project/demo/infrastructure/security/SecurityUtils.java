package school_app.project.demo.infrastructure.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Collection;

@Component
public class SecurityUtils {

    /**
     * Obtém o email do usuário logado a partir do SecurityContext
     */
    public String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return null;
    }

    /**
     * Verifica se o usuário têm a role especificada
     */
    public boolean hasRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
            String roleWithPrefix = role.startsWith("ROLE_") ? role : "ROLE_" + role;
            return authorities.stream()
                    .anyMatch(auth -> auth.getAuthority().equals(roleWithPrefix));
        }
        return false;
    }

    /**
     * Verifica se o usuário é ADMIN
     */
    public boolean isAdmin() {
        return hasRole("ADMIN");
    }

    /**
     * Verifica se o usuário é TEACHER
     */
    public boolean isTeacher() {
        return hasRole("TEACHER");
    }

    /**
     * Verifica se o usuário é STUDENT
     */
    public boolean isStudent() {
        return hasRole("STUDENT");
    }

    /**
     * Verifica se o usuário é GUARDIAN
     */
    public boolean isGuardian() {
        return hasRole("GUARDIAN");
    }
}
