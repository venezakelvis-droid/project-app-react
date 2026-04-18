package school_app.project.demo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import school_app.project.demo.application.dtos.GradeDTO;
import school_app.project.demo.application.services.GradeService;
import school_app.project.demo.application.services.UserService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/grades")
@RequiredArgsConstructor
public class GradeController {

    private final GradeService gradeService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<GradeDTO> create(@RequestBody GradeDTO dto) {
        GradeDTO created = gradeService.create(dto);
        return ResponseEntity.created(URI.create("/api/grades/" + created.getId())).body(created);
    }

    /**
     * Teacher-only: grades for the logged-in teacher (no enrollment calls needed).
     * Declared before /{id} so "me" is not parsed as a numeric id.
     */
    @GetMapping("/me")
    public ResponseEntity<List<GradeDTO>> findMineForTeacher() {
        return ResponseEntity.ok(gradeService.findGradesForCurrentTeacher());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GradeDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(gradeService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<GradeDTO>> findAll() {
        return ResponseEntity.ok(gradeService.findAll());
    }

    @GetMapping("/student")
    public ResponseEntity<List<GradeDTO>> findByAuthenticatedStudent(Authentication authentication) {
        var user = userService.findByEmail(authentication.getName())
                .orElseThrow(() -> new AccessDeniedException("Usuário não encontrado."));
        if (user.getStudent() != null) {
            return ResponseEntity.ok(gradeService.findByStudentId(user.getStudent().getId()));
        }
        if (user.getWards() != null && !user.getWards().isEmpty()) {
            var grades = user.getWards().stream()
                    .flatMap(student -> gradeService.findByStudentId(student.getId()).stream())
                    .toList();
            return ResponseEntity.ok(grades);
        }
        throw new AccessDeniedException("Acesso negado.");
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<GradeDTO>> findByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(gradeService.findByStudentId(studentId));
    }

    @GetMapping("/student/{studentId}/subject/{subjectId}")
    public ResponseEntity<List<GradeDTO>> findByStudentAndSubject(@PathVariable Long studentId, @PathVariable Long subjectId) {
        return ResponseEntity.ok(gradeService.findByStudentAndSubject(studentId, subjectId));
    }

    @GetMapping("/student/{studentId}/subject/{subjectId}/semester/{semester}")
    public ResponseEntity<GradeDTO> findByStudentSubjectAndSemester(@PathVariable Long studentId, @PathVariable Long subjectId, @PathVariable Integer semester) {
        return gradeService.findByStudentSubjectAndSemester(studentId, subjectId, semester)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/student/{studentId}/subject/{subjectId}/average")
    public ResponseEntity<Double> getSubjectFinalAverage(@PathVariable Long studentId, @PathVariable Long subjectId) {
        Double average = gradeService.calculateSubjectFinalAverage(studentId, subjectId);
        return average != null ? ResponseEntity.ok(average) : ResponseEntity.notFound().build();
    }

    @GetMapping("/student/{studentId}/subject/{subjectId}/semester/{semester}/average")
    public ResponseEntity<Double> getSubjectSemesterAverage(@PathVariable Long studentId, @PathVariable Long subjectId, @PathVariable Integer semester) {
        Double average = gradeService.calculateSubjectAverage(studentId, subjectId, semester);
        return average != null ? ResponseEntity.ok(average) : ResponseEntity.notFound().build();
    }

    @GetMapping("/student/{studentId}/overall-average")
    public ResponseEntity<Double> getStudentOverallAverage(@PathVariable Long studentId) {
        Double average = gradeService.calculateStudentOverallAverage(studentId);
        return average != null ? ResponseEntity.ok(average) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<GradeDTO> update(@PathVariable Long id, @RequestBody GradeDTO dto) {
        return ResponseEntity.ok(gradeService.update(id, dto));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<GradeDTO> patch(@PathVariable Long id, @RequestBody GradeDTO dto) {
        return ResponseEntity.ok(gradeService.patch(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        gradeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}