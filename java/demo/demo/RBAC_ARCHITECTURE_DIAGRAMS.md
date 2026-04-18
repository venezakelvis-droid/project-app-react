# 🏗️ Arquitetura de Controle de Acesso - Diagrama de Fluxo

## Fluxo de Requisição com Controle de Acesso

```
┌─────────────────────────────────────────────────────────────────┐
│                    HTTP REQUEST                                 │
│              GET /api/subjects (Authenticated)                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │  JwtAuthenticationFilter       │
        │  - Extrai token JWT            │
        │  - Popula SecurityContext      │
        └────────────┬───────────────────┘
                     │
                     ▼
        ┌────────────────────────────────┐
        │      SubjectController         │
        │   findAll() [GET /subjects]    │
        └────────────┬───────────────────┘
                     │
                     ▼
        ┌────────────────────────────────┐
        │     SubjectService.findAll()   │
        │  - Injeta AuthorizationHelper  │
        │  - Verifica permissão do user  │
        └────────────┬───────────────────┘
                     │
        ┌────────────┴───────────┐
        │                        │
        ▼                        ▼
   ┌─────────────┐           ┌──────────────────┐
   │ isAdmin()?  │           │ AuthorizationHelper
   │  YES ↓      │           │ - getCurrentUser()
   │  NO  ↓      │           │ - isAdmin()
   └─────────────┘           │ - isTeacher()
        │                    │ - isStudent()
        ├────────┐           │ - getCurrentTeacherId()
        │        │           │ - getCurrentStudentId()
        │        └──────────→└──────────────────┘
        │                        ↑
        ▼                        │
    ┌─────────────────────────────────────┐
    │  RepositoryMethod Called            │
    │                                     │
    │  ADMIN:                             │
    │    → repository.findAll()           │
    │                                     │
    │  TEACHER:                           │
    │    → findByTeacherId(userId)        │
    │                                     │
    │  STUDENT:                           │
    │    → findByStudentId(userId)        │
    └────────────┬────────────────────────┘
                 │
                 ▼
         ┌──────────────────┐
         │ Filtered Results │
         │  (Data-Driven)   │
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │   Map to DTOs    │
         │  (No passwords!) │
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │  HTTP 200 + JSON │
         │  (Filtered)      │
         └──────────────────┘
```

## Arquitetura em Camadas com RBAC

```
┌─────────────────────────────────────────────────────────────────┐
│                    Controller Layer                              │
│         SubjectController, EnrollmentController, etc             │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Service Layer (RBAC Applied)                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ SubjectService.findAll()                                │  │
│  │  1. authorizationHelper.isAdmin() ?                      │  │
│  │  2. authorizationHelper.isTeacher() ?                    │  │
│  │  3. authorizationHelper.isStudent() ?                    │  │
│  │                                                          │  │
│  │ Calls appropriate repository method based on role        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                       │                                          │
└───────────────────────┼──────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Repository Layer                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ SubjectRepository                                        │  │
│  │ - findAll()                (ADMIN access)               │  │
│  │ - findByTeacherId()        (TEACHER access)             │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ EnrollmentRepository                                     │  │
│  │ - findAll()                (ADMIN access)               │  │
│  │ - findByStudentId()        (STUDENT access)             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Key Point: Repositories return FILTERED data, not raw data!   │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
                  ┌──────────────┐
                  │   Database   │
                  │   (Queries)  │
                  └──────────────┘
```

## Componentes de Autorização

```
┌─────────────────────────────────────────────────────────────────┐
│                    Security Context                              │
│                  (Spring Security)                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Principal: "usuario@email.com"                          │   │
│  │ Authorities: [ ROLE_TEACHER, ]                          │   │
│  │ Authenticated: true                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │    SecurityUtils.java        │
        │  ┌────────────────────────┐  │
        │  │ getCurrentUserEmail()   │  │ ← Reads from SecurityContext
        │  │ hasRole()               │  │
        │  │ isAdmin()/isTeacher()   │  │
        │  │ isStudent()             │  │
        │  └────────────────────────┘  │
        └──────────────┬────────────────┘
                       │
                       ▼
     ┌─────────────────────────────────────┐
     │  AuthorizationHelper.java           │
     │┌───────────────────────────────────┐│
     ││ getCurrentUser()                  ││ ← Fetches User from DB
     ││ getCurrentUserAsTeacher()         ││
     ││ getCurrentUserAsStudent()         ││
     ││ getCurrentTeacherId()             ││
     ││ getCurrentStudentId()             ││
     ││ isAdmin() / isTeacher() / etc     ││
     │└───────────────────────────────────┘│
     └──────────────┬──────────────────────┘
                    │
                    ▼
     ┌──────────────────────────────────┐
     │   Called from Services           │
     │  (injected @RequiredArgsConstructor)
     └──────────────────────────────────┘
```

## Fluxo de Verificação de Acesso em findById()

```
Service.findById(id)
  │
  ├─→ repository.findById(id)
  │    └─→ entity = Entity
  │
  ├─→ authorizationHelper.isAdmin()?
  │    YES → return DTO (ACESSO PERMITIDO)
  │
  └─→ authorizationHelper.isTeacher()?
       YES → Check if teacher owns this resource
               if (entity.getTeacher().getId().equals(teacherId))
                  return DTO (ACESSO PERMITIDO)
               else
                  throw RuntimeException("Access Denied") (BLOQUEADO)
       │
       NO → authorizationHelper.isStudent()?
             YES → Check if student is related
                    if (entity.getStudent().getId().equals(studentId))
                       return DTO (ACESSO PERMITIDO)
                    else
                       throw RuntimeException("Access Denied") (BLOQUEADO)
             │
             NO → throw RuntimeException("Unauthorized") (BLOQUEADO)
```

## Exemplo Concreto: Subject Service

```
USER ROLES:
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  ADMIN           │  │  TEACHER #5      │  │  STUDENT #2      │
│  email: admin@.. │  │  email: prof@...│  │  email: aluno@...│
│  role: ADMIN     │  │  role: TEACHER   │  │  role: STUDENT   │
└──────────────────┘  └──────────────────┘  └──────────────────┘
                              │ has Teacher entity #5
                              │
DATABASE:
┌─────────────────────────────────────────────────────────────┐
│  Subjects Table                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ID │ Name           │ Teacher_ID │ Description       │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ 1  │ Math           │ 5          │ Algebra           │  │
│  │ 2  │ Portuguese     │ 7          │ Literature        │  │
│  │ 3  │ History        │ 5          │ Europe 1900-2000  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

BEHAVIOR:
┌────────────────────────────────────────────────────────────┐
│ GET /api/subjects                                          │
├────────┬────────────────────────────────────────────────────┤
│ ADMIN  │ Returns: [Subject#1, Subject#2, Subject#3]       │
│        │ Query: SELECT * FROM subjects                     │
├────────┼────────────────────────────────────────────────────┤
│TEACHER │ Returns: [Subject#1, Subject#3] (only theirs)    │
│ #5     │ Query: SELECT * FROM subjects WHERE teacher_id=5 │
├────────┼────────────────────────────────────────────────────┤
│STUDENT │ Returns: [Subject#1] (only enrolled)             │
│ #2     │ Query: JOIN with enrollments WHERE student_id=2  │
└────────┴────────────────────────────────────────────────────┘

BEHAVIOR:
┌────────────────────────────────────────────────────────────┐
│ GET /api/subjects/2                                        │
├────────┬────────────────────────────────────────────────────┤
│ ADMIN  │ Returns: Subject#2 (Portuguese)                  │
├────────┼────────────────────────────────────────────────────┤
│TEACHER │ ERROR: 403 Forbidden                             │
│ #5     │ (Subject#2 belongs to Teacher#7, not #5)         │
├────────┼────────────────────────────────────────────────────┤
│STUDENT │ ERROR: 403 Forbidden                             │
│ #2     │ (Not enrolled in Subject#2)                      │
└────────┴────────────────────────────────────────────────────┘
```

## Segurança: Garantias Implementadas

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY GUARANTEES                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ ✓ Data Isolation by User                                   │
│   - Users never see other users' data by default            │
│   - Only ADMIN sees everything                              │
│                                                              │
│ ✓ Role-Based Access Control                                │
│   - Access checked at service level (business logic)        │
│   - Not just at controller/annotation level                 │
│                                                              │
│ ✓ Query Filtering (Defense in Depth)                       │
│   - Repositories return pre-filtered data via JPA queries   │
│   - Even if service logic is bypassed, DB returns filtered  │
│                                                              │
│ ✓ Granular Resource Ownership Checks                       │
│   - Each findById() verifies user owns the resource         │
│   - Teachers can't see other teachers' subjects             │
│   - Students can't see other students' grades               │
│                                                              │
│ ✓ No PII Leakage                                           │
│   - Passwords never returned in DTOs                        │
│   - Services map entities to DTOs explicitly                │
│                                                              │
│ ✓ Authorization Error Handling                             │
│   - Access denials throw RuntimeException                   │
│   - Consistent error responses across all endpoints         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Matriz de Acesso: Quem Pode Fazer O Quê

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        OPERATION × ROLE                                  │
├────────────────────────────────────────────────────────────────┬─────────┤
│                           ADMIN   TEACHER   STUDENT             │   VIEW  │
├────────────────────────────────────────────────────────────────┼─────────┤
│                                                                │         │
│ Subject:                                                     │         │
│ - findAll()                 ✓       ✓(own)      ✓(enrolled)  │ Filtered│
│ - findById()                ✓       ✓(own)      ✓(own)       │  Auth   │
│ - create()                  ✓       ✗           ✗            │         │
│ - update()                  ✓       ✓(own)      ✗            │         │
│ - patch()                   ✓       ✓(own)      ✗            │         │
│ - delete()                  ✓       ✓(own)      ✗            │         │
│                                                                │         │
│ Enrollment:                                                  │         │
│ - findAll()                 ✓       ✓(classes)  ✓(own)       │ Filtered│
│ - findById()                ✓       ✓(own)      ✓(own)       │  Auth   │
│ - enroll()                  ✓       ✗           ✗            │         │
│ - update()                  ✓       ✓(classes)  ✗            │         │
│ - patch()                   ✓       ✓(classes)  ✗            │         │
│ - delete()                  ✓       ✓(classes)  ✗            │         │
│                                                                │         │
│ Grade:                                                       │         │
│ - findAll()                 ✓       ✓(classes)  ✓(own)       │ Filtered│
│ - findById()                ✓       ✓(own)      ✓(own)       │  Auth   │
│ - create()                  ✓       ✓(classes)  ✗            │         │
│ - update()                  ✓       ✓(classes)  ✗            │         │
│ - patch()                   ✓       ✓(classes)  ✗            │         │
│ - delete()                  ✓       ✓(classes)  ✗            │         │
│                                                                │         │
│ SchoolClass:                                                 │         │
│ - findAll()                 ✓       ✓(own)      ✓(enrolled)  │ Filtered│
│ - findById()                ✓       ✓(own)      ✓(own)       │  Auth   │
│ - create()                  ✓       ✗           ✗            │         │
│ - update()                  ✓       ✗           ✗            │         │
│ - patch()                   ✓       ✗           ✗            │         │
│ - delete()                  ✓       ✗           ✗            │         │
│                                                                │         │
│ Student:                                                     │         │
│ - findAll()                 ✓       ✓(classes)  (self only)  │ Filtered│
│ - findById()                ✓       ✓(classes)  ✓(own)       │  Auth   │
│ - create()                  ✓       ✗           ✗            │         │
│ - delete()                  ✓       ✗           ✗            │         │
│                                                                │         │
│ Teacher:                                                     │         │
│ - findAll()                 ✓       (self only) ✗            │ Filtered│
│ - findById()                ✓       ✓(own)      ✗            │  Auth   │
│ - create()                  ✓       ✗           ✗            │         │
│ - update()                  ✓       ✓(own)      ✗            │         │
│ - patch()                   ✓       ✓(own)      ✗            │         │
│ - delete()                  ✓       ✗           ✗            │         │
│                                                                │         │
└──────────────────────────────────────────────────────────────┴─────────┘

Legend:
  ✓        = Permitido
  ✗        = Bloqueado (403 Forbidden)
  ✓(own)   = Permitido apenas de recursos que pertencem ao usuário
  ✓(classes) = Permitido apenas das classes/disciplinas relacionadas
  ✓(enrolled)= Permitido apenas em que está matriculado
  Filtered = Resultado filtrado por querybase na role
  Auth     = Autorização verificada em findById()
```
