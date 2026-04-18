package school_app.project.demo.application.services;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import school_app.project.demo.application.dtos.TeacherDTO;
import school_app.project.demo.application.dtos.SchoolClassDTO;
import school_app.project.demo.application.dtos.SubjectDTO;
import school_app.project.demo.application.mappers.TeacherMapper;
import school_app.project.demo.application.mappers.SchoolClassMapper;
import school_app.project.demo.application.mappers.SubjectMapper;
import school_app.project.demo.application.utils.AuthorizationHelper;
import school_app.project.demo.domain.entities.Teacher;
import school_app.project.demo.domain.exceptions.ResourceNotFoundException;
import school_app.project.demo.infrastructure.repositories.TeacherRepository;
import school_app.project.demo.infrastructure.repositories.SchoolClassRepository;
import school_app.project.demo.infrastructure.repositories.SubjectRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final SubjectRepository subjectRepository;
    private final AuthorizationHelper authorizationHelper;

    public TeacherDTO create(TeacherDTO dto){

        Teacher teacher = TeacherMapper.toEntity(dto);

        return TeacherMapper.toDTO(teacherRepository.save(teacher));
    }

    public TeacherDTO findById(Long id){

        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", id));

        // Verificar acesso
        if (!authorizationHelper.isAdmin()) {
            if (authorizationHelper.isTeacher()) {
                Long teacherId = authorizationHelper.getCurrentTeacherId();
                if (!teacher.getId().equals(teacherId)) {
                    throw new RuntimeException("Access denied: You can only view your own data");
                }
            } else {
                throw new RuntimeException("Access denied: Only teachers and admins can view teacher data");
            }
        }

        return TeacherMapper.toDTO(teacher);
    }

    public List<TeacherDTO> findAll(){
        // ADMIN: retorna todos os professores
        if (authorizationHelper.isAdmin()) {
            return teacherRepository.findAll()
                    .stream()
                    .map(TeacherMapper::toDTO)
                    .toList();
        }
        
        // TEACHER: retorna apenas dados de si mesmo
        if (authorizationHelper.isTeacher()) {
            Long teacherId = authorizationHelper.getCurrentTeacherId();
            return teacherRepository.findById(teacherId)
                    .map(teacher -> List.of(TeacherMapper.toDTO(teacher)))
                    .orElse(List.of());
        }
        
        // STUDENT: não pode listar professores em detalhes (segurança)
        return List.of();
    }

    public TeacherDTO update(Long id, TeacherDTO dto){
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", id));

        // Apenas ADMIN ou o próprio TEACHER podem atualizar
        if (!authorizationHelper.isAdmin()) {
            if (authorizationHelper.isTeacher()) {
                Long teacherId = authorizationHelper.getCurrentTeacherId();
                if (!teacher.getId().equals(teacherId)) {
                    throw new RuntimeException("Access denied: You can only update your own data");
                }
            } else {
                throw new RuntimeException("Access denied: Only teachers and admins can update teacher data");
            }
        }

        teacher.setName(dto.getName());
        teacher.setEmail(dto.getEmail());
        teacher.setPhone(dto.getPhone());
        teacher.setCpf(dto.getCpf());

        return TeacherMapper.toDTO(teacherRepository.save(teacher));
    }

    public TeacherDTO patch(Long id, TeacherDTO dto){
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", id));

        // Apenas ADMIN ou o próprio TEACHER podem fazer patch
        if (!authorizationHelper.isAdmin()) {
            if (authorizationHelper.isTeacher()) {
                Long teacherId = authorizationHelper.getCurrentTeacherId();
                if (!teacher.getId().equals(teacherId)) {
                    throw new RuntimeException("Access denied: You can only patch your own data");
                }
            } else {
                throw new RuntimeException("Access denied: Only teachers and admins can patch teacher data");
            }
        }

        if(dto.getName() != null) teacher.setName(dto.getName());
        if(dto.getEmail() != null) teacher.setEmail(dto.getEmail());
        if(dto.getPhone() != null) teacher.setPhone(dto.getPhone());
        if(dto.getCpf() != null) teacher.setCpf(dto.getCpf());

        return TeacherMapper.toDTO(teacherRepository.save(teacher));
    }

    public void delete(Long id){
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", id));

        // Apenas ADMIN pode deletar professores
        if (!authorizationHelper.isAdmin()) {
            throw new RuntimeException("Access denied: Only admins can delete teachers");
        }

        teacherRepository.deleteById(id);
    }

    public List<SchoolClassDTO> getClassesByTeacherId(Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", teacherId));

        // Verificar acesso: apenas ADMIN ou o próprio professor
        if (!authorizationHelper.isAdmin()) {
            if (authorizationHelper.isTeacher()) {
                Long currentTeacherId = authorizationHelper.getCurrentTeacherId();
                if (!teacherId.equals(currentTeacherId)) {
                    throw new RuntimeException("Access denied: You can only view your own classes");
                }
            } else {
                throw new RuntimeException("Access denied: Only teachers and admins can view classes");
            }
        }

        return schoolClassRepository.findByTeacherId(teacherId).stream()
                .map(SchoolClassMapper::toDTO)
                .toList();
    }

    public List<SubjectDTO> getSubjectsByTeacherAndClass(Long teacherId, Long classId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", teacherId));

        // Verificar acesso: apenas ADMIN ou o próprio professor
        if (!authorizationHelper.isAdmin()) {
            if (authorizationHelper.isTeacher()) {
                Long currentTeacherId = authorizationHelper.getCurrentTeacherId();
                if (!teacherId.equals(currentTeacherId)) {
                    throw new RuntimeException("Access denied: You can only view your own subjects");
                }
            } else {
                throw new RuntimeException("Access denied: Only teachers and admins can view subjects");
            }
        }

        // Se classId for null, retornar todas as disciplinas do professor
        if (classId == null) {
            return subjectRepository.findByTeacherId(teacherId).stream()
                    .map(SubjectMapper::toDTO)
                    .toList();
        }

        // Caso contrário, retornar disciplinas do professor na turma específica
        return subjectRepository.findByTeacherAndClass(teacherId, classId).stream()
                .map(SubjectMapper::toDTO)
                .toList();
    }

}