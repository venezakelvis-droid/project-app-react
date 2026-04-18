# RBAC Implementation - School App

## ✅ Implementação Completa

### Backend (Spring Boot)

#### 1. Entidades Criadas
- **User**: Usuário com token (email, senha hasheada, roles)
- **Role**: Papéis (ADMIN, TEACHER, STUDENT)
- Relação Many-to-Many entre User e Role

#### 2. Segurança - Spring Security
- **JWT Token**: Implementado com `jjwt`
- **PasswordEncoder**: BCryptPasswordEncoder para senhas
- **Autenticação**: CustomUserDetailsService carrega usuários do banco

#### 3. Autenticações e Autorização
- **POST /api/auth/login**: Autentica e retorna JWT + role
- **JwtAuthenticationFilter**: Valida tokens em requisições
- **SecurityConfig**: Regras de acesso por endpoint

#### 4. Regras de Acesso (RBAC)
```
ADMIN:
  - GET /api/students (todos)
  - POST /api/students
  - DELETE /api/students/{id}
  - POST /api/grades
  - POST /api/enrollments

TEACHER:
  - GET /api/subjects/teacher (suas disciplinas)
  - POST /api/grades
  - POST /api/enrollments

STUDENT:
  - GET /api/students/{id} (somente a si mesmo)
  - GET /api/enrollments/student (suas matrículas)
  - GET /api/grades/student (suas notas)
```

#### 5. Dados de Seeding
- Admin: `admin@gmail.com` / `12345678`
- Teacher: `joao@email.com` / `12345678`
- Student: `ana@email.com` / `12345678`

### Frontend (React)

#### 1. Autenticação
- LoginPage integrada com endpoint `/api/auth/login`
- Token armazenado em localStorage
- AuthContext gerencia estado de user

#### 2. Proteção de Rotas
- ProtectedRoute valida token e role antes de acessar
- Redirecionamento automático se role não permitida

#### 3. Navegação Condicional (Navbar)
- Links específicos por role
- Admin: Dashboard, Alunos, Professores
- Teacher: Dashboard, Minhas Disciplinas, Lançar Notas
- Student: Dashboard, Minhas Matrículas, Meu Desempenho

#### 4. Interceptore de API
- Todos os requests incluem `Authorization: Bearer {token}`
- Tratamento de erros 401

## 🔧 Configuração Local

### Backend
```bash
# Porta: 8081
# BD: H2 (em memória)
# URL: http://localhost:8081/api
```

### Frontend
```bash
# Porta: 5173
# URL: http://localhost:5173
# API: http://localhost:8081/api
```

## 📝 Endpoints Principais

### Autenticação
- `POST /api/auth/login` - Login com email/senha

### Alunos (RBAC)
- `GET /api/students` - Lista (ADMIN/TEACHER)
- `GET /api/students/{id}` - Detalhes (ADMIN/TEACHER ou STUDENT a si mesmo)
- `POST /api/students` - Criar (ADMIN)
- `DELETE /api/students/{id}` - Deletar (ADMIN)

### Disciplinas
- `GET /api/subjects/teacher` - Disciplinas do professor (TEACHER)
- `POST /api/subjects` - Criar disciplina (ADMIN/TEACHER)

### Matrículas
- `POST /api/enrollments` - Matricular aluno (ADMIN/TEACHER)
- `GET /api/enrollments/student` - Minhas matrículas (STUDENT)

### Notas
- `POST /api/grades` - Lançar nota (ADMIN/TEACHER)
- `GET /api/grades/student` - Minhas notas (STUDENT)

## 🚀 Próximos Passos

1. Implementar endpoints GET specificos para cada role
2. Adicionar refresh token
3. Implementar auditoria de operações
4. Melhorar UI dos dashboards por role
5. Validação frontend + backend mais robusta
6. Testes integration e unitários

## 🛡️ Segurança

✅ Senhas hasheadas (BCrypt)
✅ JWTs com expiração
✅ CORS configurado
✅ Validação de permissões em cada endpoint
✅ Proteção de rotas no frontend
✅ Validação de role no backend

Está tudo pronto para uso!
