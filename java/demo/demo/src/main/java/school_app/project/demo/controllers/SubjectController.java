package school_app.project.demo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import school_app.project.demo.application.dtos.SubjectDTO;
import school_app.project.demo.application.services.SubjectService;
import school_app.project.demo.application.services.UserService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<SubjectDTO> create(@RequestBody SubjectDTO dto) {
        SubjectDTO created = subjectService.create(dto);
        return ResponseEntity.created(URI.create("/api/subjects/" + created.getId())).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubjectDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(subjectService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<SubjectDTO>> findAll() {
        return ResponseEntity.ok(subjectService.findAll());
    }

    @GetMapping("/teacher")
    public ResponseEntity<List<SubjectDTO>> findByTeacher(Authentication authentication) {
        var user = userService.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalStateException("Usuário não encontrado."));
        if (user.getTeacher() == null) {
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(subjectService.findByTeacherId(user.getTeacher().getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubjectDTO> update(@PathVariable Long id, @RequestBody SubjectDTO dto) {
        return ResponseEntity.ok(subjectService.update(id, dto));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<SubjectDTO> patch(@PathVariable Long id, @RequestBody SubjectDTO dto) {
        return ResponseEntity.ok(subjectService.patch(id, dto));
    }

    @GetMapping("/teacher/{teacherId}/class/{classId}")
    public ResponseEntity<List<SubjectDTO>> findByTeacherAndClass(@PathVariable Long teacherId, @PathVariable Long classId) {
        return ResponseEntity.ok(subjectService.findByTeacherAndClass(teacherId, classId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        subjectService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
