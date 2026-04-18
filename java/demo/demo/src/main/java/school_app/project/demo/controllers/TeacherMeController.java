package school_app.project.demo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import school_app.project.demo.application.dtos.TeacherDTO;
import school_app.project.demo.application.dtos.SchoolClassDTO;
import school_app.project.demo.application.dtos.SubjectDTO;
import school_app.project.demo.application.services.TeacherService;
import school_app.project.demo.application.services.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
public class TeacherMeController {

    private final TeacherService teacherService;
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<TeacherDTO> getCurrentTeacher(Authentication authentication) {
        var user = userService.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalStateException("Usuário não encontrado."));
        
        if (user.getTeacher() == null) {
            throw new IllegalStateException("Usuário não é um professor.");
        }
        
        return ResponseEntity.ok(teacherService.findById(user.getTeacher().getId()));
    }

    @GetMapping("/me/classes")
    public ResponseEntity<List<SchoolClassDTO>> getMyClasses(Authentication authentication) {
        var user = userService.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalStateException("Usuário não encontrado."));
        
        if (user.getTeacher() == null) {
            throw new IllegalStateException("Usuário não é um professor.");
        }
        
        return ResponseEntity.ok(teacherService.getClassesByTeacherId(user.getTeacher().getId()));
    }

    @GetMapping("/me/subjects")
    public ResponseEntity<List<SubjectDTO>> getMySubjects(
            Authentication authentication,
            @RequestParam(required = false) Long classId) {
        
        var user = userService.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalStateException("Usuário não encontrado."));
        
        if (user.getTeacher() == null) {
            throw new IllegalStateException("Usuário não é um professor.");
        }
        
        return ResponseEntity.ok(
            teacherService.getSubjectsByTeacherAndClass(user.getTeacher().getId(), classId)
        );
    }

}
