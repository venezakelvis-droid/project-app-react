package school_app.project.demo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import school_app.project.demo.application.dtos.EnrollmentDTO;
import school_app.project.demo.application.services.EnrollmentService;
import school_app.project.demo.application.services.UserService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<EnrollmentDTO> enroll(@RequestBody EnrollmentDTO dto) {
        EnrollmentDTO created = enrollmentService.enroll(dto);
        return ResponseEntity.created(URI.create("/api/enrollments/" + created.getId())).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EnrollmentDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(enrollmentService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<EnrollmentDTO>> findAll() {
        return ResponseEntity.ok(enrollmentService.findAll());
    }

    @GetMapping("/student")
    public ResponseEntity<List<EnrollmentDTO>> findByStudent(Authentication authentication) {
        var user = userService.findByEmail(authentication.getName())
                .orElseThrow(() -> new AccessDeniedException("Usuário não encontrado."));
        if (user.getStudent() == null) {
            throw new AccessDeniedException("Acesso negado.");
        }
        return ResponseEntity.ok(enrollmentService.findByStudentId(user.getStudent().getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EnrollmentDTO> update(@PathVariable Long id, @RequestBody EnrollmentDTO dto) {
        return ResponseEntity.ok(enrollmentService.update(id, dto));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<EnrollmentDTO> patch(@PathVariable Long id, @RequestBody EnrollmentDTO dto) {
        return ResponseEntity.ok(enrollmentService.patch(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        enrollmentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
