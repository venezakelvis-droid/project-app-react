package school_app.project.demo.application.services;


import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import school_app.project.demo.application.dtos.SubjectDTO;
import school_app.project.demo.application.mappers.SubjectMapper;
import school_app.project.demo.application.utils.AuthorizationHelper;
import school_app.project.demo.domain.entities.Subject;
import school_app.project.demo.domain.entities.Teacher;
import school_app.project.demo.domain.exceptions.ResourceNotFoundException;
import school_app.project.demo.infrastructure.repositories.SubjectRepository;
import school_app.project.demo.infrastructure.repositories.TeacherRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final TeacherRepository teacherRepository;
    private final AuthorizationHelper authorizationHelper;

    public SubjectDTO create(SubjectDTO dto){

        Teacher teacher = teacherRepository.findById(dto.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", dto.getTeacherId()));

        Subject subject = SubjectMapper.toEntity(dto, teacher);

        return SubjectMapper.toDTO(subjectRepository.save(subject));
    }

    public SubjectDTO findById(Long id){
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject", id));

        // Verificar acesso
        if (!authorizationHelper.isAdmin()) {
            if (authorizationHelper.isTeacher()) {
                Long teacherId = authorizationHelper.getCurrentTeacherId();
                if (!subject.getTeacher().getId().equals(teacherId)) {
                    throw new RuntimeException("Access denied: Subject does not belong to your account");
                }
            } else if (authorizationHelper.isStudent()) {
                Long studentId = authorizationHelper.getCurrentStudentId();
                boolean hasEnrollment = subject.getEnrollments().stream()
                        .anyMatch(enrollment -> enrollment.getStudent().getId().equals(studentId));
                if (!hasEnrollment) {
                    throw new RuntimeException("Access denied: You are not enrolled in this subject");
                }
            }
        }

        return SubjectMapper.toDTO(subject);
    }

    public List<SubjectDTO> findAll(){
        // ADMIN: retorna todas as disciplinas
        if (authorizationHelper.isAdmin()) {
            return subjectRepository.findAll().stream()
                    .map(SubjectMapper::toDTO)
                    .toList();
        }
        
        // TEACHER: retorna apenas suas disciplinas
        if (authorizationHelper.isTeacher()) {
            Long teacherId = authorizationHelper.getCurrentTeacherId();
            return subjectRepository.findByTeacherId(teacherId).stream()
                    .map(SubjectMapper::toDTO)
                    .toList();
        }
        
        // STUDENT: retorna disciplinas em que está matriculado
        if (authorizationHelper.isStudent()) {
            Long studentId = authorizationHelper.getCurrentStudentId();
            return subjectRepository.findAll().stream()
                    .filter(subject -> subject.getEnrollments().stream()
                            .anyMatch(enrollment -> enrollment.getStudent().getId().equals(studentId)))
                    .map(SubjectMapper::toDTO)
                    .toList();
        }
        
        return List.of();
    }

    public List<SubjectDTO> findByTeacherId(Long teacherId) {
        return subjectRepository.findByTeacherId(teacherId).stream()
                .map(SubjectMapper::toDTO)
                .toList();
    }

    public SubjectDTO update(Long id, SubjectDTO dto){
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject", id));

        // APENAS ADMIN pode atualizar disciplinas
        if (!authorizationHelper.isAdmin()) {
            throw new RuntimeException("Access denied: Only admins can update subjects");
        }

        Teacher teacher = teacherRepository.findById(dto.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", dto.getTeacherId()));

        subject.setName(dto.getName());
        subject.setDescription(dto.getDescription());
        subject.setTeacher(teacher);

        return SubjectMapper.toDTO(subjectRepository.save(subject));
    }

    public SubjectDTO patch(Long id, SubjectDTO dto){
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject", id));

        // APENAS ADMIN pode fazer patch em disciplinas
        if (!authorizationHelper.isAdmin()) {
            throw new RuntimeException("Access denied: Only admins can update subjects");
        }

        if(dto.getName() != null) subject.setName(dto.getName());
        if(dto.getDescription() != null) subject.setDescription(dto.getDescription());
        if(dto.getTeacherId() != null){
            Teacher teacher = teacherRepository.findById(dto.getTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher", dto.getTeacherId()));
            subject.setTeacher(teacher);
        }

        return SubjectMapper.toDTO(subjectRepository.save(subject));
    }

    public void delete(Long id){
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject", id));

        // Apenas ADMIN pode deletar disciplinas
        if (!authorizationHelper.isAdmin()) {
            throw new RuntimeException("Access denied: Only admins can delete subjects");
        }

        subjectRepository.deleteById(id);
    }

    public List<SubjectDTO> findByTeacherAndClass(Long teacherId, Long classId) {
        return subjectRepository.findByTeacherAndClass(teacherId, classId).stream()
                .map(SubjectMapper::toDTO)
                .toList();
    }

}
