package school_app.project.demo.application.services;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import school_app.project.demo.application.dtos.StudentDTO;
import school_app.project.demo.application.mappers.StudentMapper;
import school_app.project.demo.application.utils.AuthorizationHelper;
import school_app.project.demo.domain.entities.Student;
import school_app.project.demo.domain.exceptions.ResourceNotFoundException;
import school_app.project.demo.domain.exceptions.StudentAlreadyExistsException;
import school_app.project.demo.infrastructure.repositories.StudentRepository;
import school_app.project.demo.infrastructure.repositories.SchoolClassRepository;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final AuthorizationHelper authorizationHelper;

    public StudentDTO create(StudentDTO dto){

        if(studentRepository.existsByCpf(dto.getCpf())){
            throw new StudentAlreadyExistsException(dto.getCpf());
        }

        // classId é OBRIGATÓRIO
        if (dto.getClassId() == null) {
            throw new RuntimeException("Student must be assigned to a school class");
        }

        // Resolver SchoolClass
        var schoolClass = schoolClassRepository.findById(dto.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("SchoolClass", dto.getClassId()));

        Student student = StudentMapper.toEntity(dto);
        student.setSchoolClass(schoolClass);

        return StudentMapper.toDTO(studentRepository.save(student));
    }

    public StudentDTO findById(Long id){

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", id));

        // Verificar acesso
        if (!authorizationHelper.isAdmin()) {
            if (authorizationHelper.isTeacher()) {
                Long teacherId = authorizationHelper.getCurrentTeacherId();
                boolean isStudentOfTeacher = student.getEnrollments().stream()
                        .anyMatch(enrollment -> enrollment.getSubject().getTeacher().getId().equals(teacherId));
                if (!isStudentOfTeacher) {
                    throw new RuntimeException("Access denied: This student does not belong to your subjects");
                }
            } else if (authorizationHelper.isStudent()) {
                Long studentId = authorizationHelper.getCurrentStudentId();
                if (!student.getId().equals(studentId)) {
                    throw new RuntimeException("Access denied: You can only view your own data");
                }
            } else if (authorizationHelper.isGuardian()) {
                if (!authorizationHelper.isGuardianOfStudent(student.getId())) {
                    throw new RuntimeException("Access denied: This is not your dependent");
                }
            }
        }

        return StudentMapper.toDTO(student);
    }

    public List<StudentDTO> findAll(){
        // ADMIN: retorna todos os estudantes
        if (authorizationHelper.isAdmin()) {
            return studentRepository.findAll()
                    .stream()
                    .map(StudentMapper::toDTO)
                    .toList();
        }
        
        // TEACHER: retorna apenas estudantes de suas disciplinas
        if (authorizationHelper.isTeacher()) {
            Long teacherId = authorizationHelper.getCurrentTeacherId();
            return studentRepository.findAll()
                    .stream()
                    .filter(student -> student.getEnrollments().stream()
                            .anyMatch(enrollment -> enrollment.getSubject().getTeacher().getId().equals(teacherId)))
                    .map(StudentMapper::toDTO)
                    .toList();
        }
        
        // STUDENT: retorna apenas a si mesmo
        if (authorizationHelper.isStudent()) {
            Long studentId = authorizationHelper.getCurrentStudentId();
            return studentRepository.findById(studentId)
                    .map(student -> List.of(StudentMapper.toDTO(student)))
                    .orElse(List.of());
        }

        // GUARDIAN: returns only dependents
        if (authorizationHelper.isGuardian()) {
            Long guardianId = authorizationHelper.getCurrentUser().getId();
            return studentRepository.findByGuardianId(guardianId)
                    .stream()
                    .map(StudentMapper::toDTO)
                    .toList();
        }
        
        return List.of();
    }

    public StudentDTO findCurrentStudent() {
        if (!authorizationHelper.isStudent()) {
            throw new RuntimeException("Access denied: Only students can access their own profile");
        }

        Long studentId = authorizationHelper.getCurrentStudentId();
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", studentId));

        return StudentMapper.toDTO(student);
    }

    public void delete(Long id){

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", id));

        // Apenas ADMIN pode deletar estudantes
        if (!authorizationHelper.isAdmin()) {
            throw new RuntimeException("Access denied: Only admins can delete students");
        }

        studentRepository.deleteById(id);
    }

    public StudentDTO update(Long id, StudentDTO dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", id));

        // APENAS ADMIN pode atualizar alunos
        if (!authorizationHelper.isAdmin()) {
            throw new RuntimeException("Access denied: Only admins can update students");
        }

        student.setName(dto.getName());
        student.setEmail(dto.getEmail());
        student.setPhone(dto.getPhone());
        student.setCpf(dto.getCpf());
        
        // Permitir alterar a classe do aluno
        if (dto.getClassId() != null) {
            var schoolClass = schoolClassRepository.findById(dto.getClassId())
                    .orElseThrow(() -> new ResourceNotFoundException("SchoolClass", dto.getClassId()));
            student.setSchoolClass(schoolClass);
        }
        
        return StudentMapper.toDTO(studentRepository.save(student));
    }

    public StudentDTO patch(Long id, StudentDTO dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", id));

        // APENAS ADMIN pode fazer patch em alunos
        if (!authorizationHelper.isAdmin()) {
            throw new RuntimeException("Access denied: Only admins can update students");
        }

        if (dto.getName() != null) student.setName(dto.getName());
        if (dto.getEmail() != null) student.setEmail(dto.getEmail());
        if (dto.getPhone() != null) student.setPhone(dto.getPhone());
        if (dto.getCpf() != null) student.setCpf(dto.getCpf());
        if (dto.getClassId() != null) {
            var schoolClass = schoolClassRepository.findById(dto.getClassId())
                    .orElseThrow(() -> new ResourceNotFoundException("SchoolClass", dto.getClassId()));
            student.setSchoolClass(schoolClass);
        }

        return StudentMapper.toDTO(studentRepository.save(student));
    }

}