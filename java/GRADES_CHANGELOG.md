# Grade System Refactoring - Changelog

## v2.0.0 - Brazilian Standard Grade System (Breaking Change)

### 📋 Overview
Complete refactor of the grade system to follow Brazilian educational standards:
- Changed from 3 exam structure (exam1, exam2, finalExam) to **8 notes (4 per semester)**
- Implemented automatic calculation of semester and final averages
- Added status tracking (APROVADO, RECUPERAÇÃO, REPROVADO, INCOMPLETO)

### ⚠️ Breaking Changes

#### Backend

**Grade Entity** (`domain/entities/Grade.java`)
| Old Field | New Fields | Note |
|-----------|-----------|------|
| `exam1` | `note1Semester1`, `note2Semester1`, `note3Semester1`, `note4Semester1` | 4 notes S1 |
| `exam2` | — | Removed |
| `finalExam` | `note1Semester2`, `note2Semester2`, `note3Semester2`, `note4Semester2` | 4 notes S2 |
| `average` | `averageSemester1`, `averageSemester2`, `finalAverage` | Auto-calculated |
| `status` | `status` (updated logic) | APROVADO / RECUPERAÇÃO / REPROVADO |

**GradeDTO** (`application/dtos/GradeDTO.java`)
- Same field changes as entity
- All fields properly mapped

**GradeService** (`application/services/GradeService.java`)
- `create()`: Now validates 8 notes instead of 3
- `update()`: Updates all 8 notes, auto-calculates averages
- `patch()`: Supports partial updates with auto-calculation
- `validateGradeNote()`: Simplified validation (0-10 range only)

**GradeController** (`controllers/GradeController.java`)
- Same endpoints, different payload structure
- All existing routes work with new structure

#### Frontend

**Types** (`src/types/index.ts`)
- **Old:**
  ```typescript
  interface Grade {
    studentId: number;
    subjectId: number;
    value: number;
  }
  ```
- **New:**
  ```typescript
  interface Grade {
    id?: number;
    enrollmentId: number;
    note1Semester1: number;
    note2Semester1: number;
    note3Semester1: number;
    note4Semester1: number;
    note1Semester2: number;
    note2Semester2: number;
    note3Semester2: number;
    note4Semester2: number;
    averageSemester1?: number;
    averageSemester2?: number;
    finalAverage?: number;
    status?: string;
  }
  ```

**Report Card Page** (`src/pages/students/report-card.tsx`)
- Complete redesign showing 8 notes in two grids (S1 and S2)
- Displays semester averages separately
- Shows final average with status indicator
- Added visual feedback (icons) for status

### 🔧 Modified Files

#### Backend Java
- `src/main/java/...domain/entities/Grade.java` ← **Entity refactored**
- `src/main/java/...application/dtos/GradeDTO.java` ← **DTO refactored**
- `src/main/java/...application/mappers/GradeMapper.java` ← **Mapper updated**
- `src/main/java/...application/services/GradeService.java` ← **Service refactored**
- `src/main/java/...infrastructure/seed/DatabaseSeeder.java` ← **Example data updated**

#### Frontend React/TypeScript
- `src/types/index.ts` ← **Interface updated**
- `src/services/gradeService.ts` ← **Service types aligned**
- `src/pages/students/report-card.tsx` ← **UI completely redesigned**

### 🗂️ New Documentation Files
- `GRADES_BRAZILIAN_STANDARD.md` ← **Complete specification**
- `MIGRATION_GUIDE.md` ← **Database migration instructions**

### 📊 Grade Calculation Changes

#### Old Logic
```
Average = (exam1 + exam2 + finalExam) / 3
Status = average >= 7 ? "APPROVED" : "FAILED"
```

#### New Logic
```
AvgS1 = (note1 + note2 + note3 + note4) / 4
AvgS2 = (note1 + note2 + note3 + note4) / 4
FinalAvg = (AvgS1 + AvgS2) / 2

Status =
  FinalAvg >= 7.0 → "APROVADO"
  5.0 ≤ FinalAvg < 7.0 → "RECUPERAÇÃO"
  FinalAvg < 5.0 → "REPROVADO"
  Incomplete → "INCOMPLETO"
```

### ✅ Testing

#### Backend Tests Updated
- `GradeServiceTest.java` needs refactoring for new grade structure
- Update test data to use 8 notes per grade

#### Frontend Tests Updated
- `report-card.test.tsx` (if exists) needs adjustment for new display format
- Mock data updated to match new Grade interface

### 🔄 Database Migration Required

**For existing systems**: See `MIGRATION_GUIDE.md` for detailed instructions.

**For new installations**: DatabaseSeeder automatically creates proper data structure.

### 🚀 Deployment Notes

1. **Backup your database** before deploying
2. Run migration scripts (see MIGRATION_GUIDE.md)
3. Clear browser cache to load new frontend
4. Test grade creation and viewing with new endpoint
5. Verify reports show correct semester averages

### 📝 API Endpoint Examples

#### Before (Old)
```bash
POST /api/grades
{
  "enrollmentId": 1,
  "exam1": 8.5,
  "exam2": 9.0,
  "finalExam": 8.7
}
```

#### After (New)
```bash
POST /api/grades
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

### 📚 Documentation

- Full specification: `GRADES_BRAZILIAN_STANDARD.md`
- Migration guide: `MIGRATION_GUIDE.md`
- This changelog: `GRADES_CHANGELOG.md`

### ⏳ Timeline

- **Affected Endpoints**: All /api/grades/* routes
- **Frontend Impact**: Report card page completely redesigned
- **Database Impact**: Schema changes required
- **Backward Compatibility**: ❌ NONE - This is a major version change

### 🔗 Related Issues/PRs
- Issue: Implement Brazilian grade standard
- PR: #XX - Grade system refactor

### Author
Refactoring completed: April 15, 2026

---

**⚠️ IMPORTANT**: This is a breaking change. Ensure all stakeholders are notified before deployment.
