# Controle de Acesso por Usuário - Implementação RBAC

## 📋 Resumo

Implementação completa de controle de acesso baseado em roles (RBAC) no backend Spring Boot com três níveis de permissão: **ADMIN**, **TEACHER** e **STUDENT**.

## 🔐 Estrutura de Autorização

### Roles Implementadas

- **ADMIN**: Acesso total a todos os recursos sem filtros
- **TEACHER**: Acesso apenas a disciplinas, turmas e matrículas relacionadas a suas disciplinas
- **STUDENT**: Acesso apenas aos dados relacionados a si mesmo (matrículas e notas)

## 🛠️ Componentes Criados

### 1. **SecurityUtils** 
**Arquivo**: `infrastructure/security/SecurityUtils.java`

Classe utilitária que obtém informações do usuário logado via `SecurityContext`:
```java
// Métodos principais:
- getCurrentUserEmail(): Obtém e-mail do usuário logado
- hasRole(String role): Verifica se tem role específica
- isAdmin(): Verifica se é ADMIN
- isTeacher(): Verifica se é TEACHER
- isStudent(): Verifica se é STUDENT
```

### 2. **AuthorizationHelper**
**Arquivo**: `application/utils/AuthorizationHelper.java`

Centraliza toda a lógica de autorização:
```java
// Métodos principais:
- getCurrentUser(): Retorna User logado
- getCurrentUserAsTeacher(): Retorna Teacher do usuário logado
- getCurrentUserAsStudent(): Retorna Student do usuário logado
- getCurrentTeacherId(): Retorna ID do Teacher
- getCurrentStudentId(): Retorna ID do Student
- isAdmin() / isTeacher() / isStudent(): Verificações de role
```

## 📊 Repositories Atualizados

### SubjectRepository
- ✅ `findByTeacherId(Long teacherId)` - Already existed

### EnrollmentRepository  
- ✅ `findByStudentId(Long studentId)` - Already existed

### GradeRepository
- ✅ `findByEnrollmentStudentId(Long studentId)` - Already existed

### SchoolClassRepository
- ✅ **NEW** `findByTeacherId(Long teacherId)` - Busca turmas de um professor via Enrollment → Subject
- ✅ **NEW** `findByStudentId(Long studentId)` - Busca turmas de um estudante via Enrollment

### StudentRepository
- ✅ `findByCpf(String cpf)` - Already existed
- ✅ **NEW** `findByUserId(Long userId)` - Busca estudante pelo User ID
- ✅ `existsByCpf(String cpf)` - Already existed

## 🔄 Lógica de Controle de Acesso por Service

### SubjectService
```
findAll():
  ✓ ADMIN → repository.findAll()
  ✓ TEACHER → repository.findByTeacherId(userTeacherId)
  ✓ STUDENT → filtra disciplinas em que está matriculado

findById(id):
  ✓ ADMIN → retorna qualquer disciplina
  ✓ TEACHER → ERROR se não for sua disciplina
  ✓ STUDENT → ERROR se não estiver matriculado

update() / patch() / delete():
  ✓ ADMIN → pode fazer tudo
  ✓ TEACHER → pode fazer apenas suas próprias disciplinas
  ✓ STUDENT → ERROR (sem permissão)
```

### EnrollmentService
```
findAll():
  ✓ ADMIN → repository.findAll()
  ✓ TEACHER → filtra matrículas de suas disciplinas
  ✓ STUDENT → repository.findByStudentId(userStudentId)

findById(id):
  ✓ ADMIN → retorna qualquer matrícula
  ✓ TEACHER → ERROR se matrícula não é de suas disciplinas
  ✓ STUDENT → ERROR se matrícula não é sua

update() / patch() / delete():
  ✓ ADMIN → pode fazer tudo
  ✓ TEACHER → pode fazer apenas de suas disciplinas
  ✓ STUDENT → ERROR (sem permissão)
```

### GradeService
```
findAll():
  ✓ ADMIN → repository.findAll()
  ✓ TEACHER → filtra notas de suas disciplinas
  ✓ STUDENT → repository.findByEnrollmentStudentId(userStudentId)

findById(id):
  ✓ ADMIN → retorna qualquer nota
  ✓ TEACHER → ERROR se não está em suas disciplinas
  ✓ STUDENT → ERROR se não é sua nota

update() / patch() / delete():
  ✓ ADMIN → pode fazer tudo
  ✓ TEACHER → pode fazer apenas de suas disciplinas
  ✓ STUDENT → ERROR (sem permissão)
```

### SchoolClassService
```
findAll():
  ✓ ADMIN → repository.findAll()
  ✓ TEACHER → repository.findByTeacherId(userTeacherId)
  ✓ STUDENT → repository.findByStudentId(userStudentId)

findById(id):
  ✓ ADMIN → retorna qualquer turma
  ✓ TEACHER → ERROR se não leciona na turma
  ✓ STUDENT → ERROR se não está matriculado

update() / patch() / delete():
  ✓ ADMIN → pode fazer tudo
  ✓ TEACHER / STUDENT → ERROR (sem permissão)
```

### StudentService
```
findAll():
  ✓ ADMIN → repository.findAll()
  ✓ TEACHER → filtra estudantes de suas disciplinas
  ✓ STUDENT → retorna apenas a si mesmo

findById(id):
  ✓ ADMIN → retorna qualquer estudante
  ✓ TEACHER → ERROR se não está em suas disciplinas
  ✓ STUDENT → ERROR se não é a si mesmo

delete():
  ✓ ADMIN → pode deletar
  ✓ TEACHER / STUDENT → ERROR (sem permissão)
```

### TeacherService
```
findAll():
  ✓ ADMIN → repository.findAll()
  ✓ TEACHER → retorna apenas a si mesmo
  ✓ STUDENT → ERROR (sem permissão)

findById(id):
  ✓ ADMIN → retorna qualquer professor
  ✓ TEACHER → ERROR se não é a si mesmo
  ✓ STUDENT → ERROR (sem permissão)

update() / patch():
  ✓ ADMIN → pode fazer tudo
  ✓ TEACHER → pode atualizar apenas a si mesmo
  ✓ STUDENT → ERROR (sem permissão)

delete():
  ✓ ADMIN → pode deletar
  ✓ TEACHER / STUDENT → ERROR (sem permissão)
```

## 🚀 Fluxo de Funcionamento

1. **Request chega ao Controller**
   - Controller injeta o Service correspondente

2. **Service obtém informações do usuário**
   - Chama `authorizationHelper.getCurrentUser()`
   - Chama `authorizationHelper.isAdmin()` / `isTeacher()` / `isStudent()`

3. **Service aplica filtro data-driven**
   - Se ADMIN: retorna todos
   - Se TEACHER: filtra por teacherId via repository
   - Se STUDENT: filtra por studentId via repository

4. **Acesso granular é verificado**
   - Se tentar acessar recurso que não pertence a si, lança `RuntimeException`
   - Garante que dados de outros usuários nunca são expostos

## ✅ Garantias de Segurança

- ✓ Nenhum usuário pode acessar dados de outro usuário (exceto ADMIN)
- ✓ Nenhum Teacher vê dados de outro Teacher (cada um vê só suas disciplinas)
- ✓ Nenhum Student pode listar/editar/deletar outros dados
- ✓ ADMIN tem controle total e pode fazer qualquer operação
- ✓ Todas as queries estão centralizadas nos Services
- ✓ Repositories retornam dados filtrados por role

## 🔌 Integração com Spring Security

A autenticação é feita via JWT (JwtAuthenticationFilter) que popula o SecurityContext com:
- Email do usuário (username)
- Roles extraídas da base (via CustomUserDetailsService)

O `SecurityUtils` lê essas informações do SecurityContext a cada requisição.

## 📝 Exemplo de Uso

```java
// Em qualquer Service injetado:
@Service
@RequiredArgsConstructor
public class MeuService {
    private final AuthorizationHelper authorizationHelper;
    
    public List<MeuDTO> findAll() {
        // Automaticamente filtra baseado na role do usuário
        if (authorizationHelper.isAdmin()) {
            // retorna tudo
        } else if (authorizationHelper.isTeacher()) {
            Long teacherId = authorizationHelper.getCurrentTeacherId();
            // retorna dados do teacher
        } else if (authorizationHelper.isStudent()) {
            Long studentId = authorizationHelper.getCurrentStudentId();
            // retorna dados do student
        }
    }
}
```

## 🧪 Teste Manual

```bash
# Setup de teste:
1. Criar ADMIN user na base
2. Criar TEACHER user + Teacher entity
3. Criar STUDENT user + Student entity

# Testar como ADMIN:
GET /api/subjects → retorna todas disciplinas

# Testar como TEACHER:
GET /api/subjects → retorna apenas suas disciplinas

# Testar como STUDENT:
GET /api/subjects → retorna disciplinas em que está matriculado
GET /api/subjects/{outroTeacher} → 403 Forbidden
```

## 📦 Arquivos Alterados

- `infrastructure/security/SecurityUtils.java` - **NOVO**
- `application/utils/AuthorizationHelper.java` - **NOVO**
- `infrastructure/repositories/SchoolClassRepository.java` - **ATUALIZADO**
- `infrastructure/repositories/StudentRepository.java` - **ATUALIZADO**
- `application/services/SubjectService.java` - **ATUALIZADO**
- `application/services/EnrollmentService.java` - **ATUALIZADO**
- `application/services/GradeService.java` - **ATUALIZADO**
- `application/services/SchoolClassService.java` - **ATUALIZADO**
- `application/services/StudentService.java` - **ATUALIZADO**
- `application/services/TeacherService.java` - **ATUALIZADO**
