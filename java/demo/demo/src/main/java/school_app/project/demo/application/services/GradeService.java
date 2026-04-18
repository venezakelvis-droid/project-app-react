package school_app.project.demo.application.services;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import school_app.project.demo.application.dtos.GradeDTO;
import school_app.project.demo.application.mappers.GradeMapper;
import school_app.project.demo.application.utils.AuthorizationHelper;
import school_app.project.demo.domain.entities.Enrollment;
import school_app.project.demo.domain.entities.Grade;
import school_app.project.demo.domain.entities.Student;
import school_app.project.demo.domain.entities.Subject;
import school_app.project.demo.domain.exceptions.GradeInvalidException;
import school_app.project.demo.domain.exceptions.ResourceNotFoundException;
import school_app.project.demo.infrastructure.repositories.EnrollmentRepository;
import school_app.project.demo.infrastructure.repositories.GradeRepository;
import school_app.project.demo.infrastructure.repositories.StudentRepository;
import school_app.project.demo.infrastructure.repositories.SubjectRepository;

import java.util.List;
import java.util.Optional;

/**
 * Service for managing grades following Brazilian standard.
 * 2 semesters, 4 grades per semester.
 * Now supports direct Student + Subject + Semester relationships.
 */
@Service
@RequiredArgsConstructor
public class GradeService {

    private final GradeRepository gradeRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final AuthorizationHelper authorizationHelper;

    public GradeDTO create(GradeDTO dto) {

        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", dto.getStudentId()));

        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject", dto.getSubjectId()));

        Enrollment enrollment = null;
        if (dto.getEnrollmentId() != null) {
            enrollment = enrollmentRepository.findById(dto.getEnrollmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Enrollment", dto.getEnrollmentId()));
        }

        // VALIDAÇÃO CRÍTICA: Apenas ADMIN ou o Professor da matéria pode lançar notas
        if (!authorizationHelper.isAdmin()) {
            if (!authorizationHelper.isTeacher()) {
                throw new RuntimeException("Access denied: Only teachers and admins can create grades");
            }
            
            Long teacherId = authorizationHelper.getCurrentTeacherId();
            
            // Validar que o professor é o dono da matéria
            if (!subject.getTeacher().getId().equals(teacherId)) {
                throw new RuntimeException("Access denied: You can only create grades for your subjects");
            }
            
            // Validar que o aluno está na turma do professor (via enrollment)
            if (enrollment == null) {
                throw new RuntimeException("Access denied: Student is not enrolled in your subject");
            }
            
            if (!enrollment.getStudent().getId().equals(student.getId())) {
                throw new RuntimeException("Access denied: Invalid enrollment for student");
            }
            
            if (!enrollment.getSubject().getId().equals(subject.getId())) {
                throw new RuntimeException("Access denied: Invalid enrollment for subject");
            }
        }

        validateGradeNote(dto.getNote1Semester1(), "Nota 1 Semestre 1");
        validateGradeNote(dto.getNote2Semester1(), "Nota 2 Semestre 1");
        validateGradeNote(dto.getNote3Semester1(), "Nota 3 Semestre 1");
        validateGradeNote(dto.getNote4Semester1(), "Nota 4 Semestre 1");
        
        validateGradeNote(dto.getNote1Semester2(), "Nota 1 Semestre 2");
        validateGradeNote(dto.getNote2Semester2(), "Nota 2 Semestre 2");
        validateGradeNote(dto.getNote3Semester2(), "Nota 3 Semestre 2");
        validateGradeNote(dto.getNote4Semester2(), "Nota 4 Semestre 2");

        Grade grade = GradeMapper.toEntity(dto, student, subject, enrollment);
        return GradeMapper.toDTO(gradeRepository.save(grade));
    }

    public GradeDTO findById(Long id) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grade", id));

        // Verify access
        if (!authorizationHelper.isAdmin()) {
            if (authorizationHelper.isTeacher()) {
                Long teacherId = authorizationHelper.getCurrentTeacherId();
                if (grade.getSubject() != null && !grade.getSubject().getTeacher().getId().equals(teacherId)) {
                    throw new RuntimeException("Access denied: Grade does not belong to your subjects");
                }
            } else if (authorizationHelper.isStudent()) {
                Long studentId = authorizationHelper.getCurrentStudentId();
                if (grade.getStudent() != null && !grade.getStudent().getId().equals(studentId)) {
                    throw new RuntimeException("Access denied: This is not your grade");
                }
            } else if (authorizationHelper.isGuardian()) {
                if (grade.getStudent() == null || !authorizationHelper.isGuardianOfStudent(grade.getStudent().getId())) {
                    throw new RuntimeException("Access denied: This is not your dependent's grade");
                }
            }
        }

        return GradeMapper.toDTO(grade);
    }

    public List<GradeDTO> findAll() {
        // ADMIN: returns all grades
        if (authorizationHelper.isAdmin()) {
            return gradeRepository.findAll().stream()
                    .map(GradeMapper::toDTO)
                    .toList();
        }
        
        // TEACHER: returns grades of their subjects
        if (authorizationHelper.isTeacher()) {
            Long teacherId = authorizationHelper.getCurrentTeacherId();
            return gradeRepository.findAll().stream()
                    .filter(grade -> grade.getSubject() != null && grade.getSubject().getTeacher().getId().equals(teacherId))
                    .map(GradeMapper::toDTO)
                    .toList();
        }
        
        // STUDENT: returns only their grades
        if (authorizationHelper.isStudent()) {
            Long studentId = authorizationHelper.getCurrentStudentId();
            return gradeRepository.findByStudentId(studentId).stream()
                    .map(GradeMapper::toDTO)
                    .toList();
        }

        // GUARDIAN: returns grades for their dependents
        if (authorizationHelper.isGuardian()) {
            return gradeRepository.findAll().stream()
                    .filter(grade -> grade.getStudent() != null && authorizationHelper.isGuardianOfStudent(grade.getStudent().getId()))
                    .map(GradeMapper::toDTO)
                    .toList();
        }
        
        return List.of();
    }

    /**
     * Grades for the authenticated teacher only (same filter as {@link #findAll()} teacher branch).
     * Used by {@code GET /api/grades/me} so clients do not need enrollment or list endpoints.
     */
    @Transactional(readOnly = true)
    public List<GradeDTO> findGradesForCurrentTeacher() {
        if (!authorizationHelper.isTeacher()) {
            throw new AccessDeniedException("Apenas professores podem acessar suas notas.");
        }
        Long teacherId = authorizationHelper.getCurrentTeacherId();
        return gradeRepository.findAll().stream()
                .filter(grade -> grade.getSubject() != null && grade.getSubject().getTeacher().getId().equals(teacherId))
                .map(GradeMapper::toDTO)
                .toList();
    }

    public List<GradeDTO> findByStudentId(Long studentId) {
        ensureStudentAccess(studentId);
        return gradeRepository.findByStudentId(studentId).stream()
                .map(GradeMapper::toDTO)
                .toList();
    }

    /**
     * Get grades for a specific student and subject
     */
    public List<GradeDTO> findByStudentAndSubject(Long studentId, Long subjectId) {
        ensureStudentAccess(studentId);
        return gradeRepository.findByStudentIdAndSubjectId(studentId, subjectId).stream()
                .map(GradeMapper::toDTO)
                .toList();
    }

    /**
     * Get grades for a specific student, subject and semester
     */
    public Optional<GradeDTO> findByStudentSubjectAndSemester(Long studentId, Long subjectId, Integer semester) {
        ensureStudentAccess(studentId);
        return gradeRepository.findByStudentIdAndSubjectIdAndSemester(studentId, subjectId, semester)
                .map(GradeMapper::toDTO);
    }

    /**
     * Calculate average grade for a subject in a specific semester
     */
    public Double calculateSubjectAverage(Long studentId, Long subjectId, Integer semester) {
        ensureStudentAccess(studentId);
        Optional<Grade> gradeOpt = gradeRepository.findByStudentIdAndSubjectIdAndSemester(studentId, subjectId, semester);
        if (gradeOpt.isPresent()) {
            Grade grade = gradeOpt.get();
            if (semester == 1) {
                return grade.getAverageSemester1();
            } else if (semester == 2) {
                return grade.getAverageSemester2();
            }
        }
        return null;
    }

    /**
     * Calculate final average for a subject (across both semesters)
     */
    public Double calculateSubjectFinalAverage(Long studentId, Long subjectId) {
        ensureStudentAccess(studentId);
        List<Grade> grades = gradeRepository.findByStudentIdAndSubjectId(studentId, subjectId);
        if (grades.isEmpty()) return null;

        double totalAverage = 0.0;
        int count = 0;

        for (Grade grade : grades) {
            if (grade.getFinalAverage() != null) {
                totalAverage += grade.getFinalAverage();
                count++;
            }
        }

        return count > 0 ? totalAverage / count : null;
    }

    /**
     * Calculate overall student average across all subjects
     */
    public Double calculateStudentOverallAverage(Long studentId) {
        ensureStudentAccess(studentId);
        List<Grade> grades = gradeRepository.findByStudentId(studentId);
        if (grades.isEmpty()) return null;

        double totalAverage = 0.0;
        int count = 0;

        for (Grade grade : grades) {
            if (grade.getFinalAverage() != null) {
                totalAverage += grade.getFinalAverage();
                count++;
            }
        }

        return count > 0 ? totalAverage / count : null;
    }

    private void ensureStudentAccess(Long studentId) {
        if (authorizationHelper.isAdmin()) {
            return;
        }
        if (authorizationHelper.isTeacher()) {
            Long teacherId = authorizationHelper.getCurrentTeacherId();
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            boolean isStudentOfTeacher = student.getEnrollments().stream()
                    .anyMatch(enrollment -> enrollment.getSubject().getTeacher().getId().equals(teacherId));
            if (!isStudentOfTeacher) {
                throw new RuntimeException("Access denied: This student does not belong to your subjects");
            }
            return;
        }
        if (authorizationHelper.isStudent()) {
            Long studentIdAuthenticated = authorizationHelper.getCurrentStudentId();
            if (!studentIdAuthenticated.equals(studentId)) {
                throw new RuntimeException("Access denied: You can only access your own grades");
            }
            return;
        }
        if (authorizationHelper.isGuardian()) {
            if (!authorizationHelper.isGuardianOfStudent(studentId)) {
                throw new RuntimeException("Access denied: You can only access grades for your dependents");
            }
            return;
        }
        throw new RuntimeException("Access denied: Unauthorized user");
    }

    public GradeDTO update(Long id, GradeDTO dto) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grade", id));

        // Only ADMIN or TEACHER of subject can update
        if (!authorizationHelper.isAdmin()) {
            if (authorizationHelper.isTeacher()) {
                Long teacherId = authorizationHelper.getCurrentTeacherId();
                if (grade.getSubject() != null && !grade.getSubject().getTeacher().getId().equals(teacherId)) {
                    throw new RuntimeException("Access denied: You can only update grades for your subjects");
                }
            } else {
                throw new RuntimeException("Access denied: Only teachers and admins can update grades");
            }
        }

        validateGradeNote(dto.getNote1Semester1(), "Nota 1 Semestre 1");
        validateGradeNote(dto.getNote2Semester1(), "Nota 2 Semestre 1");
        validateGradeNote(dto.getNote3Semester1(), "Nota 3 Semestre 1");
        validateGradeNote(dto.getNote4Semester1(), "Nota 4 Semestre 1");
        validateGradeNote(dto.getNote1Semester2(), "Nota 1 Semestre 2");
        validateGradeNote(dto.getNote2Semester2(), "Nota 2 Semestre 2");
        validateGradeNote(dto.getNote3Semester2(), "Nota 3 Semestre 2");
        validateGradeNote(dto.getNote4Semester2(), "Nota 4 Semestre 2");

        grade.setNote1Semester1(dto.getNote1Semester1());
        grade.setNote2Semester1(dto.getNote2Semester1());
        grade.setNote3Semester1(dto.getNote3Semester1());
        grade.setNote4Semester1(dto.getNote4Semester1());
        grade.setNote1Semester2(dto.getNote1Semester2());
        grade.setNote2Semester2(dto.getNote2Semester2());
        grade.setNote3Semester2(dto.getNote3Semester2());
        grade.setNote4Semester2(dto.getNote4Semester2());

        grade.calculateAverages();

        return GradeMapper.toDTO(gradeRepository.save(grade));
    }

    public GradeDTO patch(Long id, GradeDTO dto) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grade", id));

        // Only ADMIN or TEACHER of subject can patch
        if (!authorizationHelper.isAdmin()) {
            if (authorizationHelper.isTeacher()) {
                Long teacherId = authorizationHelper.getCurrentTeacherId();
                if (grade.getSubject() != null && !grade.getSubject().getTeacher().getId().equals(teacherId)) {
                    throw new RuntimeException("Access denied: You can only patch grades for your subjects");
                }
            } else {
                throw new RuntimeException("Access denied: Only teachers and admins can patch grades");
            }
        }

        if (dto.getNote1Semester1() != null) {
            validateGradeNote(dto.getNote1Semester1(), "Nota 1 Semestre 1");
            grade.setNote1Semester1(dto.getNote1Semester1());
        }
        if (dto.getNote2Semester1() != null) {
            validateGradeNote(dto.getNote2Semester1(), "Nota 2 Semestre 1");
            grade.setNote2Semester1(dto.getNote2Semester1());
        }
        if (dto.getNote3Semester1() != null) {
            validateGradeNote(dto.getNote3Semester1(), "Nota 3 Semestre 1");
            grade.setNote3Semester1(dto.getNote3Semester1());
        }
        if (dto.getNote4Semester1() != null) {
            validateGradeNote(dto.getNote4Semester1(), "Nota 4 Semestre 1");
            grade.setNote4Semester1(dto.getNote4Semester1());
        }
        if (dto.getNote1Semester2() != null) {
            validateGradeNote(dto.getNote1Semester2(), "Nota 1 Semestre 2");
            grade.setNote1Semester2(dto.getNote1Semester2());
        }
        if (dto.getNote2Semester2() != null) {
            validateGradeNote(dto.getNote2Semester2(), "Nota 2 Semestre 2");
            grade.setNote2Semester2(dto.getNote2Semester2());
        }
        if (dto.getNote3Semester2() != null) {
            validateGradeNote(dto.getNote3Semester2(), "Nota 3 Semestre 2");
            grade.setNote3Semester2(dto.getNote3Semester2());
        }
        if (dto.getNote4Semester2() != null) {
            validateGradeNote(dto.getNote4Semester2(), "Nota 4 Semestre 2");
            grade.setNote4Semester2(dto.getNote4Semester2());
        }

        grade.calculateAverages();

        return GradeMapper.toDTO(gradeRepository.save(grade));
    }

    public void delete(Long id) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grade", id));

        // Only ADMIN or TEACHER of subject can delete
        if (!authorizationHelper.isAdmin()) {
            if (authorizationHelper.isTeacher()) {
                Long teacherId = authorizationHelper.getCurrentTeacherId();
                if (grade.getSubject() != null && !grade.getSubject().getTeacher().getId().equals(teacherId)) {
                    throw new RuntimeException("Access denied: You can only delete grades for your subjects");
                }
            } else {
                throw new RuntimeException("Access denied: Only teachers and admins can delete grades");
            }
        }

        gradeRepository.deleteById(id);
    }

    private void validateGradeNote(Double grade, String fieldName) {
        if (grade != null && (grade < 0 || grade > 10)) {
            throw new GradeInvalidException(grade);
        }
    }

}