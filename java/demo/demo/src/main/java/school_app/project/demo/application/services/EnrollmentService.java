package school_app.project.demo.application.services;


import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import school_app.project.demo.application.dtos.EnrollmentDTO;
import school_app.project.demo.application.mappers.EnrollmentMapper;
import school_app.project.demo.application.utils.AuthorizationHelper;
import school_app.project.demo.domain.entities.Enrollment;
import school_app.project.demo.domain.entities.SchoolClass;
import school_app.project.demo.domain.entities.Student;
import school_app.project.demo.domain.entities.Subject;
import school_app.project.demo.domain.exceptions.EnrollmentAlreadyExistsException;
import school_app.project.demo.domain.exceptions.ResourceNotFoundException;
import school_app.project.demo.infrastructure.repositories.EnrollmentRepository;
import school_app.project.demo.infrastructure.repositories.SchoolClassRepository;
import school_app.project.demo.infrastructure.repositories.StudentRepository;
import school_app.project.demo.infrastructure.repositories.SubjectRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final AuthorizationHelper authorizationHelper;

    public EnrollmentDTO enroll(EnrollmentDTO dto){

        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", dto.getStudentId()));

        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject", dto.getSubjectId()));

        SchoolClass schoolClass = schoolClassRepository.findById(dto.getSchoolClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class", dto.getSchoolClassId()));

        enrollmentRepository.findByStudentIdAndSubjectId(student.getId(), subject.getId())
                .ifPresent(e -> { throw new EnrollmentAlreadyExistsException(student.getId(), subject.getId()); });

        Enrollment enrollment = EnrollmentMapper.toEntity(dto, student, subject, schoolClass);

        return EnrollmentMapper.toDTO(enrollmentRepository.save(enrollment));
    }

    public EnrollmentDTO findById(Long id){
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment", id));

        // Verificar acesso
        if (!authorizationHelper.isAdmin()) {
            if (authorizationHelper.isTeacher()) {
                Long teacherId = authorizationHelper.getCurrentTeacherId();
                if (!enrollment.getSubject().getTeacher().getId().equals(teacherId)) {
                    throw new RuntimeException("Access denied: Enrollment does not belong to your subjects");
                }
            } else if (authorizationHelper.isStudent()) {
                Long studentId = authorizationHelper.getCurrentStudentId();
                if (!enrollment.getStudent().getId().equals(studentId)) {
                    throw new RuntimeException("Access denied: This is not your enrollment");
                }
            }
        }

        return EnrollmentMapper.toDTO(enrollment);
    }

    public List<EnrollmentDTO> findAll(){
        // ADMIN: retorna todos os registros de matrícula
        if (authorizationHelper.isAdmin()) {
            return enrollmentRepository.findAll().stream()
                    .map(EnrollmentMapper::toDTO)
                    .toList();
        }
        
        // TEACHER: retorna matrículas de suas disciplinas
        if (authorizationHelper.isTeacher()) {
            Long teacherId = authorizationHelper.getCurrentTeacherId();
            return enrollmentRepository.findAll().stream()
                    .filter(enrollment -> enrollment.getSubject().getTeacher().getId().equals(teacherId))
                    .map(EnrollmentMapper::toDTO)
                    .toList();
        }
        
        // STUDENT: retorna apenas suas matrículas
        if (authorizationHelper.isStudent()) {
            Long studentId = authorizationHelper.getCurrentStudentId();
            return enrollmentRepository.findByStudentId(studentId).stream()
                    .map(EnrollmentMapper::toDTO)
                    .toList();
        }
        
        return List.of();
    }

    public List<EnrollmentDTO> findByStudentId(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId).stream()
                .map(EnrollmentMapper::toDTO)
                .toList();
    }

    public EnrollmentDTO update(Long id, EnrollmentDTO dto){
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment", id));

        // Apenas ADMIN ou TEACHER da disciplina podem atualizar
        if (!authorizationHelper.isAdmin()) {
            if (authorizationHelper.isTeacher()) {
                Long teacherId = authorizationHelper.getCurrentTeacherId();
                if (!enrollment.getSubject().getTeacher().getId().equals(teacherId)) {
                    throw new RuntimeException("Access denied: You can only update enrollments for your subjects");
                }
            } else {
                throw new RuntimeException("Access denied: Only teachers and admins can update enrollments");
            }
        }

        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", dto.getStudentId()));

        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject", dto.getSubjectId()));

        SchoolClass schoolClass = schoolClassRepository.findById(dto.getSchoolClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class", dto.getSchoolClassId()));

        enrollment.setStudent(student);
        enrollment.setSubject(subject);
        enrollment.setSchoolClass(schoolClass);

        return EnrollmentMapper.toDTO(enrollmentRepository.save(enrollment));
    }

    public EnrollmentDTO patch(Long id, EnrollmentDTO dto){
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment", id));

        // Apenas ADMIN ou TEACHER da disciplina podem atualizar
        if (!authorizationHelper.isAdmin()) {
            if (authorizationHelper.isTeacher()) {
                Long teacherId = authorizationHelper.getCurrentTeacherId();
                if (!enrollment.getSubject().getTeacher().getId().equals(teacherId)) {
                    throw new RuntimeException("Access denied: You can only patch enrollments for your subjects");
                }
            } else {
                throw new RuntimeException("Access denied: Only teachers and admins can patch enrollments");
            }
        }

        if(dto.getStudentId() != null){
            Student student = studentRepository.findById(dto.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student", dto.getStudentId()));
            enrollment.setStudent(student);
        }
        if(dto.getSubjectId() != null){
            Subject subject = subjectRepository.findById(dto.getSubjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subject", dto.getSubjectId()));
            enrollment.setSubject(subject);
        }
        if(dto.getSchoolClassId() != null){
            SchoolClass schoolClass = schoolClassRepository.findById(dto.getSchoolClassId())
                    .orElseThrow(() -> new ResourceNotFoundException("Class", dto.getSchoolClassId()));
            enrollment.setSchoolClass(schoolClass);
        }

        return EnrollmentMapper.toDTO(enrollmentRepository.save(enrollment));
    }

    public void delete(Long id){
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment", id));

        // Apenas ADMIN ou TEACHER da disciplina podem deletar
        if (!authorizationHelper.isAdmin()) {
            if (authorizationHelper.isTeacher()) {
                Long teacherId = authorizationHelper.getCurrentTeacherId();
                if (!enrollment.getSubject().getTeacher().getId().equals(teacherId)) {
                    throw new RuntimeException("Access denied: You can only delete enrollments for your subjects");
                }
            } else {
                throw new RuntimeException("Access denied: Only teachers and admins can delete enrollments");
            }
        }

        enrollmentRepository.deleteById(id);
    }

}