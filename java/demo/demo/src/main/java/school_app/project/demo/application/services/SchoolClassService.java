package school_app.project.demo.application.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import school_app.project.demo.application.dtos.SchoolClassDTO;
import school_app.project.demo.application.dtos.StudentDTO;
import school_app.project.demo.application.mappers.SchoolClassMapper;
import school_app.project.demo.application.mappers.StudentMapper;
import school_app.project.demo.application.utils.AuthorizationHelper;
import school_app.project.demo.domain.entities.SchoolClass;
import school_app.project.demo.domain.exceptions.ResourceNotFoundException;
import school_app.project.demo.infrastructure.repositories.SchoolClassRepository;
import school_app.project.demo.infrastructure.repositories.StudentRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SchoolClassService {

    private final SchoolClassRepository schoolClassRepository;
    private final StudentRepository studentRepository;
    private final AuthorizationHelper authorizationHelper;

    public SchoolClassDTO create(SchoolClassDTO dto) {
        SchoolClass schoolClass = SchoolClassMapper.toEntity(dto);
        return SchoolClassMapper.toDTO(schoolClassRepository.save(schoolClass));
    }

    public SchoolClassDTO findById(Long id) {
        SchoolClass schoolClass = schoolClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SchoolClass", id));
        
        // Verificar acesso
        if (!authorizationHelper.isAdmin()) {
            if (authorizationHelper.isTeacher()) {
                Long teacherId = authorizationHelper.getCurrentTeacherId();
                boolean isTeacherOfClass = schoolClass.getEnrollments().stream()
                        .anyMatch(enrollment -> enrollment.getSubject().getTeacher().getId().equals(teacherId));
                if (!isTeacherOfClass) {
                    throw new RuntimeException("Access denied: This class does not belong to your subjects");
                }
            } else if (authorizationHelper.isStudent()) {
                Long studentId = authorizationHelper.getCurrentStudentId();
                boolean isEnrolledInClass = schoolClass.getEnrollments().stream()
                        .anyMatch(enrollment -> enrollment.getStudent().getId().equals(studentId));
                if (!isEnrolledInClass) {
                    throw new RuntimeException("Access denied: You are not enrolled in this class");
                }
            }
        }
        
        return SchoolClassMapper.toDTO(schoolClass);
    }

    public List<SchoolClassDTO> findAll() {
        // ADMIN: retorna todas as turmas
        if (authorizationHelper.isAdmin()) {
            return schoolClassRepository.findAll().stream()
                    .map(SchoolClassMapper::toDTO)
                    .toList();
        }
        
        // TEACHER: retorna apenas suas turmas
        if (authorizationHelper.isTeacher()) {
            Long teacherId = authorizationHelper.getCurrentTeacherId();
            return schoolClassRepository.findByTeacherId(teacherId).stream()
                    .map(SchoolClassMapper::toDTO)
                    .toList();
        }
        
        // STUDENT: retorna apenas turmas em que está matriculado
        if (authorizationHelper.isStudent()) {
            Long studentId = authorizationHelper.getCurrentStudentId();
            return schoolClassRepository.findByStudentId(studentId).stream()
                    .map(SchoolClassMapper::toDTO)
                    .toList();
        }
        
        return List.of();
    }

    @Transactional
    public SchoolClassDTO update(Long id, SchoolClassDTO dto) {
        SchoolClass schoolClass = schoolClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SchoolClass", id));
        
        // Apenas ADMIN pode atualizar turmas
        if (!authorizationHelper.isAdmin()) {
            throw new RuntimeException("Access denied: Only admins can update classes");
        }
        
        schoolClass.setName(dto.getName());
        schoolClass.setSchoolYear(dto.getSchoolYear());
        schoolClass.setSemester(dto.getSemester());
        schoolClass.setRoom(dto.getRoom());
        schoolClass.setShift(dto.getShift());
        return SchoolClassMapper.toDTO(schoolClassRepository.save(schoolClass));
    }

    @Transactional
    public SchoolClassDTO patch(Long id, SchoolClassDTO dto) {
        SchoolClass schoolClass = schoolClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SchoolClass", id));
        
        // Apenas ADMIN pode fazer patch em turmas
        if (!authorizationHelper.isAdmin()) {
            throw new RuntimeException("Access denied: Only admins can patch classes");
        }
        
        if (dto.getName() != null) {
            schoolClass.setName(dto.getName());
        }
        if (dto.getSchoolYear() != null) {
            schoolClass.setSchoolYear(dto.getSchoolYear());
        }
        if (dto.getSemester() != null) {
            schoolClass.setSemester(dto.getSemester());
        }
        if (dto.getRoom() != null) {
            schoolClass.setRoom(dto.getRoom());
        }
        if (dto.getShift() != null) {
            schoolClass.setShift(dto.getShift());
        }
        return SchoolClassMapper.toDTO(schoolClassRepository.save(schoolClass));
    }

    public void delete(Long id) {
        SchoolClass schoolClass = schoolClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SchoolClass", id));
        
        // Apenas ADMIN pode deletar turmas
        if (!authorizationHelper.isAdmin()) {
            throw new RuntimeException("Access denied: Only admins can delete classes");
        }
        
        schoolClassRepository.deleteById(id);
    }

    public List<StudentDTO> getStudentsByClassId(Long classId) {
        SchoolClass schoolClass = schoolClassRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("SchoolClass", classId));

        // Verificar acesso: ADMIN, professor da turma, ou aluno da turma
        if (!authorizationHelper.isAdmin()) {
            if (authorizationHelper.isTeacher()) {
                Long teacherId = authorizationHelper.getCurrentTeacherId();
                boolean isTeacherOfClass = schoolClass.getEnrollments().stream()
                        .anyMatch(enrollment -> enrollment.getSubject().getTeacher().getId().equals(teacherId));
                if (!isTeacherOfClass) {
                    throw new RuntimeException("Access denied: You are not a teacher of this class");
                }
            } else if (authorizationHelper.isStudent()) {
                Long studentId = authorizationHelper.getCurrentStudentId();
                boolean isStudentInClass = schoolClass.getStudents().stream()
                        .anyMatch(student -> student.getId().equals(studentId));
                if (!isStudentInClass) {
                    throw new RuntimeException("Access denied: You are not a student in this class");
                }
            } else {
                throw new RuntimeException("Access denied");
            }
        }

        return studentRepository.findBySchoolClassId(classId).stream()
                .map(StudentMapper::toDTO)
                .toList();
    }

}
