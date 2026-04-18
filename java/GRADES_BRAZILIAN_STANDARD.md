# Estrutura de Notas - Padrão Brasileiro

## Visão Geral

O sistema foi refatorado para seguir o padrão brasileiro de avaliação escolar:
- **2 semestres** por ano letivo
- **4 notas por semestre** por disciplina
- **Total de 8 notas por disciplina** por ano

## Cálculo de Médias

### Média por Semestre
```
Média Semestre 1 = (Nota1 + Nota2 + Nota3 + Nota4) / 4
Média Semestre 2 = (Nota1 + Nota2 + Nota3 + Nota4) / 4  
```

### Média Final
```
Média Final = (Média Semestre 1 + Média Semestre 2) / 2
```

## Status de Aprovação

| Status | Critério | Significado |
|--------|----------|------------|
| **APROVADO** | Média Final ≥ 7.0 | Aluno aprovado na disciplina |
| **RECUPERAÇÃO** | 5.0 ≤ Média Final < 7.0 | Aluno precisa recuperação/exame final |
| **REPROVADO** | Média Final < 5.0 | Aluno reprovado na disciplina |
| **INCOMPLETO** | Sem todas as 8 notas | Ainda não há notas suficientes |

## Entidades Backend

### Grade Entity
Localização: `src/main/java/school_app/project/demo/domain/entities/Grade.java`

Campos:
- `note1Semester1` até `note4Semester1`: 4 notas do primeiro semestre
- `note1Semester2` até `note4Semester2`: 4 notas do segundo semestre
- `averageSemester1`, `averageSemester2`: Médias calculadas
- `finalAverage`: Média final calculada
- `status`: Status de aprovação (APROVADO, RECUPERAÇÃO, REPROVADO, INCOMPLETO)
- `enrollment`: Relação com a matrícula do aluno

**Método importante**: `calculateAverages()`
- Calcula automaticamente todas as médias quando chamado
- Atualiza o status baseado na média final
- Deve ser chamado antes de persistir a entidade

### GradeDTO
Localização: `src/main/java/school_app/project/demo/application/dtos/GradeDTO.java`

Contém os mesmos campos da entidade para transferência de dados pela API.

### GradeMapper
Localização: `src/main/java/school_app/project/demo/application/mappers/GradeMapper.java`

Responsável por converter entre `Grade` (entity) e `GradeDTO` (DTO).

## Serviços Backend

### GradeService
Localização: `src/main/java/school_app/project/demo/application/services/GradeService.java`

**Métodos principais:**
- `create(GradeDTO)`: Cria nova nota com validação de valores
- `findByStudentId(Long)`: Retorna todas as notas de um aluno
- `update(Long, GradeDTO)`: Atualiza todas as 8 notas
- `patch(Long, GradeDTO)`: Atualiza parcialmente notas individuais
- `delete(Long)`: Remove nota
- `validateGradeNote()`: Valida se nota está entre 0 e 10

**Validações:**
- Apenas valores entre 0 e 10 são aceitos
- Cálculos são automáticos (não aceita valores pré-calculados)
- Controles de acesso: 
  - Alunos veem apenas suas notas
  - Professores veem notas de suas disciplinas
  - Admins veem todas as notas

## Controlador

### GradeController
Localização: `src/main/java/school_app/project/demo/controllers/GradeController.java`

**Endpoints:**
- `POST /api/grades`: Criar nota
- `GET /api/grades/{id}`: Buscar nota por ID
- `GET /api/grades`: Listar todas (com filtros por role)
- `GET /api/grades/student`: Buscar notas do aluno autenticado
- `PUT /api/grades/{id}`: Atualizar nota
- `PATCH /api/grades/{id}`: Atualizar parcialmente
- `DELETE /api/grades/{id}`: Deletar nota

## Frontend

### ReportCard Page
Localização: `src/pages/students/report-card.tsx`

**Exibe:**
- 4 notas do 1º semestre com cálculo de média
- 4 notas do 2º semestre com cálculo de média  
- Média final
- Status de aprovação com ícone visual
- Interface responsiva em grid

**Cores de Status:**
- Verde (✓): APROVADO
- Amarelo (⚠): RECUPERAÇÃO
- Vermelho (✗): REPROVADO

### Types
Localização: `src/types/index.ts`

Interface `Grade` define estrutura de dados com os 8 campos de nota e campos calculados.

## Dados de Exemplo

O DatabaseSeeder cria 5 alunos com notas de exemplo:

1. **Aluno 1 (Ana)**
   - S1: [8.5, 8.5, 8.5, 8.5] = 8.5
   - S2: [8.0, 8.5, 8.0, 8.5] = 8.25
   - Média Final: **8.375** → **APROVADO**

2. **Aluno 2 (Bruno)**
   - S1: [9.0, 9.0, 9.0, 9.0] = 9.0
   - S2: [6.0, 6.5, 6.0, 6.5] = 6.25
   - Média Final: **7.625** → **APROVADO**

3. **Aluno 3**
   - S1: [7.0, 7.0, 7.5, 7.5] = 7.25
   - S2: [8.0, 8.0, 8.0, 8.0] = 8.0
   - Média Final: **7.625** → **APROVADO**

4. **Aluno 4**
   - S1: [9.0, 9.0, 9.0, 9.0] = 9.0
   - S2: [5.0, 5.5, 5.0, 5.5] = 5.25
   - Média Final: **7.125** → **APROVADO**

5. **Aluno 5**
   - S1: [8.5, 8.0, 8.5, 8.0] = 8.25
   - S2: [7.0, 7.5, 7.0, 7.5] = 7.25
   - Média Final: **7.75** → **APROVADO**

## Exemplo de Request API

### Criar Nota (POST)
```json
{
  "enrollmentId": 1,
  "note1Semester1": 8.5,
  "note2Semester1": 9.0,
  "note3Semester1": 8.5,
  "note4Semester1": 9.0,
  "note1Semester2": 8.0,
  "note2Semester2": 8.5,
  "note3Semester2": 8.0,
  "note4Semester2": 8.5
}
```

### Response (com cálculos automáticos)
```json
{
  "id": 1,
  "enrollmentId": 1,
  "note1Semester1": 8.5,
  "note2Semester1": 9.0,
  "note3Semester1": 8.5,
  "note4Semester1": 9.0,
  "note1Semester2": 8.0,
  "note2Semester2": 8.5,
  "note3Semester2": 8.0,
  "note4Semester2": 8.5,
  "averageSemester1": 8.75,
  "averageSemester2": 8.25,
  "finalAverage": 8.5,
  "status": "APROVADO"
}
```

## Validações

- ✅ Todas as 8 notas devem estar entre 0 e 10
- ✅ Cálculos são automáticos e transparentes
- ✅ Não é possível definir valores de média manualmente
- ✅ Status é determinado automaticamente
- ✅ Validação de acesso por role (STUDENT, TEACHER, ADMIN)

## Notas de Implementação

1. **Sem compatibilidade com versão anterior**: Este é um breaking change. Dados de notas anteriores precisam ser migrados manualmente.

2. **Cálculos automáticos**: Use sempre o método `calculateAverages()` da entidade antes de persistir.

3. **Validação no mapper**: O `GradeMapper.toEntity()` já chama `calculateAverages()` automaticamente.

4. **Null-safety**: Se alguma das 8 notas for null, a média daquele semestre será null até que todas forem preenchidas.

## Futuras Melhorias

- [ ] Suporte a exame final/recuperação (prova adicional)
- [ ] Comparação com histórico de semestres anteriores
- [ ] Alertas automáticos para alunos em recuperação
- [ ] Relatório de desempenho por semestre
- [ ] Gráficos de evolução por disciplina
