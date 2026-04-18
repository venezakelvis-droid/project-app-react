# Database Migration Guide - Grade System v1.0 to v2.0

## Overview
This guide provides instructions for migrating existing grade data from the old system (3 exams) to the new Brazilian standard system (8 notes per semester).

## ⚠️ Pre-Migration

### Backup Database
```sql
-- PostgreSQL example
pg_dump -U username -h localhost school_app_db > backup_$(date +%Y%m%d).sql

-- MySQL example
mysqldump -u username -p school_app_db > backup_$(date +%Y%m%d).sql
```

### Check Current Data
```sql
SELECT COUNT(*) FROM grade;
SELECT * FROM grade LIMIT 5;
```

## Schema Changes

### Before
```sql
CREATE TABLE grade (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    exam1 DOUBLE,
    exam2 DOUBLE,
    final_exam DOUBLE,
    average DOUBLE,
    status VARCHAR(50),
    enrollment_id BIGINT,
    FOREIGN KEY (enrollment_id) REFERENCES enrollment(id)
);
```

### After
```sql
CREATE TABLE grade (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    -- Semester 1 (4 notes)
    note1_semester1 DOUBLE,
    note2_semester1 DOUBLE,
    note3_semester1 DOUBLE,
    note4_semester1 DOUBLE,
    -- Semester 2 (4 notes)
    note1_semester2 DOUBLE,
    note2_semester2 DOUBLE,
    note3_semester2 DOUBLE,
    note4_semester2 DOUBLE,
    -- Calculated averages
    average_semester1 DOUBLE,
    average_semester2 DOUBLE,
    final_average DOUBLE,
    status VARCHAR(50),
    enrollment_id BIGINT,
    FOREIGN KEY (enrollment_id) REFERENCES enrollment(id)
);
```

## Migration Strategy

### Option 1: Full Reset (Recommended for Fresh Start)

```sql
-- 1. Backup old data
CREATE TABLE grade_backup AS SELECT * FROM grade;

-- 2. Drop old table
DROP TABLE grade;

-- 3. Create new table structure (Spring will auto-create on startup)
-- The application will create the new schema automatically

-- 4. Add sample data using DatabaseSeeder on application restart
```

### Option 2: Data Conversion (For Preserving Historical Data)

If you have important historical grade data and want to preserve it:

```sql
-- 1. Add new columns to existing table
ALTER TABLE grade ADD COLUMN (
    note1_semester1 DOUBLE DEFAULT NULL,
    note2_semester1 DOUBLE DEFAULT NULL,
    note3_semester1 DOUBLE DEFAULT NULL,
    note4_semester1 DOUBLE DEFAULT NULL,
    note1_semester2 DOUBLE DEFAULT NULL,
    note2_semester2 DOUBLE DEFAULT NULL,
    note3_semester2 DOUBLE DEFAULT NULL,
    note4_semester2 DOUBLE DEFAULT NULL,
    average_semester1 DOUBLE DEFAULT NULL,
    average_semester2 DOUBLE DEFAULT NULL,
    final_average DOUBLE DEFAULT NULL
);

-- 2. Migrate data - Spread exam grades into semester 1 notes
-- Strategy: exam1 -> note1S1, exam2 -> note2S1, finalExam -> note3S1, average -> note4S1
UPDATE grade 
SET 
    note1_semester1 = exam1,
    note2_semester1 = exam2,
    note3_semester1 = final_exam,
    note4_semester1 = exam1,  -- Duplicate exam1 as placeholder
    note1_semester2 = NULL,
    note2_semester2 = NULL,
    note3_semester2 = NULL,
    note4_semester2 = NULL,
    average_semester1 = average,
    average_semester2 = NULL,
    final_average = average
WHERE exam1 IS NOT NULL;

-- 3. Remove old columns (optional, after verification)
-- ALTER TABLE grade DROP COLUMN exam1, DROP COLUMN exam2, DROP COLUMN final_exam, DROP COLUMN average;
```

⚠️ **Note**: This approach duplicates data. Please manually review after migration.

### Option 3: Staged Migration (Safest for Production)

```sql
-- Phase 1: Add new columns alongside old ones (live for a few days)
ALTER TABLE grade ADD COLUMN (
    note1_semester1 DOUBLE DEFAULT NULL,
    note2_semester1 DOUBLE DEFAULT NULL,
    note3_semester1 DOUBLE DEFAULT NULL,
    note4_semester1 DOUBLE DEFAULT NULL,
    note1_semester2 DOUBLE DEFAULT NULL,
    note2_semester2 DOUBLE DEFAULT NULL,
    note3_semester2 DOUBLE DEFAULT NULL,
    note4_semester2 DOUBLE DEFAULT NULL,
    average_semester1 DOUBLE DEFAULT NULL,
    average_semester2 DOUBLE DEFAULT NULL,
    final_average DOUBLE DEFAULT NULL
);

-- Phase 2: Run migration in batches (if data is large)
-- Batch 1: Grades from January-June (Semester 1)
UPDATE grade 
SET 
    note1_semester1 = exam1,
    note2_semester1 = exam2,
    note3_semester1 = final_exam,
    note4_semester1 = exam1,
    average_semester1 = average
WHERE created_date >= '2024-01-01' AND created_date < '2024-07-01'
AND note1_semester1 IS NULL;

-- Batch 2: Grades from July-December (Semester 2)
UPDATE grade 
SET 
    note1_semester2 = exam1,
    note2_semester2 = exam2,
    note3_semester2 = final_exam,
    note4_semester2 = exam1,
    average_semester2 = average,
    final_average = average
WHERE created_date >= '2024-07-01' AND created_date < '2025-01-01'
AND note1_semester2 IS NULL;

-- Phase 3: After verification, drop old columns and update status
UPDATE grade SET status = 'INCOMPLETO' WHERE final_average IS NULL;
UPDATE grade SET status = 'APROVADO' WHERE final_average >= 7.0;
UPDATE grade SET status = 'RECUPERAÇÃO' WHERE final_average >= 5.0 AND final_average < 7.0;
UPDATE grade SET status = 'REPROVADO' WHERE final_average < 5.0;

-- Phase 4: Drop old columns after backup verification
-- ALTER TABLE grade DROP COLUMN exam1, DROP COLUMN exam2, DROP COLUMN final_exam, DROP COLUMN average;
```

## Data Type Note

Both systems use `DOUBLE` for grade values. Ensure no type conversions necessary.

## Hibernate/JPA Auto-Update

If using Hibernate with `spring.jpa.hibernate.ddl-auto=update`:

1. **Update** entity class (Grade.java)
2. **Restart** Spring Boot application
3. Hibernate automatically updates schema
4. Manual data migration still required

## Validation After Migration

```sql
-- Verify all grades migrated
SELECT COUNT(*) FROM grade WHERE note1_semester1 IS NOT NULL;

-- Check for orphaned records
SELECT * FROM grade WHERE enrollment_id NOT IN (SELECT id FROM enrollment);

-- Verify calculations
SELECT 
    id, 
    note1_semester1, 
    note2_semester1, 
    note3_semester1, 
    note4_semester1,
    average_semester1,
    (note1_semester1 + note2_semester1 + note3_semester1 + note4_semester1) / 4 as calculated_avg
FROM grade 
WHERE note1_semester1 IS NOT NULL
HAVING average_semester1 != calculated_avg;

-- Status verification
SELECT status, COUNT(*) FROM grade GROUP BY status;
```

## Rollback Procedure

If something goes wrong:

```sql
-- 1. Restore from backup
mysql -u username -p school_app_db < backup_20240415.sql

-- 2. Verify restoration
SELECT COUNT(*) FROM grade;
SELECT * FROM grade LIMIT 5;

-- 3. Restart application
```

## Testing After Migration

1. **Create new grade via API**
   ```bash
   curl -X POST http://localhost:8081/api/grades \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer TOKEN" \
     -d '{
       "enrollmentId": 1,
       "note1Semester1": 8.5,
       "note2Semester1": 8.0,
       "note3Semester1": 8.5,
       "note4Semester1": 8.0,
       "note1Semester2": 8.0,
       "note2Semester2": 8.5,
       "note3Semester2": 8.0,
       "note4Semester2": 8.5
     }'
   ```

2. **Retrieve grade and verify calculations**
   ```bash
   curl http://localhost:8081/api/grades/1 \
     -H "Authorization: Bearer TOKEN"
   ```

3. **Test frontend report card page**
   - Login as student
   - Navigate to Boletim
   - Verify semesters show correct notes and averages

4. **Test access control**
   - Student sees only their grades
   - Teacher sees their subject grades
   - Admin sees all grades

## Troubleshooting

### Schema Not Updated
```
Error: Column 'note1_semester1' doesn't exist
```
**Solution**: Manually run migration SQL or delete and let Hibernate recreate.

### Orphaned Records
```
Error: foreign key constraint fails
```
**Solution**: 
```sql
DELETE FROM grade WHERE enrollment_id NOT IN (SELECT id FROM enrollment);
```

### Calculation Mismatch
If `average_semester1` doesn't match calculated value:
```sql
UPDATE grade 
SET average_semester1 = (note1_semester1 + note2_semester1 + note3_semester1 + note4_semester1) / 4
WHERE note1_semester1 IS NOT NULL;
```

## Estimated Time

- **Option 1** (Full Reset): 10 minutes
- **Option 2** (Data Conversion): 30 minutes + verification
- **Option 3** (Staged): 1 week + daily monitoring

## Checklist

- [ ] Database backed up
- [ ] Old data exported
- [ ] Schema changes applied
- [ ] Data migrated
- [ ] Calculations verified
- [ ] Status values updated
- [ ] API tested
- [ ] Frontend tested
- [ ] Users notified

## Support

For issues during migration:
1. Check application logs: `logs/application.log`
2. Review SQL error messages
3. Restore from backup if needed
4. Document any custom logic that needed adjustment

---

**Last Updated**: April 15, 2026
