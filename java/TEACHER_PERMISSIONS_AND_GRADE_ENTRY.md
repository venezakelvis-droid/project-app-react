# Teacher Permissions & Class-Based Grade Entry

## Overview

This document describes the updated teacher permissions system and the improved class-based grade entry workflow implemented for the School Buddy application.

## Teacher Permissions

### What Teachers CAN Do
- **Grade Students**: Teachers can enter grades for students in their classes through the improved grade entry interface
- **View Their Classes**: Teachers can view all classes they are assigned to teach
- **View Students in Their Classes**: Teachers can view students enrolled in their classes
- **View Subjects They Teach**: Teachers can view subjects they are assigned to teach in specific classes

### What Teachers CANNOT Do
- **Delete Students**: Teachers cannot delete student records (HTTP 403 - requires ADMIN role)
- **Delete Subjects**: Teachers cannot delete subject records (HTTP 403 - requires ADMIN role)
- **Modify Other Teachers' Data**: Teachers can only view and modify their own profile data

### Permission Enforcement
Permissions are enforced at two levels:

1. **HTTP Security Layer** (`SecurityConfig.java`):
   ```
   DELETE /api/students/** → ADMIN only
   DELETE /api/subjects/** → ADMIN only
   ```

2. **Service Layer** (`TeacherService.java`, `SubjectService.java`):
   - Authorization checks in service methods
   - Database queries filtered by teacher context

## Class Structure (Turma)

### Entity Relationships

```
Teacher (1) ──────→ (Many) SchoolClass
                          ↓
                        (Has Students)
                          ↓
                   (Many) Student

Subject ──→ Teacher
              ↓
        (Taught in Class via Enrollment)

Enrollment
├── Student
├── Subject (which has a Teacher)
└── SchoolClass
```

### Key Relationships

- **Teacher → SchoolClass (1:N)**: A teacher is assigned to one or more classes
- **SchoolClass → Student (1:N)**: A class contains multiple students
- **Enrollment**: Links students to subjects within a class

## Grade Entry Workflow

### New Grade Entry Flow

The improved grade entry interface follows this workflow:

1. **Select Class (Turma)**
   - Teachers select one of their assigned classes
   - Classes are filtered by the logged-in teacher's ID

2. **Select Student (Aluno)**
   - After selecting a class, the system loads all students in that class
   - Students are listed with their names for easy selection

3. **Select Subject (Disciplina)**
   - Subjects are filtered to show only:
     - Subjects taught by the logged-in teacher
     - AND that are taught in the selected class
   - Endpoint: `GET /subjects/teacher/{teacherId}/class/{classId}`

4. **Select Semester (Semestre)**
   - Choose between 1st or 2nd semester

5. **Enter 4 Grades**
   - Enter 4 individual grades for the semester
   - Each grade must be between 0.0 and 10.0
   - Grades are labeled as Nota 1, Nota 2, Nota 3, Nota 4
   - These correspond to:
     - Note1Semester1/2
     - Note2Semester1/2
     - Note3Semester1/2
     - Note4Semester1/2

6. **Submit**
   - Grades are saved with the appropriate semester designation
   - The system automatically:
     - Calculates semester averages: (N1+N2+N3+N4)/4
     - Calculates final average: (Avg_Sem1 + Avg_Sem2)/2
     - Assigns status: APROVADO (≥7), RECUPERAÇÃO (5-6.9), REPROVADO (<5)

### UI/UX Improvements

- **No ID Inputs**: Students no longer enter ID numbers; all selection is through dropdowns
- **Filtered Lists**: Dropdowns show only relevant items based on previous selections
- **Real-time Validation**: Form validates:
  - All fields are filled
  - Grades are within valid range (0-10)
  - Teacher has access to the selected class
- **Clear Feedback**: Users see success/error messages with helpful guidance

## New API Endpoints

### Class Management
```
GET /api/teachers/{teacherId}/classes
  → Get all classes for a specific teacher
  → Response: SchoolClass[]

GET /api/classes/{classId}/students
  → Get all students in a class
  → Response: Student[]
  → Authorization: ADMIN, teacher of the class, or student in the class
```

### Subject Filtering
```
GET /api/subjects/teacher/{teacherId}/class/{classId}
  → Get subjects taught by a teacher in a specific class
  → Response: Subject[]
```

## Backend Changes

### Services Updated
1. **TeacherService.java**
   - Added `getClassesByTeacherId(Long teacherId)` method

2. **SchoolClassService.java**
   - Added `getStudentsByClassId(Long classId)` method
   - Added authorization checks for student list access

3. **SubjectService.java**
   - Added `findByTeacherAndClass(Long teacherId, Long classId)` method
   - Updated `delete()` to enforce admin-only deletion

### Controllers Updated
1. **TeacherController.java**
   - Added `GET /teachers/{id}/classes` endpoint

2. **SchoolClassController.java**
   - Added `GET /classes/{id}/students` endpoint

3. **SubjectController.java**
   - Added `GET /subjects/teacher/{teacherId}/class/{classId}` endpoint

### Repositories Updated
1. **SubjectRepository.java**
   - Added `findByTeacherAndClass()` query method

2. **StudentRepository.java**
   - Added `findBySchoolClassId()` query method

### Security Configuration
- Updated `SecurityConfig.java` to restrict DELETE on subjects to ADMIN only
- HTTP-level enforcement prevents unauthorized deletion

## Frontend Changes

### New Hooks
Created three new React hooks for managing grade entry data:

1. **useClassesByTeacher(teacherId)**
   - Fetches all classes for a given teacher
   - Auto-triggers when teacherId changes

2. **useStudentsByClass(classId)**
   - Fetches all students in a given class
   - Auto-triggers when classId changes

3. **useSubjectsByTeacherAndClass(teacherId, classId)**
   - Fetches all subjects a teacher teaches in a specific class
   - Auto-triggers when either parameter changes

### Updated Components
1. **GradeForm.tsx**
   - Completely refactored with select dropdowns
   - Implements the new class → student → subject workflow
   - Handles 4-grade input per semester
   - Real-time validation and error handling
   - Fetches current teacher from API

2. **classService.ts**
   - Added three new service methods for API communication

3. **enrollmentService.ts**
   - Added `getByStudentAndSubject()` method

## Database Seeding

The seeding has been updated to create realistic data:

### Teachers
- **João Silva** (t1): Teaches Mathematics and History
  - Class 1A (1º Semestre) - teaches Math
  - Class 2A (2º Semestre) - teaches Math and History

- **Maria Santos** (t2): Teaches Portuguese and Geography
  - Class 1B (1º Semestre) - teaches Portuguese
  - (Also involved in other classes)

- **Pedro Oliveira** (t3): Teaches Science
  - Available for Science classes

### Classes
- **1A**: 2 students (st1, st2), teachers: t1, t2, t3
- **1B**: 2 students (st3, st4), teachers: t2, t3
- **2A**: 1 student (st5), teacher: t1

### Enrollments
All enrollments include subjects taught by the respective teachers in each class.

## Testing the Implementation

### Manual Testing Checklist

1. **Permission Testing**
   - [ ] As Teacher: Try to delete a student (should fail with 403)
   - [ ] As Teacher: Try to delete a subject (should fail with 403)
   - [ ] As Admin: Verify you can delete students and subjects
   - [ ] As Teacher: Verify you only see your classes

2. **Grade Entry Testing**
   - [ ] Select class → verify students list updates
   - [ ] Select student → verify subject list updates
   - [ ] Enter grades → verify validation (0-10 range)
   - [ ] Submit valid grades → verify success message
   - [ ] Submit with missing fields → verify error message

3. **Authorization Testing**
   - [ ] As Teacher in Class 1A: Select Class 1A and verify correct students appear
   - [ ] Try to access students from a different class (should fail)
   - [ ] Verify subject list only shows your subjects

## Recommended Tests

### Unit Tests (Backend)
- Test that teachers cannot delete students
- Test that teachers cannot delete subjects
- Test that `getClassesByTeacherId()` returns correct classes
- Test that `getStudentsByClassId()` returns correct students
- Test that `findByTeacherAndClass()` returns correct subjects

### Integration Tests (Backend)
- Test complete grade entry flow from class selection to grade save
- Test authorization for all grade entry endpoints
- Test that grades are calculated correctly

### Component Tests (Frontend)
- Test that class selection triggers student fetch
- Test that student selection triggers subject fetch
- Test form validation
- Test that only teacher's classes are shown

## Troubleshooting

### Issue: "Turma não encontrada" (Class not found)
- **Cause**: Teacher ID mismatch or teacher not assigned to classes
- **Solution**: Verify teacher is assigned to classes in the database

### Issue: Grade entry shows no students
- **Cause**: Class has no students or authorization issue
- **Solution**: Check that students are enrolled in the selected class

### Issue: 403 Forbidden on DELETE endpoints
- **Cause**: User is not an admin
- **Solution**: This is expected behavior; only admins can delete students/subjects

## Future Enhancements

Potential improvements for future iterations:

1. **Bulk Grade Upload**
   - CSV import for grade upload
   - Spreadsheet-style grade entry

2. **Grade Approval Workflow**
   - School coordinator approval before grades are finalized
   - Audit trail for grade changes

3. **Better Authorization**
   - Role-based operations at finer granularity
   - Department-based access control

4. **Performance Optimizations**
   - Caching for teacher/class/student relationships
   - Query optimization for large datasets

5. **Enhanced Validation**
   - Cross-validation of grades against attendance
   - Consistency checks for semester transitions

## References

- Brazilian Grading Standards: Average = (N1+N2+N3+N4)/4
- Final Grade Calculation: Final = (Avg_Sem1 + Avg_Sem2)/2
- Status Rules:
  - APROVADO (Approved): >= 7.0
  - RECUPERAÇÃO (Remedial): 5.0-6.9
  - REPROVADO (Failed): < 5.0
  - INCOMPLETO (Incomplete): Grades not yet entered

