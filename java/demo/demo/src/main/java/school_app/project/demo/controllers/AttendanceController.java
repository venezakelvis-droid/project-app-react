package school_app.project.demo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import school_app.project.demo.application.dtos.AttendanceDTO;
import school_app.project.demo.application.services.AttendanceService;
import school_app.project.demo.application.services.UserService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<AttendanceDTO> create(@RequestBody AttendanceDTO dto) {
        AttendanceDTO created = attendanceService.create(dto);
        return ResponseEntity.created(URI.create("/api/attendance/" + created.getId())).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttendanceDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(attendanceService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<AttendanceDTO>> findAll() {
        return ResponseEntity.ok(attendanceService.findAll());
    }

    @GetMapping("/student")
    public ResponseEntity<List<AttendanceDTO>> findByStudent(Authentication authentication) {
        var user = userService.findByEmail(authentication.getName())
                .orElseThrow(() -> new AccessDeniedException("Usuário não encontrado."));
        if (user.getStudent() != null) {
            return ResponseEntity.ok(attendanceService.findByStudentId(user.getStudent().getId()));
        }
        if (user.getWards() != null && !user.getWards().isEmpty()) {
            var attendance = user.getWards().stream()
                    .flatMap(student -> attendanceService.findByStudentId(student.getId()).stream())
                    .toList();
            return ResponseEntity.ok(attendance);
        }
        throw new AccessDeniedException("Acesso negado.");
    }

    @GetMapping("/enrollment/{enrollmentId}")
    public ResponseEntity<List<AttendanceDTO>> findByEnrollment(@PathVariable Long enrollmentId) {
        return ResponseEntity.ok(attendanceService.findByEnrollmentId(enrollmentId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AttendanceDTO> update(@PathVariable Long id, @RequestBody AttendanceDTO dto) {
        return ResponseEntity.ok(attendanceService.update(id, dto));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<AttendanceDTO> patch(@PathVariable Long id, @RequestBody AttendanceDTO dto) {
        return ResponseEntity.ok(attendanceService.patch(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        attendanceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}