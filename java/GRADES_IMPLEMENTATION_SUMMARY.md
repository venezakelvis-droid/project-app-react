# Refatoração do Sistema de Notas - Padrão Brasileiro

## 📋 Resumo das Mudanças

A aplicação foi refatorada para implementar o padrão brasileiro de avaliação:
- **2 semestres** por ano letivo
- **4 notas por semestre** (8 total por disciplina)
- **Cálculo automático** de médias
- **Status de aprovação** dinâmico: APROVADO, RECUPERAÇÃO, REPROVADO

---

## ✅ O Que Foi Implementado

### Backend (Java Spring Boot)

#### 1. **Entidade Grade Refatorada**
📁 `domain/entities/Grade.java`

**Campos Removidos:**
- `exam1`, `exam2`, `finalExam`, `average`

**Campos Adicionados:**
- `note1Semester1`, `note2Semester1`, `note3Semester1`, `note4Semester1`
- `note1Semester2`, `note2Semester2`, `note3Semester2`, `note4Semester2`
- `averageSemester1`, `averageSemester2`, `finalAverage` (calculados)

**Novos Métodos:**
- `calculateAverages()`: Calcula automaticamente todas as médias e atualiza status
- `hasAllSemester1Notes()`: Valida se semestre 1 está completo
- `hasAllSemester2Notes()`: Valida se semestre 2 está completo

#### 2. **GradeDTO Atualizado**
📁 `application/dtos/GradeDTO.java`

Mesma estrutura da entidade, com 8 campos de nota + 3 de média calculada.

#### 3. **GradeMapper Refatorado**
📁 `application/mappers/GradeMapper.java`

- Mapeia todos os 8 campos corretamente
- Chama `calculateAverages()` automaticamente ao converter para entidade

#### 4. **GradeService Refatorado**
📁 `application/services/GradeService.java`

**Métodos Atualizados:**
- `create()`: Valida 8 notas, cria grade com cálculos automáticos
- `update()`: Atualiza todas as notas, recalcula médias
- `patch()`: Atualiza notas individuais, recalcula médias
- `findByStudentId()`: Retorna notas do aluno com RBAC

**Validações:**
- Cada nota deve estar entre 0 e 10
- Cálculos são automáticos e nunca aceita valores pre-calculados
- RBAC: Alunos veem só suas notas, professores suas disciplinas, admin vê tudo

#### 5. **DatabaseSeeder Atualizado**
📁 `infrastructure/seed/DatabaseSeeder.java`

5 grades de exemplo com dados realistas:
- Cada grade tem 8 notas diferentes
- Cálculos pré-calculados corretamente
- Demonstra diferentes cenários de aprovação

### Frontend (React + TypeScript)

#### 1. **Tipo Grade Atualizado**
📁 `src/types/index.ts`

```typescript
interface Grade {
  id?: number;
  enrollmentId: number;
  // 8 notas
  note1Semester1: number;
  note2Semester1: number;
  note3Semester1: number;
  note4Semester1: number;
  note1Semester2: number;
  note2Semester2: number;
  note3Semester2: number;
  note4Semester2: number;
  // Cálculos
  averageSemester1?: number;
  averageSemester2?: number;
  finalAverage?: number;
  status?: string;
}
```

#### 2. **Página de Boletim Redesenhada**
📁 `src/pages/students/report-card.tsx`

**Exibe:**
- Notas do 1º semestre em grid (4 colunas)
- Média do 1º semestre destacada
- Notas do 2º semestre em grid (4 colunas)
- Média do 2º semestre destacada
- Média final em destaque
- Status com cores e ícones (✓ Verde, ⚠ Amarelo, ✗ Vermelho)

**Responsivo:**
- Layout em coluna em mobile
- Grid 4 colunas em desktop

---

## 📊 Cálculos de Média

### Fórmulas Implementadas

```
Média Semestre 1 = (nota1 + nota2 + nota3 + nota4) / 4
Média Semestre 2 = (nota1 + nota2 + nota3 + nota4) / 4
Média Final = (Média S1 + Média S2) / 2
```

### Status de Aprovação

| Status | Critério | Cor |
|--------|----------|-----|
| **APROVADO** | Média Final ≥ 7.0 | Verde ✓ |
| **RECUPERAÇÃO** | 5.0 ≤ Média Final < 7.0 | Amarelo ⚠ |
| **REPROVADO** | Média Final < 5.0 | Vermelho ✗ |
| **INCOMPLETO** | Sem todas as 8 notas | Cinza |

---

## 🔄 Dados de Exemplo

5 alunos criados com notas realistas:

1. **Ana Costa** (S1: 8.5, S2: 8.25) → Final: 8.375 ✓ APROVADO
2. **Bruno Ferreira** (S1: 9.0, S2: 6.25) → Final: 7.625 ✓ APROVADO
3. **Aluno 3** (S1: 7.25, S2: 8.0) → Final: 7.625 ✓ APROVADO
4. **Aluno 4** (S1: 9.0, S2: 5.25) → Final: 7.125 ✓ APROVADO
5. **Aluno 5** (S1: 8.25, S2: 7.25) → Final: 7.75 ✓ APROVADO

---

## 🔐 Controle de Acesso (RBAC)

Implementado em `GradeService`:

- **STUDENT**: Vê apenas suas notas
- **TEACHER**: Vê notas de suas disciplinas
- **ADMIN**: Vê todas as notas

---

## 📚 Documentação Adicionada

| Arquivo | Conteúdo |
|---------|----------|
| `GRADES_BRAZILIAN_STANDARD.md` | Especificação completa do sistema |
| `GRADES_CHANGELOG.md` | Lista detalhada de mudanças |
| `MIGRATION_GUIDE.md` | Guia para migrar dados antigos |

---

## ⚠️ Breaking Changes

Esta é uma mudança **MAJOR** no sistema:

- ❌ Não é compatível com versão anterior
- ❌ Dados antigos (exam1, exam2, finalExam) precisam ser migrados
- ✅ Novo DatabaseSeeder cria dados corretos automaticamente

**Para Sistemas Existentes:**
1. Backup do banco de dados
2. Seguir `MIGRATION_GUIDE.md`
3. Testar gradesAPI antes de put em produção
4. Treinar usuários na nova interface

---

## 🧪 Como Testar

### Backend - Criar Nota via API

```bash
curl -X POST http://localhost:8081/api/grades \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "enrollmentId": 1,
    "note1Semester1": 8.5,
    "note2Semester1": 9.0,
    "note3Semester1": 8.5,
    "note4Semester1": 9.0,
    "note1Semester2": 8.0,
    "note2Semester2": 8.5,
    "note3Semester2": 8.0,
    "note4Semester2": 8.5
  }'
```

**Response Esperado:**
```json
{
  "id": 1,
  "enrollmentId": 1,
  "note1Semester1": 8.5,
  ...
  "averageSemester1": 8.75,
  "averageSemester2": 8.25,
  "finalAverage": 8.5,
  "status": "APROVADO"
}
```

### Frontend - Visualizar Boletim

1. Login como `ana@email.com` / `12345678` (Aluno)
2. Navegue para Dashboard do Aluno
3. Clique em "Ver Boletim"
4. Veja 8 notas organizadas por semestre
5. Compare com médias e status

---

## 🔧 Estrutura de Arquivos

```
Backend (Java):
├── domain/entities/Grade.java ........................ REFATORADO
├── application/dtos/GradeDTO.java ................... REFATORADO
├── application/mappers/GradeMapper.java ............ ATUALIZADO
├── application/services/GradeService.java ......... REFATORADO
├── controllers/GradeController.java ............... (sem mudanças)
└── infrastructure/seed/DatabaseSeeder.java ........ ATUALIZADO

Frontend (React):
├── src/types/index.ts .............................. ATUALIZADO
├── src/services/gradeService.ts ................... (sem mudanças maciças)
├── src/hooks/useGrades.ts .......................... (compatível)
└── src/pages/students/report-card.tsx ............ REDESENHADA

Documentação:
├── GRADES_BRAZILIAN_STANDARD.md ................... ✨ NOVO
├── GRADES_CHANGELOG.md ............................. ✨ NOVO
└── MIGRATION_GUIDE.md .............................. ✨ NOVO
```

---

## 📝 Notas Importantes

1. **Cálculos Automáticos**: O método `calculateAverages()` é chamado automaticamente pelo mapper e deve ser chamado manualmente após atualizações.

2. **Validação de Valores**: Todas as 8 notas são validadas para estar entre 0 e 10. Valores fora deste range lançam `GradeInvalidException`.

3. **Null Safety**: Se alguma nota for null, a média do semestre será null até que todas as 4 notas sejam preenchidas.

4. **Status Incompleto**: Grades com notas incompletas recebem status "INCOMPLETO" até que todas as 8 notas estejam preenchidas.

---

## 🚀 Próximas Melhorias

- [ ] Suporte a avaliação de recuperação/exame final
- [ ] Histórico de semestres anteriores
- [ ] Gráficos de evolução por disciplina
- [ ] Alertas para alunos em recuperação
- [ ] Relatórios em PDF
- [ ] Integração com sistema de faltas

---

## ✅ Status da Implementação

- [x] Refatoração da entidade Grade
- [x] Refatoração do GradeDTO
- [x] Refatoração do GradeMapper
- [x] Refatoração do GradeService
- [x] Atualização do DatabaseSeeder
- [x] Refatoração da página de boletim
- [x] Atualização dos tipos TypeScript
- [x] Implementação de RBAC
- [x] Validação de grades
- [x] Cálculos automáticos
- [x] Documentação completa
- [x] Guia de migração

---

**Última Atualização**: Abril 15, 2026
