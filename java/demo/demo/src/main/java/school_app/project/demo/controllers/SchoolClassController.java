package school_app.project.demo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import school_app.project.demo.application.dtos.SchoolClassDTO;
import school_app.project.demo.application.dtos.StudentDTO;
import school_app.project.demo.application.services.SchoolClassService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class SchoolClassController {

    private final SchoolClassService schoolClassService;

    @PostMapping
    public ResponseEntity<SchoolClassDTO> create(@RequestBody SchoolClassDTO dto) {
        SchoolClassDTO created = schoolClassService.create(dto);
        return ResponseEntity.created(URI.create("/api/classes/" + created.getId())).body(created);
    }

    @GetMapping
    public ResponseEntity<List<SchoolClassDTO>> findAll() {
        return ResponseEntity.ok(schoolClassService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SchoolClassDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(schoolClassService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SchoolClassDTO> update(@PathVariable Long id, @RequestBody SchoolClassDTO dto) {
        return ResponseEntity.ok(schoolClassService.update(id, dto));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<SchoolClassDTO> patch(@PathVariable Long id, @RequestBody SchoolClassDTO dto) {
        return ResponseEntity.ok(schoolClassService.patch(id, dto));
    }

    @GetMapping("/{id}/students")
    public ResponseEntity<List<StudentDTO>> getStudentsByClass(@PathVariable Long id) {
        return ResponseEntity.ok(schoolClassService.getStudentsByClassId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        schoolClassService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
