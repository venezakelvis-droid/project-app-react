package school_app.project.demo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import school_app.project.demo.application.dtos.TeacherDTO;
import school_app.project.demo.application.dtos.SchoolClassDTO;
import school_app.project.demo.application.services.TeacherService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;

    @PostMapping
    public ResponseEntity<TeacherDTO> create(@RequestBody TeacherDTO dto) {
        TeacherDTO created = teacherService.create(dto);
        return ResponseEntity.created(URI.create("/api/teachers/" + created.getId())).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeacherDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(teacherService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<TeacherDTO>> findAll() {
        return ResponseEntity.ok(teacherService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeacherDTO> update(@PathVariable Long id, @RequestBody TeacherDTO dto) {
        return ResponseEntity.ok(teacherService.update(id, dto));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TeacherDTO> patch(@PathVariable Long id, @RequestBody TeacherDTO dto) {
        return ResponseEntity.ok(teacherService.patch(id, dto));
    }

    @GetMapping("/{id}/classes")
    public ResponseEntity<List<SchoolClassDTO>> getClassesByTeacher(@PathVariable Long id) {
        return ResponseEntity.ok(teacherService.getClassesByTeacherId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        teacherService.delete(id);
        return ResponseEntity.noContent().build();
    }
}