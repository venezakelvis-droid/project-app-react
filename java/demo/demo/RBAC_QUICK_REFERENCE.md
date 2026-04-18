# 📖 Guia de Referência Rápida - Implementação RBAC

## 1. Como Usar AuthorizationHelper em um Service

### Padrão Básico

```java
@Service
@RequiredArgsConstructor
public class MeuService {
    
    private final MeuRepository meuRepository;
    private final AuthorizationHelper authorizationHelper;
    
    // EXEMPLO 1: findAll() com filtro por role
    public List<MeuDTO> findAll() {
        // Verificar se é ADMIN
        if (authorizationHelper.isAdmin()) {
            return meuRepository.findAll().stream()
                    .map(MeuMapper::toDTO)
                    .toList();
        }
        
        // Verificar se é TEACHER
        if (authorizationHelper.isTeacher()) {
            Long teacherId = authorizationHelper.getCurrentTeacherId();
            return meuRepository.findByTeacherId(teacherId).stream()
                    .map(MeuMapper::toDTO)
                    .toList();
        }
        
        // Verificar se é STUDENT
        if (authorizationHelper.isStudent()) {
            Long studentId = authorizationHelper.getCurrentStudentId();
            return meuRepository.findByStudentId(studentId).stream()
                    .map(MeuMapper::toDTO)
                    .toList();
        }
        
        return List.of();
    }
    
    // EXEMPLO 2: findById() com verificação de acesso
    public MeuDTO findById(Long id) {
        Meu entidade = meuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Meu", id));
        
        // Verificar acesso
        if (!authorizationHelper.isAdmin()) {
            if (authorizationHelper.isTeacher()) {
                Long teacherId = authorizationHelper.getCurrentTeacherId();
                if (!entidade.getTeacher().getId().equals(teacherId)) {
                    throw new RuntimeException("Access denied");
                }
            } else if (authorizationHelper.isStudent()) {
                Long studentId = authorizationHelper.getCurrentStudentId();
                if (!entidade.getStudent().getId().equals(studentId)) {
                    throw new RuntimeException("Access denied");
                }
            }
        }
        
        return MeuMapper.toDTO(entidade);
    }
    
    // EXEMPLO 3: update() apenas para proprietários
    public MeuDTO update(Long id, MeuDTO dto) {
        Meu entidade = meuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Meu", id));
        
        // Apenas ADMIN e Teacher/Student proprietário
        if (!authorizationHelper.isAdmin()) {
            if (authorizationHelper.isTeacher()) {
                Long teacherId = authorizationHelper.getCurrentTeacherId();
                if (!entidade.getTeacher().getId().equals(teacherId)) {
                    throw new RuntimeException("Access denied");
                }
            } else {
                throw new RuntimeException("Access denied");
            }
        }
        
        // ... resto da lógica
        return MeuMapper.toDTO(meuRepository.save(entidade));
    }
}
```

## 2. Métodos Disponíveis do AuthorizationHelper

```java
// OBTER INFORMAÇÕES DO USUÁRIO
User getCurrentUser()                    // Retorna User logado
Optional<Teacher> getCurrentUserAsTeacher()  // Retorna Teacher se logado
Optional<Student> getCurrentUserAsStudent()  // Retorna Student se logado

// VERIFICAR ROLE
boolean isAdmin()                        // true se é ADMIN
boolean isTeacher()                      // true se é TEACHER
boolean isStudent()                      // true se é STUDENT

// OBTER IDS
Long getCurrentTeacherId()               // ID do Teacher (lança erro se não é)
Long getCurrentStudentId()               // ID do Student (lança erro se não é)
```

## 3. Métodos Disponíveis do SecurityUtils

```java
// Obter email do usuário logado
String getCurrentUserEmail()             // "usuario@email.com"

// Verificar roles
boolean hasRole(String role)             // true/false
boolean isAdmin()                        // true/false
boolean isTeacher()                      // true/false
boolean isStudent()                      // true/false
```

## 4. Padrão Recomendado para Cada Tipo de Operação

### 4.1 Operação: Listar (GET /api/recurso)

```java
public List<RecursoDTO> findAll() {
    if (authorizationHelper.isAdmin()) {
        // ADMIN vê tudo
        return repository.findAll().stream()
                .map(Mapper::toDTO)
                .toList();
    }
    
    if (authorizationHelper.isTeacher()) {
        // TEACHER vê apenas O DELE
        Long teacherId = authorizationHelper.getCurrentTeacherId();
        return repository.findByTeacherId(teacherId).stream()
                .map(Mapper::toDTO)
                .toList();
    }
    
    if (authorizationHelper.isStudent()) {
        // STUDENT vê apenas O DELE
        Long studentId = authorizationHelper.getCurrentStudentId();
        return repository.findByStudentId(studentId).stream()
                .map(Mapper::toDTO)
                .toList();
    }
    
    return List.of();
}
```

### 4.2 Operação: Obter Detalhe (GET /api/recurso/{id})

```java
public RecursoDTO findById(Long id) {
    Recurso recurso = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Recurso", id));
    
    // Verificar se pode acessar
    if (!authorizationHelper.isAdmin()) {
        if (authorizationHelper.isTeacher()) {
            Long teacherId = authorizationHelper.getCurrentTeacherId();
            if (!recurso.getTeacher().getId().equals(teacherId)) {
                throw new RuntimeException("Access denied");
            }
        } else if (authorizationHelper.isStudent()) {
            Long studentId = authorizationHelper.getCurrentStudentId();
            if (!recurso.getStudent().getId().equals(studentId)) {
                throw new RuntimeException("Access denied");
            }
        }
    }
    
    return Mapper.toDTO(recurso);
}
```

### 4.3 Operação: Criar (POST /api/recurso)

```java
public RecursoDTO create(RecursoDTO dto) {
    // Apenas ADMIN pode criar
    if (!authorizationHelper.isAdmin()) {
        throw new RuntimeException("Only admins can create resources");
    }
    
    // ... resto da lógica
}
```

### 4.4 Operação: Atualizar (PUT /api/recurso/{id})

```java
public RecursoDTO update(Long id, RecursoDTO dto) {
    Recurso recurso = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Recurso", id));
    
    // ADMIN sempre pode | TEACHER/Student só o dele
    if (!authorizationHelper.isAdmin()) {
        if (authorizationHelper.isTeacher()) {
            Long teacherId = authorizationHelper.getCurrentTeacherId();
            if (!recurso.getTeacher().getId().equals(teacherId)) {
                throw new RuntimeException("You can only update your own resources");
            }
        } else {
            throw new RuntimeException("Access denied");
        }
    }
    
    // ... atualizar campos
    return Mapper.toDTO(repository.save(recurso));
}
```

### 4.5 Operação: Deletar (DELETE /api/recurso/{id})

```java
public void delete(Long id) {
    Recurso recurso = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Recurso", id));
    
    // Apenas ADMIN
    if (!authorizationHelper.isAdmin()) {
        throw new RuntimeException("Only admins can delete resources");
    }
    
    repository.deleteById(id);
}
```

## 5. Exemplo Completo: SubjectService

```java
@Service
@RequiredArgsConstructor
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final TeacherRepository teacherRepository;
    private final AuthorizationHelper authorizationHelper;

    // CREATE - Apenas ADMIN (não implementado neste exemplo)
    
    public List<SubjectDTO> findAll() {
        if (authorizationHelper.isAdmin()) {
            return subjectRepository.findAll().stream()
                    .map(SubjectMapper::toDTO)
                    .toList();
        }
        
        if (authorizationHelper.isTeacher()) {
            Long teacherId = authorizationHelper.getCurrentTeacherId();
            return subjectRepository.findByTeacherId(teacherId).stream()
                    .map(SubjectMapper::toDTO)
                    .toList();
        }
        
        if (authorizationHelper.isStudent()) {
            Long studentId = authorizationHelper.getCurrentStudentId();
            return subjectRepository.findAll().stream()
                    .filter(subject -> subject.getEnrollments().stream()
                            .anyMatch(enrollment -> 
                                enrollment.getStudent().getId().equals(studentId)))
                    .map(SubjectMapper::toDTO)
                    .toList();
        }
        
        return List.of();
    }
    
    public SubjectDTO findById(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject", id));

        if (!authorizationHelper.isAdmin()) {
            if (authorizationHelper.isTeacher()) {
                Long teacherId = authorizationHelper.getCurrentTeacherId();
                if (!subject.getTeacher().getId().equals(teacherId)) {
                    throw new RuntimeException("Access denied");
                }
            } else if (authorizationHelper.isStudent()) {
                Long studentId = authorizationHelper.getCurrentStudentId();
                boolean hasEnrollment = subject.getEnrollments().stream()
                        .anyMatch(e -> e.getStudent().getId().equals(studentId));
                if (!hasEnrollment) {
                    throw new RuntimeException("Access denied");
                }
            }
        }

        return SubjectMapper.toDTO(subject);
    }
    
    public SubjectDTO update(Long id, SubjectDTO dto) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject", id));

        if (!authorizationHelper.isAdmin()) {
            if (authorizationHelper.isTeacher()) {
                Long teacherId = authorizationHelper.getCurrentTeacherId();
                if (!subject.getTeacher().getId().equals(teacherId)) {
                    throw new RuntimeException("Can only update own subjects");
                }
            } else {
                throw new RuntimeException("Access denied");
            }
        }

        Teacher teacher = teacherRepository.findById(dto.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", dto.getTeacherId()));

        subject.setName(dto.getName());
        subject.setDescription(dto.getDescription());
        subject.setTeacher(teacher);

        return SubjectMapper.toDTO(subjectRepository.save(subject));
    }
    
    public void delete(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject", id));

        if (!authorizationHelper.isAdmin()) {
            throw new RuntimeException("Only admins can delete subjects");
        }

        subjectRepository.deleteById(id);
    }
}
```

## 6. Testando a Implementação

### 6.1 Setup: Criar dados de teste

```sql
-- ADMIN User
INSERT INTO users (email, password, name) 
VALUES ('admin@school.com', '$2a$...(hashed)', 'Admin User');

-- TEACHER User
INSERT INTO teachers (id, name, email, cpf, phone, specialty) 
VALUES (1, 'Prof João', 'joao@school.com', '123.456.789-00', '11999999', 'Math');

INSERT INTO users (email, password, name, teacher_id) 
VALUES ('joao@school.com', '$2a$...(hashed)', 'Prof João', 1);

-- STUDENT User
INSERT INTO students (id, name, email, cpf, phone, birth_date) 
VALUES (1, 'Ana Silva', 'ana@school.com', '987.654.321-00', '11888888', '2005-03-15');

INSERT INTO users (email, password, name, student_id) 
VALUES ('ana@school.com', '$2a$...(hashed)', 'Ana Silva', 1);
```

### 6.2 Teste: Como ADMIN

```bash
# Login como ADMIN
POST http://localhost:8080/api/auth/login
Content-Type: application/json
{
  "email": "admin@school.com",
  "password": "admin123"
}

RESPONSE:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "email": "admin@school.com", "roles": ["ADMIN"] }
}

# Listar disciplinas
GET http://localhost:8080/api/subjects
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

RESPONSE (200 OK):
[
  { "id": 1, "name": "Math", "teacher": { "id": 1, "name": "Prof João" } },
  { "id": 2, "name": "Physics", "teacher": { "id": 2, "name": "Prof Maria" } },
  { "id": 3, "name": "English", "teacher": { "id": 3, "name": "Prof Carlos" } }
]
```

### 6.3 Teste: Como TEACHER

```bash
# Login como TEACHER
POST http://localhost:8080/api/auth/login
Content-Type: application/json
{
  "email": "joao@school.com",
  "password": "joao123"
}

RESPONSE:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "email": "joao@school.com", "roles": ["TEACHER"] }
}

# Listar disciplinas
GET http://localhost:8080/api/subjects
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

RESPONSE (200 OK):
[
  { "id": 1, "name": "Math", "teacher": { "id": 1, "name": "Prof João" } }
]
# Nota: Apenas Math (Professor João) aparece

# Tentar acessar disciplina de outro professor
GET http://localhost:8080/api/subjects/2  (Physics - Prof Maria)
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

RESPONSE (403 Forbidden):
{
  "error": "Access denied: Subject does not belong to your account"
}
```

### 6.4 Teste: Como STUDENT

```bash
# Login como STUDENT
POST http://localhost:8080/api/auth/login
Content-Type: application/json
{
  "email": "ana@school.com",
  "password": "ana123"
}

# Listar disciplinas
GET http://localhost:8080/api/subjects
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

RESPONSE (200 OK):
[
  { "id": 1, "name": "Math", "teacher": { "id": 1, "name": "Prof João" } }
]
# Nota: Apenas disciplinas em que Ana está matriculada

# Listar notas
GET http://localhost:8080/api/grades
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

RESPONSE (200 OK):
[
  { "id": 1, "exam1": 8.5, "exam2": 9.0, "finalExam": 8.7, "average": 8.73 },
  { "id": 2, "exam1": 7.0, "exam2": 7.5, "finalExam": 7.2, "average": 7.23 }
]
# Nota: Apenas notas de Ana
```

## 7. Tratamento de Erros

### Erros Esperados

```java
// RuntimeException com mensagem clara:
throw new RuntimeException("Access denied: You are not enrolled in this subject");
throw new RuntimeException("Access denied: Subject does not belong to your account");
throw new RuntimeException("Access denied: Only teachers and admins can update grades");
throw new RuntimeException("Access denied: You can only view your own data");

// Exception Handler (recomendado no ControllerAdvice):
@ExceptionHandler(RuntimeException.class)
public ResponseEntity<ApiError> handleRuntimeException(
        RuntimeException ex) {
    return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(new ApiError(
                "Access Denied",
                ex.getMessage(),
                HttpStatus.FORBIDDEN.value()
            ));
}
```

## 8. Teacher Restrictions (Restrições do Professor)

### 8.1 O que Professores NÃO podem fazer

Teachers are restricted from performing dangerous operations:

```java
// ✗ PROHIBIDO: Teacher CANNOT delete students
DELETE /api/students/{id}
→ HTTP 403 Forbidden (Security Layer)
→ Only ADMIN role allowed

// ✗ PROHIBIDO: Teacher CANNOT delete subjects
DELETE /api/subjects/{id}
→ HTTP 403 Forbidden (Security Layer)  
→ Only ADMIN role allowed
```

### 8.2 Implementação

**SecurityConfig.java**:
```java
.requestMatchers(HttpMethod.DELETE, "/api/students/**").hasRole("ADMIN")
.requestMatchers(HttpMethod.DELETE, "/api/subjects/**").hasRole("ADMIN")
```

**SubjectService.java**:
```java
public void delete(Long id) {
    Subject subject = subjectRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Subject", id));

    // Apenas ADMIN pode deletar disciplinas
    if (!authorizationHelper.isAdmin()) {
        throw new RuntimeException("Access denied: Only admins can delete subjects");
    }

    subjectRepository.deleteById(id);
}
```

### 8.3 Testes esperados

```bash
# Como TEACHER: Tentar deletar aluno
DELETE http://localhost:8080/api/students/1
Authorization: Bearer <TEACHER_TOKEN>

RESPONSE (403 Forbidden):
{
  "error": "Access Denied",
  "message": "Access denied"
}

# Como TEACHER: Tentar deletar disciplina  
DELETE http://localhost:8080/api/subjects/1
Authorization: Bearer <TEACHER_TOKEN>

RESPONSE (403 Forbidden):
{
  "error": "Access Denied", 
  "message": "Access denied"
}

# Como ADMIN: Deletar aluno (PERMITIDO)
DELETE http://localhost:8080/api/students/1
Authorization: Bearer <ADMIN_TOKEN>

RESPONSE (204 No Content)
```

## 9. Checklist de Implementação

- [x] SecurityUtils criado e configurado
- [x] AuthorizationHelper criado e injetável
- [x] SubjectService com RBAC
- [x] EnrollmentService com RBAC
- [x] GradeService com RBAC
- [x] SchoolClassService com RBAC
- [x] StudentService com RBAC
- [x] TeacherService com RBAC
- [x] Repositories com novos métodos
- [x] Projeto compila sem erros
- [x] Teacher delete restrictions implementadas
- [x] Class-based grade entry endpoints criados
- [x] Frontend hooks para grade entry criados
- [x] GradeForm.tsx refatorizado com selects
- [ ] Testes unitários criados
- [ ] Testes de integração criados
- [x] Dokumentação atualizada
