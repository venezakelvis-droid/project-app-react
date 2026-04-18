# 📚 PROJECT.md - Documentação Técnica Completa

**School Buddy - Sistema de Gestão Escolar**
**Última atualização:** Abril 2026
**Objetivo:** Documentação para desenvolvimento, manutenção e migração futura

---

## 📑 Índice

1. [Visão Geral do Sistema](#visão-geral-do-sistema)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitetura Geral](#arquitetura-geral)
4. [Backend - Spring Boot](#backend---spring-boot)
5. [Frontend - React/TypeScript](#frontend---reacttypescript)
6. [Integração Front ↔ Back](#integração-front--back)
7. [Fluxo de Dados](#fluxo-de-dados)
8. [Guia de Manutenção e Migração](#guia-de-manutenção-e-migração)
9. [Decisões de Design](#decisões-de-design)

---

## 🎯 Visão Geral do Sistema

### Informações Gerais

| Item | Valor |
|------|-------|
| **Nome do Projeto** | School Buddy |
| **Descrição** | Sistema de gestão escolar com funcionalidades de matrícula, notas (8 por disciplina), frequência, disciplinas e relatórios |
| **Versão Backend** | 1.0 (Spring Boot 3.5.13) |
| **Versão Frontend** | 1.0 (React 18.3.1) |
| **Banco de Dados** | H2 Database (em memória) |

### Objetivo do Projeto

- Gerenciar alunos, professores, disciplinas e matrículas
- Registrar notas e gerar relatórios de desempenho
- Controlar frequência e turmas
- Criar dashboards personalizados por role (Admin, Professor, Aluno)
- Implementar autenticação segura com JWT

### Stakeholders

- **Administradores**: Gerenciam usuários, turmas e relatórios
- **Professores**: Gerem disciplinas, turmas e notas
- **Alunos**: Acessam próprias notas e informações de matrícula

---

## 🛠️ Stack Tecnológico

### Frontend

```
┌─────────────────────────────────────┐
│         Frontend Stack               │
├─────────────────────────────────────┤
│ Framework: React 18.3.1             │
│ Linguagem: TypeScript 5.6.3         │
│ Build Tool: Vite                    │
│ Router: React Router v6.30.1        │
│ Http Client: Axios 1.15.0           │
│ State Mgmt: Context API + TanStack  │
│ Form: React Hook Form 7.61.1 + Zod │
│ UI Framework: shadcn/ui (Radix UI)  │
│ Styling: Tailwind CSS 3.4.2         │
│ Testing: Vitest                     │
│ Package Manager: Bun                │
└─────────────────────────────────────┘
```

**Dependências Principais:**
- `react-router-dom` (6.30.1) - Roteamento SPA
- `axios` (1.15.0) - Cliente HTTP
- `@tanstack/react-query` (5.83.0) - Gerenciamento de server state
- `react-hook-form` (7.61.1) - Gerenciamento de formulários
- `zod` (3.25.76) - Validação de schemas
- `tailwindcss` (3.4.2) - Framework de CSS
- 40+ componentes shadcn/ui (UI reutilizáveis)

### Backend

```
┌─────────────────────────────────────┐
│      Backend Stack                  │
├─────────────────────────────────────┤
│ Framework: Spring Boot 3.5.13       │
│ Linguagem: Java 25                  │
│ Build Tool: Maven                   │
│ ORM: Spring Data JPA (Hibernate)    │
│ Security: Spring Security + JWT     │
│ Database: H2 Database (em memória)  │
│ HTTP: Spring Web (RESTful)          │
│ Validation: Jakarta Validation      │
│ Lombok: 1.18.30 (Annotations)       │
│ JWT Library: JJWT 0.11.5            │
│ Container: Tomcat (embedded)        │
└─────────────────────────────────────┘
```

**Dependências Principais:**
- `spring-boot-starter-web` - REST API
- `spring-boot-starter-data-jpa` - Persistência
- `spring-boot-starter-security` - Autenticação/Autorização
- `spring-boot-starter-validation` - Validação
- `h2` - Banco de dados em memória
- `lombok` - Redução de boilerplate
- `jjwt` (0.11.5) - Gerenciamento de JWT

---

## 🏗️ Arquitetura Geral

### Padrão Arquitetural

O projeto segue uma **arquitetura em camadas** com separação clara de responsabilidades:

```
┌────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                     │
│  Pages → Components → Hooks → Services → API Client     │
└────────────────────────────────────────────────────────┘
                           ↕
                    (HTTP/REST + JWT)
                           ↕
┌────────────────────────────────────────────────────────┐
│                 BACKEND (Spring Boot)                   │
│  Controllers → Services → Repositories → Database       │
│       ↓            ↓             ↓                      │
│      DTOs       Business     Data Access                │
│    (Mappers)    Logic        (JPA)                      │
└────────────────────────────────────────────────────────┘
```

### Camadas do Projeto

#### Frontend - Camadas da Aplicação

```
src/
├── pages/           → ScreenComponents (com lógica de negócio)
├── components/      → ReusableComponents (sem lógica complexa)
├── services/        → API Layer (axios calls)
├── hooks/           → Custom Hooks (state management)
├── auth/            → Context API (autenticação)
├── types/           → TypeScript interfaces
└── lib/utils/       → Funções utilitárias
```

#### Backend - Camadas da Aplicação

```
domain/
├── entities/        → Business Models (JPA Entities)
└── exceptions/      → Custom Exceptions

application/
├── services/        → Business Logic (TransactionService)
├── dtos/            → Data Transfer Objects (API Contracts)
└── mappers/         → Entity ↔ DTO Conversions

controllers/         → REST Endpoints (@RestController)

infrastructure/
├── repositories/    → Data Access (Spring Data JPA)
├── security/        → JWT + Spring Security
└── configs/         → Application Configuration
```

### Fluxo de Requisição End-to-End

```
┌─────────────────────────────────────────────────────────┐
│                 FRONTEND (React)                        │
│ 1. User Action (click) → Page/Component                 │
│ 2. Hook (useStudents) triggered                         │
│ 3. Service called (studentService.getAll())             │
│ 4. Axios request + JWT token in header                  │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP Request
                   │ GET /api/students
                   │ Authorization: Bearer {JWT}
                   ↓
┌─────────────────────────────────────────────────────────┐
│                BACKEND (Spring Boot)                    │
│ 1. JwtAuthenticationFilter validates token              │
│ 2. Request routed to StudentController.findAll()        │
│ 3. Controller calls StudentService.findAll()            │
│ 4. Service calls StudentRepository.findAll()            │
│ 5. JPA fetches Entities from Database                   │
│ 6. Service returns StudentDTO[] após mapeamento         │
│ 7. Controller wraps DTOs em ResponseEntity              │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP Response
                   │ 200 OK + JSON Array
                   ↓
┌─────────────────────────────────────────────────────────┐
│                 FRONTEND (React)                        │
│ 1. Response received by Axios                           │
│ 2. Hook updates state (React Query cache)               │
│ 3. Component re-renders with new data                   │
│ 4. DOM updated                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Backend - Spring Boot

### Estrutura de Pastas

```
demo/
└── src/main/java/school_app/project/demo/
    ├── DemoApplication.java          (Main Entry Point)
    ├── application/
    │   ├── dtos/                     (Data Transfer Objects)
    │   │   ├── StudentDTO.java
    │   │   ├── TeacherDTO.java
    │   │   ├── SubjectDTO.java
    │   │   ├── EnrollmentDTO.java
    │   │   ├── GradeDTO.java
    │   │   ├── SchoolClassDTO.java
    │   │   ├── UserDTO.java
    │   │   ├── LoginRequest.java
    │   │   └── LoginResponse.java
    │   ├── services/                 (Business Logic)
    │   │   ├── StudentService.java
    │   │   ├── TeacherService.java
    │   │   ├── SubjectService.java
    │   │   ├── EnrollmentService.java
    │   │   ├── GradeService.java
    │   │   ├── SchoolClassService.java
    │   │   └── UserService.java
    │   └── mappers/                  (DTO Conversions)
    │       ├── StudentMapper.java
    │       ├── TeacherMapper.java
    │       ├── SubjectMapper.java
    │       ├── EnrollmentMapper.java
    │       ├── GradeMapper.java
    │       ├── SchoolClassMapper.java
    │       └── UserMapper.java
    ├── controllers/                  (REST Endpoints)
    │   ├── AuthController.java
    │   ├── StudentController.java
    │   ├── TeacherController.java
    │   ├── SubjectController.java
    │   ├── EnrollmentController.java
    │   ├── GradeController.java
    │   ├── SchoolClassController.java
    │   └── UserController.java
    ├── domain/
    │   ├── entities/                 (JPA Entities)
    │   │   ├── User.java
    │   │   ├── Role.java
    │   │   ├── Student.java
    │   │   ├── Teacher.java
    │   │   ├── Subject.java
    │   │   ├── Enrollment.java
    │   │   ├── Grade.java
    │   │   ├── SchoolClass.java
    │   │   └── Attendance.java
    │   └── exceptions/               (Custom Exceptions)
    │       ├── BusinessException.java
    │       ├── ResourceNotFoundException.java
    │       ├── StudentAlreadyExistsException.java
    │       ├── EnrollmentAlreadyExistsException.java
    │       ├── GradeInvalidException.java
    │       └── GlobalExceptionHandler.java
    └── infrastructure/
        ├── configs/                  (Configuration)
        │   ├── SecurityConfig.java
        │   └── CorsConfig.java
        ├── security/                 (JWT & Spring Security)
        │   ├── JwtUtils.java
        │   ├── JwtAuthenticationFilter.java
        │   └── CustomUserDetailsService.java
        └── repositories/             (Data Access - JPA)
            ├── UserRepository.java
            ├── StudentRepository.java
            ├── TeacherRepository.java
            ├── SubjectRepository.java
            ├── EnrollmentRepository.java
            ├── GradeRepository.java
            ├── SchoolClassRepository.java
            └── RoleRepository.java
```

### Entidades (Domain Models)

#### 1. **User.java** (Usuário)
```java
Relacionamentos:
- One-to-One Student    (usuario → aluno)
- One-to-One Teacher    (usuario → professor)
- Many-to-Many Role     (usuarios ↔ roles)

Campos:
- id (Long, PK)
- name (String)
- email (String, unique, not null)
- password (String, encrypted, not null)
- roles (Set<Role>, @ManyToMany)
- student (Student, @OneToOne optional)
- teacher (Teacher, @OneToOne optional)

Regra de Negócio:
- Um usuário pode ser apenas aluno OU professor OU admin (não ambos)
- Email é único (índice de banco)
- Senha é criptografada com BCrypt
```

#### 2. **Role.java** (Papel/Função)
```java
Relacionamentos:
- Many-to-Many User (roles ↔ usuarios)

Campos:
- id (Long, PK)
- name (String, unique, not null) → ROLE_ADMIN, ROLE_TEACHER, ROLE_STUDENT

Regra de Negócio:
- 3 roles existem: ADMIN, TEACHER, STUDENT
- Um usuário pode ter múltiplos roles (admin + teacher, por ex)
```

#### 3. **Student.java** (Aluno)
```java
Relacionamentos:
- One-to-Many Enrollment (aluno → múltiplas matriculas)
- One-to-One User (aluno → usuario)

Campos:
- id (Long, PK)
- name (String)
- birthDate (LocalDate)
- cpf (String, unique, not null)
- email (String)
- phone (String)
- enrollmentNumber (String, unique)
- enrollmentDate (LocalDate)
- status (String) → ACTIVE, INACTIVE, SUSPENDED
- enrollments (List<Enrollment>, @OneToMany cascade)

Regra de Negócio:
- CPF é único (validação de duplicata)
- Status controla participação em turmas
- Enrollment date é preenchida automaticamente ao criar
- Um aluno pode estar matriculado em múltiplas disciplinas
```

#### 4. **Teacher.java** (Professor)
```java
Relacionamentos:
- One-to-Many Subject (professor → múltiplas disciplinas)
- One-to-One User (professor → usuario)

Campos:
- id (Long, PK)
- name (String)
- cpf (String, unique, not null)
- email (String)
- phone (String)
- specialty (String) → Matemática, Português, etc
- hireDate (LocalDate)
- subjects (List<Subject>, @OneToMany)

Regra de Negócio:
- CPF é único
- Um professor pode ter múltiplas disciplinas
- Specialty indica área de atuação
```

#### 5. **Subject.java** (Disciplina)
```java
Relacionamentos:
- Many-to-One Teacher (@ManyToOne, not null)
- One-to-Many Enrollment (disciplina → múltiplas matriculas)

Campos:
- id (Long, PK)
- name (String)
- workloadHours (Integer) → Horas da disciplina (60, 80, etc)
- description (String)
- teacher (Teacher)
- enrollments (List<Enrollment>, @OneToMany)

Regra de Negócio:
- Uma disciplina tem exactamente um professor
- Carga horária é definida
- Múltiplos alunos podem se matricular na mesma disciplina
```

#### 6. **Enrollment.java** (Matrícula)
```java
Relacionamentos:
- Many-to-One Student (@ManyToOne)
- Many-to-One Subject (@ManyToOne)
- Many-to-One SchoolClass (@ManyToOne)
- One-to-Many Grade (matricula → múltiplas notas)

Campos:
- id (Long, PK)
- enrollmentDate (LocalDate)
- status (String) → ACTIVE, COMPLETED, DROPPED, FAILED
- student (Student)
- subject (Subject)
- schoolClass (SchoolClass)
- grades (List<Grade>, @OneToMany cascade)

Regra de Negócio:
- Uma matrícula é a ligação entre aluno + disciplina + turma
- Uma matrícula não pode ser duplicada (mesmo aluno + disciplina)
- Status controla o ciclo de vida da matrícula
- Ao deletar matrícula, notas são deletadas em cascata
```

#### 7. **Grade.java** (Nota - Padrão Brasileiro)
```java
Relacionamentos:
- Many-to-One Enrollment (@ManyToOne)

Campos:
- id (Long, PK)
- note1Semester1 (Double) → 0-10
- note2Semester1 (Double) → 0-10
- note3Semester1 (Double) → 0-10
- note4Semester1 (Double) → 0-10
- note1Semester2 (Double) → 0-10
- note2Semester2 (Double) → 0-10
- note3Semester2 (Double) → 0-10
- note4Semester2 (Double) → 0-10
- averageSemester1 (Double) → Média S1 calculada
- averageSemester2 (Double) → Média S2 calculada
- finalAverage (Double) → Média final calculada
- status (String) → APROVADO (>=7), RECUPERAÇÃO (5-6.9), REPROVADO (<5)
- enrollment (Enrollment)

Regra de Negócio:
- 8 notas: 4 por semestre (padrão brasileiro)
- Average S1 = (n1S1 + n2S1 + n3S1 + n4S1) / 4
- Average S2 = (n1S2 + n2S2 + n3S2 + n4S2) / 4
- Final Average = (averageS1 + averageS2) / 2
- Status baseado na média final
- Apenas ADMIN e TEACHER podem criar/atualizar
```

#### 8. **SchoolClass.java** (Turma)
```java
Relacionamentos:
- One-to-Many Enrollment (turma → múltiplas matriculas)

Campos:
- id (Long, PK)
- name (String) → 1º Ano A, 2º Ano B, etc
- schoolYear (Integer) → 2026, 2027, etc
- semester (Integer) → 1 ou 2
- room (String) → Sala 101, etc
- shift (String) → MORNING, AFTERNOON, EVENING
- enrollments (List<Enrollment>, @OneToMany cascade)

Regra de Negócio:
- Uma turma é um agrupamento de alunos
- Shift define período (manhã, tarde, noite)
- Ao deletar turma, matriculas são deletadas em cascata
```

#### 9. **Attendance.java** (Frequência)
```java
Relacionamentos:
- Many-to-One Enrollment (@ManyToOne)

Campos:
- id (Long, PK)
- semester (Integer) → 1 ou 2
- totalClasses (Integer) → Total de aulas no semestre
- absences (Integer) → Número de faltas
- justifiedAbsences (Integer) → Faltas justificadas
- delays (Integer) → Número de atrasos
- presencePercentage (Double) → Percentual calculado
- enrollment (Enrollment)

Regra de Negócio:
- Controle por semestre e matéria
- Percentual = ((totalClasses - (absences - justifiedAbsences)) / totalClasses) * 100
- Faltas justificadas não contam contra o percentual
- Apenas ADMIN e TEACHER podem criar/atualizar
```

### Controllers

#### AuthController
```java
@RestController
@RequestMapping("/api/auth")

POST /api/auth/login
  Body: LoginRequest(email, password)
  Response: LoginResponse(token: String, role: String, name: String)
  Responsabilidade: Autenticar usuário e gerar JWT token
```

#### StudentController
```java
@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor

POST /api/students
  Body: StudentDTO
  Response: 201 Created + StudentDTO
  Responsabilidade: Criar novo aluno
  Auth: ROLE_ADMIN

GET /api/students
  Response: 200 OK + List<StudentDTO>
  Responsabilidade: Listar todos alunos
  Auth: ROLE_ADMIN, ROLE_TEACHER

GET /api/students/{id}
  Response: 200 OK + StudentDTO
  Responsabilidade: Buscar aluno específico
  Auth: ROLE_ADMIN, ROLE_TEACHER, ROLE_STUDENT (próprio aluno)
  Nota: STUDENT pode acessar apenas seus próprios dados

PUT /api/students/{id}
  Body: StudentDTO
  Response: 200 OK + StudentDTO
  Responsabilidade: Atualizar aluno completo

PATCH /api/students/{id}
  Body: StudentDTO (parcial)
  Response: 200 OK + StudentDTO
  Responsabilidade: Atualizar aluno parcialmente

DELETE /api/students/{id}
  Response: 204 No Content
  Responsabilidade: Deletar aluno
  Auth: ROLE_ADMIN
```

#### TeacherController
```java
@RestController
@RequestMapping("/api/teachers")

POST /api/teachers
  Body: TeacherDTO
  Response: 201 Created + TeacherDTO
  Auth: ROLE_ADMIN

GET /api/teachers
  Response: 200 OK + List<TeacherDTO>
  Auth: ROLE_ADMIN, ROLE_TEACHER

GET /api/teachers/{id}
  Response: 200 OK + TeacherDTO

PUT /api/teachers/{id}
  Body: TeacherDTO
  Response: 200 OK + TeacherDTO

PATCH /api/teachers/{id}
  Body: TeacherDTO (parcial)
  Response: 200 OK + TeacherDTO

DELETE /api/teachers/{id}
  Response: 204 No Content
  Auth: ROLE_ADMIN
```

#### SubjectController
```java
@RestController
@RequestMapping("/api/subjects")

POST /api/subjects
  Body: SubjectDTO(name, workloadHours, description, teacherId)
  Response: 201 Created + SubjectDTO
  Auth: ROLE_ADMIN, ROLE_TEACHER
  Validação: teacherId deve existir

GET /api/subjects
  Response: 200 OK + List<SubjectDTO>

GET /api/subjects/{id}
  Response: 200 OK + SubjectDTO

GET /api/subjects/teacher
  Response: 200 OK + List<SubjectDTO>
  Auth: ROLE_ADMIN, ROLE_TEACHER
  Nota: Retorna apenas disciplinas do professor autenticado

PUT /api/subjects/{id}
  Body: SubjectDTO
  Response: 200 OK + SubjectDTO

PATCH /api/subjects/{id}
  Body: SubjectDTO (parcial)
  Response: 200 OK + SubjectDTO

DELETE /api/subjects/{id}
  Response: 204 No Content
  Auth: ROLE_ADMIN
```

#### EnrollmentController
```java
@RestController
@RequestMapping("/api/enrollments")

POST /api/enrollments
  Body: EnrollmentDTO(studentId, subjectId, schoolClassId)
  Response: 201 Created + EnrollmentDTO
  Auth: ROLE_ADMIN, ROLE_TEACHER
  Validação: 
    - studentId, subjectId, schoolClassId devem existir
    - Não pode haver matrícula duplicada (mesmo aluno + disciplina)

GET /api/enrollments
  Response: 200 OK + List<EnrollmentDTO>

GET /api/enrollments/{id}
  Response: 200 OK + EnrollmentDTO

GET /api/enrollments/student
  Response: 200 OK + List<EnrollmentDTO>
  Auth: ROLE_ADMIN, ROLE_STUDENT
  Nota: Retorna apenas matrículas do aluno autenticado

PUT /api/enrollments/{id}
  Body: EnrollmentDTO
  Response: 200 OK + EnrollmentDTO

PATCH /api/enrollments/{id}
  Body: EnrollmentDTO (parcial)
  Response: 200 OK + EnrollmentDTO

DELETE /api/enrollments/{id}
  Response: 204 No Content
  Auth: ROLE_ADMIN
```

#### GradeController
```java
@RestController
@RequestMapping("/api/grades")

POST /api/grades
  Body: GradeDTO(exam1, exam2, finalExam, enrollmentId)
  Response: 201 Created + GradeDTO
  Auth: ROLE_ADMIN, ROLE_TEACHER
  Validação:
    - Todas notas devem estar entre 0-10
    - enrollmentId deve existir

GET /api/grades
  Response: 200 OK + List<GradeDTO>

GET /api/grades/{id}
  Response: 200 OK + GradeDTO

GET /api/grades/student
  Response: 200 OK + List<GradeDTO>
  Auth: ROLE_ADMIN, ROLE_STUDENT
  Nota: Retorna notas do aluno autenticado

PUT /api/grades/{id}
  Body: GradeDTO
  Response: 200 OK + GradeDTO
  Nota: Recalcula average e status

PATCH /api/grades/{id}
  Body: GradeDTO (parcial, apenas exames válidos)
  Response: 200 OK + GradeDTO
  Nota: Recalcula average apenas se notas forem alteradas

DELETE /api/grades/{id}
  Response: 204 No Content
  Auth: ROLE_ADMIN
```

#### AttendanceController
```java
@RestController
@RequestMapping("/api/attendance")

POST /api/attendance
  Body: AttendanceDTO(semester, totalClasses, absences, justifiedAbsences, delays, enrollmentId)
  Response: 201 Created + AttendanceDTO
  Auth: ROLE_ADMIN, ROLE_TEACHER
  Validação:
    - semester deve ser 1 ou 2
    - totalClasses > 0
    - absences, justifiedAbsences, delays >= 0
    - justifiedAbsences <= absences

GET /api/attendance
  Response: 200 OK + List<AttendanceDTO>
  Auth: Filtrado por role (ADMIN=todos, TEACHER=suas matérias, STUDENT=próprias)

GET /api/attendance/{id}
  Response: 200 OK + AttendanceDTO

GET /api/attendance/student
  Response: 200 OK + List<AttendanceDTO>
  Auth: ROLE_STUDENT
  Nota: Retorna frequência do aluno autenticado

GET /api/attendance/enrollment/{enrollmentId}
  Response: 200 OK + List<AttendanceDTO>
  Nota: Retorna frequência de uma matrícula específica

PUT /api/attendance/{id}
  Body: AttendanceDTO
  Response: 200 OK + AttendanceDTO
  Nota: Recalcula presencePercentage

PATCH /api/attendance/{id}
  Body: AttendanceDTO (parcial)
  Response: 200 OK + AttendanceDTO
  Nota: Recalcula presencePercentage apenas se valores alterados

DELETE /api/attendance/{id}
  Response: 204 No Content
  Auth: ROLE_ADMIN, ROLE_TEACHER (próprias matérias)
```

#### SchoolClassController
```java
@RestController
@RequestMapping("/api/classes")

POST /api/classes
  Body: SchoolClassDTO(name, schoolYear, semester, room, shift)
  Response: 201 Created + SchoolClassDTO
  Auth: ROLE_ADMIN

GET /api/classes
  Response: 200 OK + List<SchoolClassDTO>

GET /api/classes/{id}
  Response: 200 OK + SchoolClassDTO

PUT /api/classes/{id}
  Body: SchoolClassDTO
  Response: 200 OK + SchoolClassDTO

PATCH /api/classes/{id}
  Body: SchoolClassDTO (parcial)
  Response: 200 OK + SchoolClassDTO

DELETE /api/classes/{id}
  Response: 204 No Content
  Auth: ROLE_ADMIN
```

#### UserController
```java
@RestController
@RequestMapping("/api/users")

POST /api/users
  Body: UserDTO(name, email, password, roles)
  Response: 201 Created + UserDTO
  Auth: ROLE_ADMIN

GET /api/users
  Response: 200 OK + List<UserDTO>
  Auth: ROLE_ADMIN

GET /api/users/{id}
  Response: 200 OK + UserDTO
  Auth: ROLE_ADMIN

PUT /api/users/{id}
  Body: UserDTO
  Response: 200 OK + UserDTO

PATCH /api/users/{id}
  Body: UserDTO (parcial)
  Response: 200 OK + UserDTO

DELETE /api/users/{id}
  Response: 204 No Content
```

### Services

#### StudentService
```java
public StudentDTO create(StudentDTO dto)
  → Valida se CPF já existe (StudentAlreadyExistsException)
  → Mapeia DTO → Entity
  → Salva no DB
  → Mapeia Entity → DTO e retorna

public StudentDTO findById(Long id)
  → Busca aluno por ID
  → Lança ResourceNotFoundException se não existir

public List<StudentDTO> findAll()
  → Busca todos alunos
  → Mapeia para lista de DTOs

public StudentDTO update(Long id, StudentDTO dto)
  → Busca por ID (ou lança exceção)
  → Atualiza todos campos
  → Salva e retorna DTO

public StudentDTO patch(Long id, StudentDTO dto)
  → Busca por ID
  → Atualiza apenas campos não-nulos
  → Salva e retorna DTO

public void delete(Long id)
  → Valida se existe
  → Deleta aluno
  → Cascata deleta também as matrículas
```

#### TeacherService
```java
public TeacherDTO create(TeacherDTO dto)
  → Mapeia DTO → Entity
  → Salva no DB
  → Retorna DTO

public TeacherDTO findById(Long id)
  → Busca por ID ou lança exceção

public List<TeacherDTO> findAll()
  → Lista todos professores

public TeacherDTO update(Long id, TeacherDTO dto)
  → Busca, atualiza campos, salva

public TeacherDTO patch(Long id, TeacherDTO dto)
  → Busca, atualiza campos não-nulos, salva

public void delete(Long id)
  → Deleta professor
```

#### SubjectService
```java
public SubjectDTO create(SubjectDTO dto)
  → Valida se teacher existe (ResourceNotFoundException)
  → Cria disciplina com professor linkado

public SubjectDTO findById(Long id)
public List<SubjectDTO> findAll()

public List<SubjectDTO> findByTeacherId(Long teacherId)
  → Busca todas disciplinas de um professor

public SubjectDTO update(Long id, SubjectDTO dto)
  → Atualiza disciplina e professor linkado

public SubjectDTO patch(Long id, SubjectDTO dto)
  → Atualização parcial

public void delete(Long id)
```

#### EnrollmentService
```java
public EnrollmentDTO enroll(EnrollmentDTO dto)
  → Valida se student, subject e schoolClass existem
  → Valida se não há matrícula duplicada (EnrollmentAlreadyExistsException)
  → Cria enrollment linkado a student + subject + class

public EnrollmentDTO findById(Long id)
public List<EnrollmentDTO> findAll()

public List<EnrollmentDTO> findByStudentId(Long studentId)
  → Busca todas matrículas de um aluno

public EnrollmentDTO update(Long id, EnrollmentDTO dto)
  → Atualiza student, subject ou class

public EnrollmentDTO patch(Long id, EnrollmentDTO dto)
  → Atualização parcial

public void delete(Long id)
  → Deleta matrícula
  → Cascata deleta também as notas
```

#### GradeService
```java
public GradeDTO create(GradeDTO dto)
  → Valida se enrollment existe
  → Valida cada nota (0-10) ou lança GradeInvalidException
  → Calcula average = (exam1 + exam2 + finalExam) / 3
  → Define status = average >= 7 ? "APPROVED" : "FAILED"
  → Salva grade

public GradeDTO findById(Long id)
public List<GradeDTO> findAll()

public List<GradeDTO> findByStudentId(Long studentId)
  → Busca todas notas de um aluno via enrollment.student.id

public GradeDTO update(Long id, GradeDTO dto)
  → Valida notas
  → Recalcula average e status
  → Salva

public GradeDTO patch(Long id, GradeDTO dto)
  → Atualiza apenas notas não-nulas
  → Recalcula average e status

public void delete(Long id)
```

#### SchoolClassService
```java
public SchoolClassDTO create(SchoolClassDTO dto)
public SchoolClassDTO findById(Long id)
public List<SchoolClassDTO> findAll()
public SchoolClassDTO update(Long id, SchoolClassDTO dto)
public SchoolClassDTO patch(Long id, SchoolClassDTO dto)
public void delete(Long id)
  → Cascata deleta matriculas
```

#### UserService
```java
public UserDTO create(UserDTO dto)
  → Cria usuário com password criptografada
  → Linkado a roles

public Optional<UserDTO> findByEmail(String email)
  → Busca por email (usado em autenticação)

public UserDTO findById(Long id)
public List<UserDTO> findAll()
public UserDTO update(Long id, UserDTO dto)
public UserDTO patch(Long id, UserDTO dto)
public void delete(Long id)
```

### Repositories

Todos herdam de `JpaRepository<Entity, Long>`:

```java
UserRepository
  + findByEmail(String email): Optional<User>

StudentRepository
  + existsByCpf(String cpf): boolean

TeacherRepository
  (métodos básicos herdados)

SubjectRepository
  + findByTeacherId(Long teacherId): List<Subject>

EnrollmentRepository
  + findByStudentId(Long studentId): List<Enrollment>
  + findByStudentIdAndSubjectId(Long sid, Long subid): Optional<Enrollment>

GradeRepository
  + findByEnrollmentStudentId(Long studentId): List<Grade>

SchoolClassRepository
  (métodos básicos herdados)

RoleRepository
  (métodos básicos herdados)
```

### Exceções Customizadas

```java
BusinessException extends RuntimeException
  → Base para todas exceções de negócio
  → Propriedade: String message

ResourceNotFoundException extends BusinessException
  → Lançada quando recurso não existe
  → Exemplo: "Resource Student with id 123 not found"
  → HTTP Status: 404

StudentAlreadyExistsException extends BusinessException
  → Lançada quando CPF de aluno já existe
  → Exemplo: "Student with CPF 123.456.789-00 already exists"
  → HTTP Status: 409

EnrollmentAlreadyExistsException extends BusinessException
  → Lançada quando matrícula duplicada
  → HTTP Status: 409

GradeInvalidException extends BusinessException
  → Lançada quando nota < 0 ou > 10
  → HTTP Status: 400

GlobalExceptionHandler
  @ControllerAdvice que trata todas exceções e retorna:
  {
    "status": 400/404/409,
    "error": "Error Type",
    "message": "Descrição do erro",
    "timestamp": "2026-04-13T10:30:00"
  }
```

### Segurança

#### JwtUtils.java
```java
String generateToken(String email, String role)
  → Cria token JWT assinado
  → Claims: email, role
  → Expiration: 24 horas
  → Algoritmo: HS512

String getEmailFromToken(String token)
  → Extrai email do token

String getRoleFromToken(String token)
  → Extrai role do token

boolean validateToken(String token)
  → Valida assinatura e expiração
  → Retorna true/false
```

#### JwtAuthenticationFilter
```java
Filtro que intercepta todas requisições:
1. Extrai token do header "Authorization: Bearer {token}"
2. Valida token com JwtUtils
3. Se válido: extrai email e role
4. Cria Authentication com email + role
5. Passa para próximo filtro (Spring Security)
6. Se inválido: lança exceção (401)

Endpoints públicos (bypass):
- POST /api/auth/login
```

#### CustomUserDetailsService
```java
loadUserByUsername(String email)
  → Busca User no DB por email
  → Retorna UserDetails com authorities (roles)
  → Usado na autenticação tradicional (não apenas JWT)
```

#### SecurityConfig.java
```java
@Configuration
@EnableWebSecurity

Configurações:
1. CSRF desabilitado (API REST, não formulários)
2. CORS habilitado (frontend separado)
3. Session stateless (JWT, não cookies)
4. JwtAuthenticationFilter adicionado no filter chain

Permissões por Endpoint:
- POST   /api/auth/login              → Público
- GET    /api/students/{id}           → ADMIN, TEACHER, STUDENT (próprio)
- GET    /api/students                → ADMIN, TEACHER
- GET    /api/grades/student          → ADMIN, STUDENT (próprio)
- GET    /api/enrollments/student     → ADMIN, STUDENT (próprio)
- GET    /api/subjects/teacher        → ADMIN, TEACHER (próprio)
- POST   /api/grades/**               → ADMIN, TEACHER
- POST   /api/enrollments/**          → ADMIN, TEACHER
- POST   /api/subjects/**             → ADMIN, TEACHER
- POST   /api/students/**             → ADMIN
- DELETE /api/students/**             → ADMIN
- Outros                              → Autenticado (qualquer role)
```

### Banco de Dados

#### Configuração

```properties
# application.properties
spring.datasource.url=jdbc:h2:mem:school-db
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create  # Recria schema a cada startup
spring.h2.console.enabled=true       # H2 console disponível em /h2-console
```

#### Schema (Relacionamentos)

```sql
┌─────────────────────────────────────────────┐
│                 User                        │
├─────────────────────────────────────────────┤
│ id (PK)                                     │
│ name                                        │
│ email (UNIQUE)                              │
│ password                                    │
│ student_id (FK → Student)                   │
│ teacher_id (FK → Teacher)                   │
└─────────────────────────────────────────────┘
         1 │
           ├── 0..1 ─→ Student
           │
           └── 0..1 ─→ Teacher

┌─────────────────────────────────────────────┐
│                Student                      │
├─────────────────────────────────────────────┤
│ id (PK)                                     │
│ name                                        │
│ cpf (UNIQUE)                                │
│ email                                       │
│ phone                                       │
│ birth_date                                  │
│ enrollment_number                           │
│ enrollment_date                             │
│ status                                      │
└─────────────────────────────────────────────┘
         1 │
           └── * ─→ Enrollment

┌─────────────────────────────────────────────┐
│                Teacher                      │
├─────────────────────────────────────────────┤
│ id (PK)                                     │
│ name                                        │
│ cpf (UNIQUE)                                │
│ email                                       │
│ phone                                       │
│ specialty                                   │
│ hire_date                                   │
└─────────────────────────────────────────────┘
         1 │
           └── * ─→ Subject

┌─────────────────────────────────────────────┐
│                Subject                      │
├─────────────────────────────────────────────┤
│ id (PK)                                     │
│ name                                        │
│ description                                 │
│ workload_hours                              │
│ teacher_id (FK → Teacher)                   │
└─────────────────────────────────────────────┘
         1 │
           └── * ─→ Enrollment

┌─────────────────────────────────────────────┐
│               Enrollment                    │
├─────────────────────────────────────────────┤
│ id (PK)                                     │
│ enrollment_date                             │
│ status                                      │
│ student_id (FK → Student)                   │
│ subject_id (FK → Subject)                   │
│ school_class_id (FK → SchoolClass)          │
└─────────────────────────────────────────────┘
         1 │
           └── * ─→ Grade

┌─────────────────────────────────────────────┐
│                 Grade                       │
├─────────────────────────────────────────────┤
│ id (PK)                                     │
│ exam1                                       │
│ exam2                                       │
│ final_exam                                  │
│ average                                     │
│ status                                      │
│ enrollment_id (FK → Enrollment)             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│             SchoolClass                     │
├─────────────────────────────────────────────┤
│ id (PK)                                     │
│ name                                        │
│ school_year                                 │
│ semester                                    │
│ room                                        │
│ shift                                       │
└─────────────────────────────────────────────┘
         1 │
           └── * ─→ Enrollment

Tabela de Junção: users_roles
┌─────────────────────────────────────────────┐
│            users_roles                      │
├─────────────────────────────────────────────┤
│ user_id (FK → User)                         │
│ role_id (FK → Role)                         │
│ PK: (user_id, role_id)                      │
└─────────────────────────────────────────────┘
```

---

## 💻 Frontend - React/TypeScript

### Estrutura de Pastas

```
src/
├── pages/                           (Screen Components)
│   ├── Index.tsx                    (Landing/Home)
│   ├── LoginPage.tsx                (Login)
│   ├── NotFound.tsx                 (404)
│   ├── dashboards/
│   │   ├── AdminDashboard.tsx       (Admin Dashboard)
│   │   ├── StudentDashboard.tsx     (Student Dashboard)
│   │   └── TeacherDashboard.tsx     (Teacher Dashboard)
│   ├── students/
│   │   ├── index.tsx                (List Students)
│   │   └── create.tsx               (Create Student)
│   ├── teachers/
│   │   ├── index.tsx                (List Teachers)
│   │   └── create.tsx               (Create Teacher)
│   ├── subjects/
│   │   ├── index.tsx                (List Subjects)
│   │   └── create.tsx               (Create Subject)
│   ├── enrollments/
│   │   ├── index.tsx                (List Enrollments)
│   │   └── create.tsx               (Create Enrollment)
│   ├── grades/
│   │   └── create.tsx               (Create Grade)
│   ├── classes/
│   │   ├── index.tsx                (List Classes)
│   │   └── create.tsx               (Create Class)
│   ├── users/
│   │   ├── index.tsx                (List Users)
│   │   └── create.tsx               (Create User)
│   └── error/
│       └── NotFound.tsx
│
├── components/                      (Reusable Components)
│   ├── Navbar.tsx                   (Navigation Bar)
│   ├── ProtectedRoute.tsx           (Role-based Route Guard)
│   ├── NavLink.tsx                  (Navigation Link)
│   ├── DashboardCard.tsx            (Dashboard Card Component)
│   ├── StudentForm.tsx              (Form para criar/editar Student)
│   ├── TeacherForm.tsx              (Form para criar/editar Teacher)
│   ├── SubjectForm.tsx              (Form para criar/editar Subject)
│   ├── EnrollmentForm.tsx           (Form para criar Enrollment)
│   ├── GradeForm.tsx                (Form para lançar Grades)
│   ├── StudentList.tsx              (Listagem de Students)
│   ├── common/                      (Componentes comuns - vazio)
│   ├── forms/                       (Componentes de form - vazio)
│   ├── lists/                       (Componentes de lista - vazio)
│   └── ui/                          (shadcn/ui Components 40+)
│
├── auth/
│   └── AuthContext.tsx              (Context API para autenticação)
│
├── api/
│   └── client.ts                    (Axios instance com JWT interceptor)
│
├── services/                        (API Layer)
│   ├── studentService.ts            (API calls para /api/students)
│   ├── teacherService.ts            (API calls para /api/teachers)
│   ├── subjectService.ts            (API calls para /api/subjects)
│   ├── enrollmentService.ts         (API calls para /api/enrollments)
│   ├── gradeService.ts              (API calls para /api/grades)
│   ├── classService.ts              (API calls para /api/classes)
│   └── userService.ts               (API calls para /api/users)
│
├── hooks/                           (Custom Hooks)
│   ├── useStudents.ts               (Gerencia estado de students)
│   ├── useTeachers.ts               (Gerencia estado de teachers)
│   ├── useSubjects.ts               (Gerencia estado de subjects)
│   ├── useEnrollments.ts            (Gerencia estado de enrollments)
│   ├── useGrades.ts                 (Gerencia estado de grades)
│   ├── useClasses.ts                (Gerencia estado de classes)
│   ├── useUsers.ts                  (Gerencia estado de users)
│   ├── use-mobile.tsx               (Detecta mobile)
│   └── use-toast.ts                 (Toast notifications)
│
├── types/
│   └── index.ts                     (TypeScript Interfaces)
│
├── lib/
│   └── utils.ts                     (Utility functions - CSS class merge)
│
├── test/
│   ├── example.test.ts              (Test examples)
│   └── setup.ts                     (Test setup)
│
├── App.tsx                          (Root component com routing)
├── main.tsx                         (Entry point)
├── index.css                        (Global styles)
└── vite-env.d.ts                    (Vite env types)
```

### Páginas (Pages)

#### Pages: Autenticação

**LoginPage.tsx**
- Route: `/login`
- Público (sem autenticação)
- Componentes:
  - Form com campos: email, password
  - Validação com react-hook-form + zod
  - Button: Fazer login
  - Link: "Não tem conta? Cadastre-se"
- Funcionalidade:
  - Chama `AuthContext.login(email, password)`
  - Se sucesso: redireciona para dashboard correspondente ao role
  - Se erro: exibe toast com mensagem de erro

#### Pages: Dashboards

**AdminDashboard.tsx**
- Route: `/admin`
- Acesso: ROLE_ADMIN
- Componentes:
  - Header: "Dashboard Administrador"
  - 4-6 DashboardCards com métricas (total alunos, professores, turmas)
  - Links rápidos: Gerenciar alunos, professores, turmas, disciplinas
  - Gráfico resumido (opcional)
  
**StudentDashboard.tsx**
- Route: `/student`
- Acesso: ROLE_STUDENT
- Componentes:
  - Header: "Meu Dashboard"
  - Card com dados do aluno (matrícula, status)
  - Card com disciplinas atuais
  - Card com notas atuais
  - Link: Ver mais detalhes

**TeacherDashboard.tsx**
- Route: `/teacher`
- Acesso: ROLE_TEACHER
- Componentes:
  - Header: "Dashboard Professor"
  - Card com minhas disciplinas
  - Card com total de alunos sob orientação
  - Links rápidos: Lançar notas, Ver turmas
  - Lista de próximas aulas (se implementado)

#### Pages: Alunos

**StudentsPage.tsx** (`/students`)
- Acesso: ROLE_ADMIN, ROLE_TEACHER
- Componentes:
  - Cabeçalho: "Alunos"
  - Button: "Novo Aluno" (vai para /students/create)
  - Tabela com colunas: ID, Nome, Email, CPF, Status, Ações (Edit, Delete)
  - Input filtro por nome
  - Paginação (se houver muitos)
- Funcionalidade:
  - Usa hook `useStudents()`
  - Carrega lista ao montar
  - Click em Delete chama `studentService.delete(id)`

**CreateStudentPage.tsx** (`/students/create`)
- Acesso: ROLE_ADMIN
- Componentes:
  - Cabeçalho: "Novo Aluno" ou "Editar Aluno"
  - StudentForm.tsx
  - Button: Salvar, Cancelar
- Funcionalidade:
  - Se nova: chama `studentService.create(studentDTO)`
  - Se edição: chama `studentService.update(id, studentDTO)`

#### Pages: Professores

**TeachersPage.tsx** (`/teachers`)
- Similar a StudentsPage mas para professors

**CreateTeacherPage.tsx** (`/teachers/create`)
- Similar a CreateStudentPage mas com TeacherForm

#### Pages: Disciplinas

**SubjectsPage.tsx** (`/subjects`)
- Acesso: ROLE_ADMIN, ROLE_TEACHER
- Carrega disciplinas (todas se ADMIN, apenas minhas se TEACHER)

**CreateSubjectPage.tsx** (`/subjects/create`)
- Acesso: ROLE_ADMIN, ROLE_TEACHER
- Form com campos: name, description, workloadHours, teacherId (select)

#### Pages: Matrículas

**EnrollmentsPage.tsx** (`/enrollments`)
- Acesso: ROLE_ADMIN, ROLE_TEACHER
- Tabela de matrículas com:  studentId, subjectId, schoolClassId, enrollmentDate, status

**CreateEnrollmentPage.tsx** (`/enrollments/create`)
- Form com selects para: student, subject, schoolClass

#### Pages: Notas

**CreateGradePage.tsx** (`/grades/create`)
- Acesso: ROLE_ADMIN, ROLE_TEACHER
- Form com campos: exam1, exam2, finalExam, enrollmentId (select)
- Após criar: exibe average e status calculados

#### Pages: Turmas

**ClassesPage.tsx** (`/classes`)
- Acesso: ROLE_ADMIN
- Tabela: name, schoolYear, semester, room, shift

**CreateClassPage.tsx** (`/classes/create`)
- Form: name, schoolYear, semester, room, shift

#### Pages: Usuários

**UsersPage.tsx** (`/users`)
- Acesso: ROLE_ADMIN
- Gerencia usuários do sistema

**CreateUserPage.tsx** (`/users/create`)
- Form: name, email, password, roles (multi-select)

### Components (Componentes Reutilizáveis)

#### Navbar.tsx
```typescript
Props: none (usa AuthContext)

Funcionalidade:
- Exibe logo "School Buddy"
- Menu dinâmico baseado em role:
  * Admin: Alunos, Professores, Disciplinas, Matrículas, Notas, Turmas, Usuários
  * Teacher: Minhas Disciplinas, Lançar Notas, Meus Alunos
  * Student: Minhas Disciplinas, Minhas Notas, Meu Perfil
- Button: Logout (limpa token + redireciona para /login)
- Menu responsivo em mobile
```

#### ProtectedRoute.tsx
```typescript
Props:
- element: React.ReactElement
- requiredRoles?: string[]

Funcionalidade:
- Valida se usuário está autenticado (verifica token)
- Se não autenticado: redireciona para /login
- Se autenticado mas role não permitido: redireciona para /not-found
- Se tudo OK: renderiza element
```

#### NavLink.tsx
```typescript
Props:
- to: string (rota)
- children: string | React.ReactNode
- requiredRole?: string

Funcionalidade:
- Componente wrapper de <Link>
- Válida role antes de renderizar
- Se role não permitido: não renderiza (ou exibe disabled)
```

#### DashboardCard.tsx
```typescript
Props:
- title: string
- value: string | number
- icon?: React.ReactNode
- color?: 'blue' | 'green' | 'red' | 'yellow'

Funcionalidade:
- Card simples com título, ícone e valor
- Usado em dashboards para exibir métricas
- Responsivo
```

#### StudentForm.tsx
```typescript
Props:
- initialData?: StudentDTO (para edição)
- onSubmit: (data: StudentDTO) => Promise<void>
- isLoading?: boolean

Componentes:
- Input: name
- Input: email
- Input: cpf (com máscara)
- Input: phone (com máscara)
- Input: birthDate (date picker)
- Input: enrollmentNumber
- Input: status (select)
- Button: Salvar
- Button: Cancelar

Validação:
- CPF format
- Email format
- Campos obrigatórios
```

#### TeacherForm.tsx
```typescript
Props:
- initialData?: TeacherDTO
- onSubmit: (data: TeacherDTO) => Promise<void>
- isLoading?: boolean

Campos:
- name
- email
- cpf (com máscara)
- phone (com máscara)
- specialty (select)
- hireDate (date picker)
```

#### SubjectForm.tsx
```typescript
Props:
- initialData?: SubjectDTO
- onSubmit: (data: SubjectDTO) => Promise<void>
- isLoading?: boolean

Campos:
- name
- description
- workloadHours (number)
- teacherId (select com lista de teachers)
```

#### EnrollmentForm.tsx
```typescript
Props:
- onSubmit: (data: EnrollmentDTO) => Promise<void>
- isLoading?: boolean

Campos:
- studentId (select com lista de students)
- subjectId (select com lista de subjects)
- schoolClassId (select com lista de classes)
- status (select)
```

#### GradeForm.tsx
```typescript
Props:
- onSubmit: (data: GradeDTO) => Promise<void>
- isLoading?: boolean

Campos:
- enrollmentId (select)
- exam1 (number, 0-10)
- exam2 (number, 0-10)
- finalExam (number, 0-10)
- Button: Calcular (mostra average e status antes de salvar)

Validação:
- Notas devem estar entre 0-10
```

#### StudentList.tsx
```typescript
Props:
- students: StudentDTO[]
- onEdit?: (id: Long) => void
- onDelete?: (id: Long) => void
- isLoading?: boolean

Funcionalidade:
- Tabela com colunas: ID, Nome, Email, CPF, Status, Ações
- Cada linha com buttons: Editar, Deletar
- Se onEdit: ao clicar em Editar, redireciona para /students/edit/:id
- Se onDelete: ao clicar em Deletar, mostra confirmação + deleta
```

### UI Components (shadcn/ui)

40+ componentes baseados em Radix UI + Tailwind:

```
button, card, input, label, select, textarea,
accordion, alert, alert-dialog, avatar, badge,
breadcrumb, calendar, carousel, checkbox, collapsible,
command, context-menu, dialog, drawer, dropdown-menu,
form, hover-card, input-otp, menubar, navigation-menu,
pagination, popover, progress, radio-group, resizable,
scroll-area, separator, sheet, sidebar, skeleton, slider,
sonner (toast), switch, table, tabs, toast, toaster,
toggle, toggle-group, tooltip, use-toast
```

Todos extensíveis e customizáveis com Tailwind.

### Hooks (Custom Hooks)

#### useStudents.ts
```typescript
Hook para gerenciar estado de students

Hook da useQuery (@tanstack/react-query):
- Chama studentService.getAll()
- Cache automático
- Refetch ao focar tab
- Estados: isLoading, isError, data, error

Retorna:
{
  students: StudentDTO[],
  isLoading: boolean,
  isError: boolean,
  error: Error | null,
  refetch: () => void
}

Uso em componentes:
const { students, isLoading } = useStudents();
useEffect(() => {
  // renderizar lista
}, [students]);
```

#### useTeachers.ts, useSubjects.ts, etc
- Similar ao useStudents
- Organiza queries para cada entidade

#### use-mobile.tsx
```typescript
Detecta se viewport é mobile

Hook padrão shadcn/ui
- Usa window.matchMedia('(max-width: 768px)')
- Retorna true se mobile, false se desktop
- Atualiza ao resize

Uso:
const isMobile = useIsMobile();
if (isMobile) {
  return <MobileView />;
} else {
  return <DesktopView />;
}
```

#### use-toast.ts
```typescript
Hook do Sonner para exibir toasts

Uso:
const { toast } = useToast();
toast.success('Aluno criado com sucesso!', {
  description: 'Aluno João Silva foi adicionado'
});

Tipos: success, error, info, warning
```

### Services (API Layer)

Não há Redux/Zustand; cada service é um módulo com funções que chamam Axios:

#### studentService.ts
```typescript
const API_URL = '/api/students';

export async function getAll(): Promise<StudentDTO[]> {
  try {
    const response = await api.get<StudentDTO[]>(API_URL);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch students: ${error}`);
  }
}

export async function getById(id: Long): Promise<StudentDTO> {
  try {
    const response = await api.get<StudentDTO>(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch student: ${error}`);
  }
}

export async function create(student: StudentDTO): Promise<StudentDTO> {
  try {
    const response = await api.post<StudentDTO>(API_URL, student);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create student: ${error}`);
  }
}

export async function update(id: Long, student: StudentDTO): Promise<StudentDTO> {
  try {
    const response = await api.put<StudentDTO>(`${API_URL}/${id}`, student);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update student: ${error}`);
  }
}

export async function patch(id: Long, student: Partial<StudentDTO>): Promise<StudentDTO> {
  try {
    const response = await api.patch<StudentDTO>(`${API_URL}/${id}`, student);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to patch student: ${error}`);
  }
}

export async function delete(id: Long): Promise<void> {
  try {
    await api.delete(`${API_URL}/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete student: ${error}`);
  }
}
```

**Padrão aplicado em:**
- teacherService.ts
- subjectService.ts
- enrollmentService.ts
- gradeService.ts
- classService.ts
- userService.ts

### AuthContext.tsx

```typescript
Context para gerenciar autenticação

Estado:
- isAuthenticated: boolean
- token: string | null
- role: string | null
- name: string | null
- error: string | null
- isLoading: boolean

Funções:
- login(email: string, password: string): Promise<void>
  → Chama POST /api/auth/login
  → Salva token + role + name em localStorage
  → Atualiza context state

- logout(): void
  → Remove token + role + name do localStorage
  → Limpa state

- loadFromStorage(): void
  → Chamada ao montar (useEffect)
  → Restaura sessão do localStorage

Uso em componentes:
const { isAuthenticated, role } = useContext(AuthContext);
if (!isAuthenticated) return <Redirect to="/login" />;
```

### API Client (api/client.ts)

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar JWT ao header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Roteamento (React Router v6)

```typescript
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<BrowserRouter>
  <Routes>
    {/* Público */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/" element={<Index />} />

    {/* Dashboards */}
    <Route
      path="/admin"
      element={<ProtectedRoute element={<AdminDashboard />} requiredRoles={['ROLE_ADMIN']} />}
    />
    <Route
      path="/student"
      element={<ProtectedRoute element={<StudentDashboard />} requiredRoles={['ROLE_STUDENT']} />}
    />
    <Route
      path="/teacher"
      element={<ProtectedRoute element={<TeacherDashboard />} requiredRoles={['ROLE_TEACHER']} />}
    />

    {/* Alunos */}
    <Route
      path="/students"
      element={<ProtectedRoute element={<StudentsPage />} requiredRoles={['ROLE_ADMIN', 'ROLE_TEACHER']} />}
    />
    <Route
      path="/students/create"
      element={<ProtectedRoute element={<CreateStudentPage />} requiredRoles={['ROLE_ADMIN']} />}
    />
    <Route
      path="/students/edit/:id"
      element={<ProtectedRoute element={<CreateStudentPage />} requiredRoles={['ROLE_ADMIN']} />}
    />

    {/* Professores */}
    <Route
      path="/teachers"
      element={<ProtectedRoute element={<TeachersPage />} requiredRoles={['ROLE_ADMIN']} />}
    />
    <Route
      path="/teachers/create"
      element={<ProtectedRoute element={<CreateTeacherPage />} requiredRoles={['ROLE_ADMIN']} />}
    />

    {/* Disciplinas */}
    <Route
      path="/subjects"
      element={<ProtectedRoute element={<SubjectsPage />} requiredRoles={['ROLE_ADMIN', 'ROLE_TEACHER']} />}
    />
    <Route
      path="/subjects/create"
      element={<ProtectedRoute element={<CreateSubjectPage />} requiredRoles={['ROLE_ADMIN', 'ROLE_TEACHER']} />}
    />

    {/* Matrículas */}
    <Route
      path="/enrollments"
      element={<ProtectedRoute element={<EnrollmentsPage />} requiredRoles={['ROLE_ADMIN', 'ROLE_TEACHER']} />}
    />
    <Route
      path="/enrollments/create"
      element={<ProtectedRoute element={<CreateEnrollmentPage />} requiredRoles={['ROLE_ADMIN', 'ROLE_TEACHER']} />}
    />

    {/* Notas */}
    <Route
      path="/grades/create"
      element={<ProtectedRoute element={<CreateGradePage />} requiredRoles={['ROLE_ADMIN', 'ROLE_TEACHER']} />}
    />

    {/* Turmas */}
    <Route
      path="/classes"
      element={<ProtectedRoute element={<ClassesPage />} requiredRoles={['ROLE_ADMIN']} />}
    />
    <Route
      path="/classes/create"
      element={<ProtectedRoute element={<CreateClassPage />} requiredRoles={['ROLE_ADMIN']} />}
    />

    {/* Usuários */}
    <Route
      path="/users"
      element={<ProtectedRoute element={<UsersPage />} requiredRoles={['ROLE_ADMIN']} />}
    />
    <Route
      path="/users/create"
      element={<ProtectedRoute element={<CreateUserPage />} requiredRoles={['ROLE_ADMIN']} />}
    />

    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

### Types (index.ts)

```typescript
// Interfaces TypeScript

interface StudentDTO {
  id?: Long;
  name: string;
  email: string;
  cpf: string;
  phone?: string;
  birthDate?: LocalDate;
  enrollmentNumber?: string;
  enrollmentDate?: LocalDate;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

interface TeacherDTO {
  id?: Long;
  name: string;
  email: string;
  cpf: string;
  phone?: string;
  specialty?: string;
  hireDate?: LocalDate;
}

interface SubjectDTO {
  id?: Long;
  name: string;
  description?: string;
  workloadHours: number;
  teacherId: Long;
}

interface EnrollmentDTO {
  id?: Long;
  enrollmentDate?: LocalDate;
  status?: string;
  studentId: Long;
  subjectId: Long;
  schoolClassId: Long;
}

interface GradeDTO {
  id?: Long;
  exam1: number;
  exam2: number;
  finalExam: number;
  average?: number;
  status?: string;
  enrollmentId: Long;
}

interface SchoolClassDTO {
  id?: Long;
  name: string;
  schoolYear: number;
  semester: 1 | 2;
  room: string;
  shift: 'MORNING' | 'AFTERNOON' | 'EVENING';
}

interface UserDTO {
  id?: Long;
  name: string;
  email: string;
  password?: string;
  roles: string[];
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  role: string;
  name: string;
}
```

---

## 🔗 Integração Front ↔ Back

### Fluxo de Requisição Completo

#### Exemplo: Criar novo aluno

**1. Frontend (React)**
```typescript
// CreateStudentPage.tsx
const handleSubmit = async (data: StudentDTO) => {
  try {
    const newStudent = await studentService.create(data);
    toast.success('Aluno criado com sucesso!');
    navigate('/students');
  } catch (error) {
    toast.error('Erro ao criar aluno');
  }
};
```

**2. Frontend Service (axios)**
```typescript
// studentService.ts
const API_URL = '/api/students';
const response = await api.post(API_URL, data);
// axios interceptor adiciona: Authorization: Bearer {token}
// Response: 201 Created + StudentDTO
```

**3. Backend Controller**
```java
// StudentController.java
@PostMapping
public ResponseEntity<StudentDTO> create(@RequestBody StudentDTO dto) {
  StudentDTO created = studentService.create(dto);
  return ResponseEntity
    .created(URI.create("/api/students/" + created.getId()))
    .body(created);
}
```

**4. Backend Service**
```java
// StudentService.java
public StudentDTO create(StudentDTO dto) {
  // Validação
  if (studentRepository.existsByCpf(dto.getCpf())) {
    throw new StudentAlreadyExistsException(dto.getCpf());
  }
  
  // Mapeamento DTO → Entity
  Student student = StudentMapper.toEntity(dto);
  
  // Persistência
  Student saved = studentRepository.save(student);
  
  // Mapeamento Entity → DTO
  return StudentMapper.toDTO(saved);
}
```

**5. Backend Repository**
```java
// StudentRepository.java
public interface StudentRepository extends JpaRepository<Student, Long> {
  boolean existsByCpf(String cpf);
}
// Usa Hibernate/JPA para executar SQL
// INSERT INTO student(...) VALUES(...)
```

**6. Banco de Dados (H2)**
```sql
INSERT INTO student (
  name, email, cpf, phone, birth_date,
  enrollment_number, enrollment_date, status
) VALUES (
  'João Silva', 'joao@email.com', '123.456.789-00', ...
);
```

**7. Resposta de volta ao Frontend**
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@email.com",
  "cpf": "123.456.789-00",
  ...
}
// HTTP 201 Created
```

**8. Frontend React**
```typescript
// useStudents ou useQuery atualiza cache
// Componente re-renderiza com novo aluno na lista
// Toast exibido: "Aluno criado com sucesso!"
// Redirecionada para /students
```

### Endpoints Principais

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|-------------|----------|
| POST | `/api/auth/login` | Público | Autenticar usuário |
| POST | `/api/students` | ADMIN | Criar aluno |
| GET | `/api/students` | ADMIN, TEACHER | Listar alunos |
| GET | `/api/students/{id}` | ADMIN, TEACHER, STUDENT | Buscar aluno |
| PUT | `/api/students/{id}` | ADMIN | Atualizar aluno |
| PATCH | `/api/students/{id}` | ADMIN | Atualizar parcial |
| DELETE | `/api/students/{id}` | ADMIN | Deletar aluno |
| POST | `/api/teachers` | ADMIN | Criar professor |
| GET | `/api/teachers` | ADMIN, TEACHER | Listar professores |
| POST | `/api/subjects` | ADMIN, TEACHER | Criar disciplina |
| GET | `/api/subjects` | ADMIN, TEACHER | Listar disciplinas |
| GET | `/api/subjects/teacher` | ADMIN, TEACHER | Minhas disciplinas |
| POST | `/api/enrollments` | ADMIN, TEACHER | Criar matrícula |
| GET | `/api/enrollments` | ADMIN, TEACHER | Listar matrículas |
| GET | `/api/enrollments/student` | ADMIN, STUDENT | Minhas matrículas |
| POST | `/api/grades` | ADMIN, TEACHER | Lançar nota |
| GET | `/api/grades` | ADMIN | Listar notas |
| GET | `/api/grades/student` | ADMIN, STUDENT | Minhas notas |
| POST | `/api/classes` | ADMIN | Criar turma |
| GET | `/api/classes` | ADMIN, TEACHER, STUDENT | Listar turmas |

### Formato de Respostas

#### Sucesso (2xx)

```json
// POST /api/students (201 Created)
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@email.com",
  "cpf": "123.456.789-00",
  "phone": "11999999999",
  "birthDate": "2008-01-15",
  "enrollmentNumber": "2024001",
  "enrollmentDate": "2024-01-10",
  "status": "ACTIVE"
}

// GET /api/students (200 OK)
[
  {
    "id": 1,
    "name": "João Silva",
    ...
  }
]

// DELETE /api/students/1 (204 No Content)
// Body: vazio
```

#### Erro (4xx/5xx)

```json
// POST /api/students (409 Conflict - CPF duplicado)
{
  "status": 409,
  "error": "StudentAlreadyExistsException",
  "message": "Student with CPF 123.456.789-00 already exists",
  "timestamp": "2026-04-13T10:30:00"
}

// GET /api/students/999 (404 Not Found)
{
  "status": 404,
  "error": "ResourceNotFoundException",
  "message": "Resource Student with id 999 not found",
  "timestamp": "2026-04-13T10:30:00"
}

// POST /api/grades (400 Bad Request - nota inválida)
{
  "status": 400,
  "error": "GradeInvalidException",
  "message": "Grade 15.5 is invalid. Must be between 0 and 10",
  "timestamp": "2026-04-13T10:30:00"
}

// GET /api/students (401 Unauthorized - token inválido)
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}

// GET /api/students (403 Forbidden - role insuficiente)
{
  "status": 403,
  "error": "Forbidden",
  "message": "Access denied"
}
```

### Autenticação (JWT)

#### Flow de Autenticação

```
1. User digita email/senha em LoginPage
2. Frontend POST /api/auth/login com LoginRequest
   {
     "email": "admin@school.com",
     "password": "admin123"
   }

3. Backend AuthController valida credenciais
4. Backend JwtUtils gera JWT token
   - Header: { "alg": "HS512", "typ": "JWT" }
   - Payload: {
       "email": "admin@school.com",
       "role": "ROLE_ADMIN",
       "iat": 1712234400,
       "exp": 1712320800  (24 horas)
     }
   - Signature: HMACSHA512(header.payload, secret_key)
   - Token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlb..."

5. Backend retorna LoginResponse
   {
     "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlb...",
     "role": "ROLE_ADMIN",
     "name": "Administrador"
   }

6. Frontend salva token em localStorage
   localStorage.setItem('auth_token', token);

7. Frontend em cada requisição:
   GET /api/students
   Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlb...
   (axios interceptor adiciona header automaticamente)

8. Backend JwtAuthenticationFilter valida:
   - Extrai token do header
   - Valida assinatura
   - Valida expiração
   - Se válido: cria Authentication
   - Se inválido: retorna 401

9. Request segue para controller (autorizado)
```

---

## 📋 Fluxo de Dados

### Exemplo Completo: Aluno Criando Matrícula

```
┌────────────────────────────────────────────────┐
│                  FRONTEND                      │
└────────────────────────────────────────────────┘

User clica em "Nova Matrícula"
    ↓
CreateEnrollmentPage.tsx carrega
    ↓
EnrollmentForm.tsx renderiza com:
  - Select: Disciplinas (carregado via useSubjects)
  - Select: Turmas (carregado via useClasses)
  - Button: Enviar
    ↓
User seleciona disciplina e turma, clica em Enviar
    ↓
onSubmit({studentId, subjectId, schoolClassId})
    ↓
enrollmentService.create({...})
    ↓
axios.post("/api/enrollments", {...})
    ↓
Adiciona header: Authorization: Bearer {token}

─────────────────────────────────────────────────

                  BACKEND

─────────────────────────────────────────────────

POST /api/enrollments (com JWT token)
    ↓
JwtAuthenticationFilter
  ├─ Extrai token do header
  ├─ Valida assinatura + expiração
  ├─ Cria Authentication com email + role
  └─ Passa para próximo filtro
    ↓
SecurityConfig verifica autorização
  ├─ Endpoint /api/enrollments POST
  ├─ Requer: ROLE_ADMIN ou ROLE_TEACHER
  ├─ User tem ROLE_TEACHER?
  └─ SIM → continua; NÃO → retorna 403
    ↓
EnrollmentController.create(@RequestBody EnrollmentDTO dto)
    ↓
EnrollmentService.enroll(dto)
  ├─ Valida studentId (busca Student no DB)
  │  └─ Se não existe: lança ResourceNotFoundException
  ├─ Valida subjectId (busca Subject no DB)
  │  └─ Se não existe: lança ResourceNotFoundException
  ├─ Valida schoolClassId (busca SchoolClass no DB)
  │  └─ Se não existe: lança ResourceNotFoundException
  ├─ Valida duplicação
  │  └─ Busca Enrollment(studentId + subjectId)
  │  └─ Se existe: lança EnrollmentAlreadyExistsException
  └─ Cria Enrollment(student, subject, schoolClass)
    ↓
EnrollmentRepository.save(enrollment)
    ↓
Hibernate SQL:
  INSERT INTO enrollment (
    student_id, subject_id, school_class_id,
    enrollment_date, status
  ) VALUES (1, 5, 2, '2026-04-13', 'ACTIVE')
    ↓
H2 Database salva registro
    ↓
Enrollment criado com ID = 10
    ↓
Service mapeia Entity → DTO
    ↓
Controller retorna 201 Created + EnrollmentDTO
  {
    "id": 10,
    "studentId": 1,
    "subjectId": 5,
    "schoolClassId": 2,
    "enrollmentDate": "2026-04-13",
    "status": "ACTIVE"
  }

─────────────────────────────────────────────────

                  FRONTEND

─────────────────────────────────────────────────

axios recebe status 201 + EnrollmentDTO
    ↓
Promise resolve com data
    ↓
Componente ChapterScript:
  ├─ useQuery atualiza cache (React Query)
  ├─ Components que dependem de useEnrollments
  │  └─ Re-renderizam com nova matrícula
  └─ Toast: "Matrícula criada com sucesso!"
    ↓
navigate("/enrollments")
    ↓
EnrollmentsPage renderiza com lista atualizada
```

---

## 🔄 Guia de Manutenção e Migração

### Manutenção Básica

#### 1. Adicionar Nova Entidade

**Exemplo: Adicionar "Disciplina Extra" (Complementary Subject)**

**Backend:**

1. Criar entity: `ComplementarySubject.java`
```java
@Entity
@Table(name = "complementary_subjects")
public class ComplementarySubject {
  @Id @GeneratedValue private Long id;
  @Column(nullable = false) private String name;
  @ManyToOne private Subject parentSubject;
  // getters/setters
}
```

2. Criar DTO: `ComplementarySubjectDTO.java`
```java
public class ComplementarySubjectDTO {
  private Long id;
  private String name;
  private Long parentSubjectId;
  // getters/setters
}
```

3. Criar mapper: `ComplementarySubjectMapper.java`
4. Criar repository: `ComplementarySubjectRepository.java`
5. Criar service: `ComplementarySubjectService.java`
6. Criar controller: `ComplementarySubjectController.java`
7. Adicionar permissões em `SecurityConfig.java`

**Frontend:**

1. Criar service: `complementarySubjectService.ts`
2. Criar hook: `useComplementarySubjects.ts`
3. Criar form: `ComplementarySubjectForm.tsx`
4. Criar pages: `ComplementarySubjectsPage.tsx`, `CreateComplementarySubjectPage.tsx`
5. Adicionar rotas em `App.tsx`
6. Adicionar links em `Navbar.tsx`

#### 2. Adicionar Campo a uma Entidade

**Exemplo: Adicionar "Telefone Alternativo" (alternativePhone) a Student**

**Backend:**

1. Editar `Student.java`:
```java
@Column(nullable = true)
private String alternativePhone;
```

2. Editar `StudentDTO.java`:
```java
private String alternativePhone;
```

3. Editar `StudentMapper.java`:
```java
dto.setAlternativePhone(student.getAlternativePhone());
student.setAlternativePhone(dto.getAlternativePhone());
```

4. Hibernate migrará automaticamente (se ddl-auto=update)

**Frontend:**

1. Editar `types/index.ts`:
```typescript
interface StudentDTO {
  alternativePhone?: string;
  ...
}
```

2. Editar `StudentForm.tsx`:
```typescript
<Input name="alternativePhone" label="Telefone Alternativo" />
```

#### 3. Alterar Autenticação (exemplo: adicionar 2FA)

**Padrão Atual:** JWT + Spring Security

**Para adicionar 2FA (Two-Factor Authentication):**

1. Backend:
   - Adicionar tabela `twofa_secrets` em banco
   - Adicionar campo `twoFactorEnabled` em `User.java`
   - Modificar `AuthController.login()` para retornar flag `twoFARequired`
   - Criar endpoint `POST /api/auth/verify-2fa` para validar segundo fator

2. Frontend:
   - Modificar `LoginPage.tsx` para exibir form de 2FA se `twoFARequired=true`
   - Criar `TwoFactorForm.tsx`
   - Modificar `AuthContext.tsx` para suportar fluxo 2FA

#### 4. Alterar Banco de Dados (H2 → PostgreSQL)

**Passo a passo:**

1. **Remover dependência H2:**
   ```xml
   <!-- Remove do pom.xml -->
   <dependency>
     <groupId>com.h2database</groupId>
     <artifactId>h2</artifactId>
     <scope>runtime</scope>
   </dependency>
   ```

2. **Adicionar PostgreSQL:**
   ```xml
   <dependency>
     <groupId>org.postgresql</groupId>
     <artifactId>postgresql</artifactId>
     <scope>runtime</scope>
   </dependency>
   ```

3. **Atualizar `application.properties`:**
   ```properties
   # Remover H2
   # spring.datasource.url=jdbc:h2:mem:school-db

   # Adicionar PostgreSQL
   spring.datasource.url=jdbc:postgresql://localhost:5432/school_db
   spring.datasource.username=postgres
   spring.datasource.password=yourpassword
   spring.datasource.driver-class-name=org.postgresql.Driver
   spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
   ```

4. **Criar banco manualmente:**
   ```sql
   CREATE DATABASE school_db;
   ```

5. **Alterar DDL strategy:**
   ```properties
   # Criar schema automaticamente (primeira vez)
   spring.jpa.hibernate.ddl-auto=create

   # Depois, usar validate ou update
   spring.jpa.hibernate.ddl-auto=validate
   ```

6. **Compilar e rodar com Maven:**
   ```bash
   mvn clean compile
   ```

7. **Criar índices para performance:**
   ```sql
   CREATE INDEX idx_student_cpf ON student(cpf);
   CREATE INDEX idx_user_email ON "user"(email);
   CREATE INDEX idx_enrollment_student ON enrollment(student_id);
   ```

#### 5. Alterar Frontend Framework (React → Vue/Angular)

**Mapeamento de conceitos:**

| React | Vue / Angular |
|-------|---------------|
| Components (.tsx) | Components (.vue / .component.ts) |
| React Router | Vue Router / Angular Router |
| Context API | Pinia / Vuex (Vue) / Services (Angular) |
| Custom Hooks | Composition API (Vue) / Services (Angular) |
| React Query | SWR / Nuxt (Vue) / NgRx (Angular) |
| axios + interceptor | axios / HttpClient (Angular) |
| TypeScript interfaces | TypeScript interfaces (iguais) |

**Passos:**

1. Manter `/api/client.ts` igual (axios é agnóstico)
2. Manter todas as `services/` iguais (usam axios)
3. Converter `pages/` e `components/` para sintaxe da framework nova
4. Converter `hooks/` para Composition API (Vue) ou Services (Angular)
5. Converter `AuthContext` para Pinia/Vuex (Vue) ou ngrx (Angular)
6. Manter `types/index.ts` igual

#### 6. Alterar Framework Backend (Spring Boot → Django/Node.js)

**Django (Python):**

```python
# Structure similar
project/
├── students/
│   ├── models.py         # = Entities
│   ├── views.py          # = Controllers
│   ├── serializers.py    # = DTOs + Mappers
│   ├── urls.py           # = Routing
│   └── tests.py
├── users/
├── manage.py

# Django ORM similar to JPARepository
```

**Express (Node.js):**

```typescript
// Structure similar
src/
├── modules/
│   ├── students/
│   │   ├── student.entity.ts    # = Entity
│   │   ├── student.dto.ts       # = DTO
│   │   ├── student.service.ts   # = Service
│   │   ├── student.controller.ts # = Controller
│   │   └── student.repository.ts # = Repository
├── middleware/         # = Filters
├── guards/           # = SecurityConfig
```

**Pontos críticos a migrar:**

1. **Entidades/Modelos** (direto, estrutura similar)
2. **Controllers** (lógica similar, syntax diferente)
3. **Services** (lógica de negócio idêntica)
4. **Repositories** (use ORM equivalente)
5. **Autenticação JWT** (é padrão, migra fácil)
6. **CORS/Security** (configure similar no novo framework)

---

## 🎨 Decisões de Design

### 1. **Separação Frontend/Backend**

**Decisão:** Frontend e backend separados (não monolítico)

**Motivação:**
- Escalabilidade independente
- Deploy separado
- Diferentes tecnologias
- Reutilização de API (mobile, desktop, etc podem consumir mesma API)

**Trade-off:**
- Mais complexidade operacional
- CORS precisa ser configurado
- Mais chamadas HTTP

### 2. **Autenticação JWT**

**Decisão:** Usar JWT tokens em vez de sessões server-side

**Motivação:**
- Stateless (facilita scaling)
- Funciona bem em APIs REST
- Suporte a múltiplos domínios (CORS)
- Padrão de mercado

**Token estrutura:**
- Payload com email + role
- Expiração 24 horas
- Armazenado em localStorage

### 3. **DTOs + Mappers**

**Decisão:** Usar DTOs e mappers para traduzir Entity ↔ API Contract

**Motivação:**
- Desacoplamento entre DB e API
- Segurança (não expor campos sensíveis)
- Flexibilidade (alterar Entity sem quebrar API)
- Validação em camada independente

**Exemplo:**
- Entity `User` tem field `passwordHash`
- DTO `UserDTO` não expõe `passwordHash`
- Mapper traduz Entity ↔ DTO

### 4. **Context API em vez de Redux**

**Decisão:** Usar Context API para estado global (autenticação etc)

**Motivação:**
- Menos boilerplate
- Integrado ao React (não precisa lib extra)
- Suficiente para estado simples (auth, theme)
- Mais fácil de entender

**Trade-off:**
- Pode ser lento com muitas re-renders
- Para estado complexo, Redux seria melhor

### 5. **React Query para Server State**

**Decisão:** Usar @tanstack/react-query para gerenciar dados do servidor

**Motivação:**
- Cache automático
- Refetch em background
- Tratamento de erros
- Sincronização com server facilitada

**Onde usar:**
- Listas (students, teachers, etc)
- Dados que vêm do servidor

**Onde não usar:**
- Autenticação (Context API)
- UI local (useState)

### 6. **H2 em Memória (Desenvolvimento)**

**Decisão:** Usar H2 Database para desenvolvimento (não produção)

**Motivação:**
- Setup rápido, sem instalação de BD externo
- Dados reset a cada restart (bom para testes)
- Suficiente para MVP/desenvolvimento

**Migração para Produção:**
- Trocar H2 por PostgreSQL/MySQL
- Usar migrations (Flyway/Liquibase)
- Configurar backups

### 7. **shadcn/ui + Tailwind**

**Decisão:** Usar shadcn/ui (Radix UI + Tailwind) para componentes UI

**Motivação:**
- Componentes acessíveis (Radix UI)
- Customização fácil (Tailwind)
- Sem dependência a versão do React
- Estilo consistente

### 8. **Single Sign-On não implementado**

**Atual:** Cada aplicação tem seu próprio login

**Futuro:** Implementar OAuth2 / OpenID Connect para SSO:
```
┌─────────────┐
│  School App │
│   Frontend  │──┐
└─────────────┘  │
                 ├──→ OAuth2 Server ←── Google / GitHub
┌─────────────┐  │
│ Mobile App  │──┤
└─────────────┘  │
                 └──→ Social Login
```

### 9. **Regras de Negócio in Service Layer**

**Decisão:** Validações e lógica de negócio ficam em Service, não em Controller

**Exemplos:**
- CPF não pode duplicar → StudentService
- Nota deve ser 0-10 → GradeService
- Matrícula não pode duplicar → EnrollmentService

**Motivo:** Service é reutilizável (pode ser chamado de diferentes contextos)

### 10. **Cascade Delete habilitado**

**Decisão:** Deletar parent deleta children em cascata

**Exemplo:**
```
DELETE student → Deleta todas enrollments → Deleta todas grades
DELETE enrollment → Deleta todas grades
DELETE schoolClass → Deleta todas enrollments
```

**Motivo:** Integridade referencial, evita orfãos no BD

---

## 📞 Contatos e Referências

### Informações do Backend

- **Main Entry Point:** `DemoApplication.java` (Spring Boot)
- **API Documentation:** Não há Swagger/OpenAPI (adicionar futuramente)
- **Database Console:** `http://localhost:8081/h2-console` (desenvolvimento)
- **Security:** JWT via `JwtUtils` + `JwtAuthenticationFilter`

### Informações do Frontend

- **Entry Point:** `main.tsx` (React + TypeScript)
- **Vite Config:** `vite.config.ts`
- **Environment:** `.env` (não versionado, criar localmente)
  ```
  VITE_API_URL=http://localhost:8081
  ```
- **Build:** `bun run build`
- **Dev Server:** `bun run dev`

### URLs Úteis

```
# Desenvolvimento
Frontend:    http://localhost:5173
Backend:     http://localhost:8081
H2 Console:  http://localhost:8081/h2-console

# Database
Credenciais H2:
  Username: sa
  Password: (vazio)
  Database: school-db

# API
Base URL:   http://localhost:8081/api
Docs:       (não implementado - criar Swagger futuramente)

# Testes
FrontendTests: npm run test
BackendTests:  mvn test
```

---

## 🎯 Sumário Executivo

| Aspecto | Stack | Detalhes |
|---------|-------|----------|
| **Frontend** | React 18 + TypeScript 5.6 | Vite, React Router v6, shadcn/ui, TailwindCSS |
| **Backend** | Spring Boot 3.5 + Java 25 | Spring Data JPA, Spring Security, JWT |
| **Banco** | H2 (dev) | PostgreSQL (produção recomendado) |
| **Autenticação** | JWT | 24h expiration, role-based access control |
| **State Mgmt** | Context API + React Query | AuthContext + @tanstack/react-query |
| **HTTP Client** | Axios | Interceptors para JWT |
| **Arquitetura** | Layered + Clean Code | Controllers → Services → Repositories |
| **Padrões** | DTO + Mapper | Desacoplamento Entity ↔ API |

Este documento serve como **blueprint completo** para desenvolvimento, manutenção e migração futura do School Buddy.

