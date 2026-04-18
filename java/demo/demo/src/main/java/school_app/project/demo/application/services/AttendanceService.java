package school_app.project.demo.application.services;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import school_app.project.demo.application.dtos.AttendanceDTO;
import school_app.project.demo.application.mappers.AttendanceMapper;
import school_app.project.demo.application.utils.AuthorizationHelper;
import school_app.project.demo.domain.entities.Attendance;
import school_app.project.demo.domain.entities.Enrollment;
import school_app.project.demo.domain.exceptions.ResourceNotFoundException;
import school_app.project.demo.infrastructure.repositories.AttendanceRepository;
import school_app.project.demo.infrastructure.repositories.EnrollmentRepository;

import java.util.List;

/**
 * Service for managing attendance following Brazilian standard.
 * Tracks attendance per subject per semester.
 */
@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AuthorizationHelper authorizationHelper;

    public AttendanceDTO create(AttendanceDTO dto) {
        Enrollment enrollment = enrollmentRepository.findById(dto.getEnrollmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment", dto.getEnrollmentId()));

        validateAttendanceData(dto);

        Attendance attendance = AttendanceMapper.toEntity(dto, enrollment);
        return AttendanceMapper.toDTO(attendanceRepository.save(attendance));
    }

    public AttendanceDTO findById(Long id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance", id));

        // Verify access
        if (!authorizationHelper.isAdmin()) {
            if (authorizationHelper.isTeacher()) {
                Long teacherId = authorizationHelper.getCurrentTeacherId();
                if (!attendance.getEnrollment().getSubject().getTeacher().getId().equals(teacherId)) {
                    throw new RuntimeException("Access denied: Attendance does not belong to your subjects");
                }
            } else if (authorizationHelper.isStudent()) {
                Long studentId = authorizationHelper.getCurrentStudentId();
                if (!attendance.getEnrollment().getStudent().getId().equals(studentId)) {
                    throw new RuntimeException("Access denied: This is not your attendance record");
                }
            } else if (authorizationHelper.isGuardian()) {
                Long studentId = attendance.getEnrollment().getStudent().getId();
                if (!authorizationHelper.isGuardianOfStudent(studentId)) {
                    throw new RuntimeException("Access denied: This is not your dependent's attendance record");
                }
            }
        }

        return AttendanceMapper.toDTO(attendance);
    }

    public List<AttendanceDTO> findAll() {
        // ADMIN: returns all attendance records
        if (authorizationHelper.isAdmin()) {
            return attendanceRepository.findAll().stream()
                    .map(AttendanceMapper::toDTO)
                    .toList();
        }

        // TEACHER: returns attendance of their students (through subjects)
        if (authorizationHelper.isTeacher()) {
            Long teacherId = authorizationHelper.getCurrentTeacherId();
            return attendanceRepository.findAll().stream()
                    .filter(attendance -> attendance.getEnrollment().getSubject().getTeacher().getId().equals(teacherId))
                    .map(AttendanceMapper::toDTO)
                    .toList();
        }

        // STUDENT: returns only their attendance records
        if (authorizationHelper.isStudent()) {
            Long studentId = authorizationHelper.getCurrentStudentId();
            return attendanceRepository.findByEnrollmentStudentId(studentId).stream()
                    .map(AttendanceMapper::toDTO)
                    .toList();
        }

        // GUARDIAN: returns attendance records for their dependents
        if (authorizationHelper.isGuardian()) {
            return attendanceRepository.findAll().stream()
                    .filter(attendance -> authorizationHelper.isGuardianOfStudent(attendance.getEnrollment().getStudent().getId()))
                    .map(AttendanceMapper::toDTO)
                    .toList();
        }

        return List.of();
    }

    public List<AttendanceDTO> findByStudentId(Long studentId) {
        ensureStudentAccess(studentId);
        return attendanceRepository.findByEnrollmentStudentId(studentId).stream()
                .map(AttendanceMapper::toDTO)
                .toList();
    }

    public List<AttendanceDTO> findByEnrollmentId(Long enrollmentId) {
        ensureEnrollmentAccess(enrollmentId);
        return attendanceRepository.findByEnrollmentId(enrollmentId).stream()
                .map(AttendanceMapper::toDTO)
                .toList();
    }

    public AttendanceDTO update(Long id, AttendanceDTO dto) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance", id));

        // Only ADMIN or TEACHER of subject can update
        if (!authorizationHelper.isAdmin()) {
            if (authorizationHelper.isTeacher()) {
                Long teacherId = authorizationHelper.getCurrentTeacherId();
                if (!attendance.getEnrollment().getSubject().getTeacher().getId().equals(teacherId)) {
                    throw new RuntimeException("Access denied: You can only update attendance for your subjects");
                }
            } else {
                throw new RuntimeException("Access denied: Only teachers and admins can update attendance");
            }
        }

        validateAttendanceData(dto);

        attendance.setSemester(dto.getSemester());
        attendance.setTotalClasses(dto.getTotalClasses());
        attendance.setAbsences(dto.getAbsences());
        attendance.setJustifiedAbsences(dto.getJustifiedAbsences());
        attendance.setDelays(dto.getDelays());

        attendance.calculatePresencePercentage();

        return AttendanceMapper.toDTO(attendanceRepository.save(attendance));
    }

    public AttendanceDTO patch(Long id, AttendanceDTO dto) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance", id));

        // Only ADMIN or TEACHER of subject can patch
        if (!authorizationHelper.isAdmin()) {
            if (authorizationHelper.isTeacher()) {
                Long teacherId = authorizationHelper.getCurrentTeacherId();
                if (!attendance.getEnrollment().getSubject().getTeacher().getId().equals(teacherId)) {
                    throw new RuntimeException("Access denied: You can only patch attendance for your subjects");
                }
            } else {
                throw new RuntimeException("Access denied: Only teachers and admins can patch attendance");
            }
        }

        if (dto.getSemester() != null) {
            attendance.setSemester(dto.getSemester());
        }
        if (dto.getTotalClasses() != null) {
            attendance.setTotalClasses(dto.getTotalClasses());
        }
        if (dto.getAbsences() != null) {
            attendance.setAbsences(dto.getAbsences());
        }
        if (dto.getJustifiedAbsences() != null) {
            attendance.setJustifiedAbsences(dto.getJustifiedAbsences());
        }
        if (dto.getDelays() != null) {
            attendance.setDelays(dto.getDelays());
        }

        attendance.calculatePresencePercentage();

        return AttendanceMapper.toDTO(attendanceRepository.save(attendance));
    }

    public void delete(Long id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance", id));

        // Only ADMIN or TEACHER of subject can delete
        if (!authorizationHelper.isAdmin()) {
            if (authorizationHelper.isTeacher()) {
                Long teacherId = authorizationHelper.getCurrentTeacherId();
                if (!attendance.getEnrollment().getSubject().getTeacher().getId().equals(teacherId)) {
                    throw new RuntimeException("Access denied: You can only delete attendance for your subjects");
                }
            } else {
                throw new RuntimeException("Access denied: Only teachers and admins can delete attendance");
            }
        }

        attendanceRepository.deleteById(id);
    }

    private void ensureStudentAccess(Long studentId) {
        if (authorizationHelper.isAdmin()) {
            return;
        }
        if (authorizationHelper.isTeacher()) {
            Long teacherId = authorizationHelper.getCurrentTeacherId();
            boolean isStudentOfTeacher = attendanceRepository.findByEnrollmentStudentId(studentId).stream()
                    .anyMatch(attendance -> attendance.getEnrollment().getSubject().getTeacher().getId().equals(teacherId));
            if (!isStudentOfTeacher) {
                throw new RuntimeException("Access denied: This student does not belong to your subjects");
            }
            return;
        }
        if (authorizationHelper.isStudent()) {
            Long studentIdAuthenticated = authorizationHelper.getCurrentStudentId();
            if (!studentIdAuthenticated.equals(studentId)) {
                throw new RuntimeException("Access denied: You can only access your own attendance records");
            }
            return;
        }
        if (authorizationHelper.isGuardian()) {
            if (!authorizationHelper.isGuardianOfStudent(studentId)) {
                throw new RuntimeException("Access denied: You can only access attendance records for your dependents");
            }
            return;
        }
        throw new RuntimeException("Access denied: Unauthorized user");
    }

    private void ensureEnrollmentAccess(Long enrollmentId) {
        if (authorizationHelper.isAdmin()) {
            return;
        }
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        if (authorizationHelper.isTeacher()) {
            Long teacherId = authorizationHelper.getCurrentTeacherId();
            if (!enrollment.getSubject().getTeacher().getId().equals(teacherId)) {
                throw new RuntimeException("Access denied: This enrollment does not belong to your subjects");
            }
            return;
        }
        if (authorizationHelper.isStudent()) {
            Long studentIdAuthenticated = authorizationHelper.getCurrentStudentId();
            if (!enrollment.getStudent().getId().equals(studentIdAuthenticated)) {
                throw new RuntimeException("Access denied: You can only access your own attendance records");
            }
            return;
        }
        if (authorizationHelper.isGuardian()) {
            if (!authorizationHelper.isGuardianOfStudent(enrollment.getStudent().getId())) {
                throw new RuntimeException("Access denied: You can only access attendance records for your dependents");
            }
            return;
        }
        throw new RuntimeException("Access denied: Unauthorized user");
    }

    private void validateAttendanceData(AttendanceDTO dto) {
        if (dto.getSemester() != null && (dto.getSemester() < 1 || dto.getSemester() > 2)) {
            throw new IllegalArgumentException("Semester must be 1 or 2");
        }
        if (dto.getTotalClasses() != null && dto.getTotalClasses() < 0) {
            throw new IllegalArgumentException("Total classes cannot be negative");
        }
        if (dto.getAbsences() != null && dto.getAbsences() < 0) {
            throw new IllegalArgumentException("Absences cannot be negative");
        }
        if (dto.getJustifiedAbsences() != null && dto.getJustifiedAbsences() < 0) {
            throw new IllegalArgumentException("Justified absences cannot be negative");
        }
        if (dto.getDelays() != null && dto.getDelays() < 0) {
            throw new IllegalArgumentException("Delays cannot be negative");
        }
        if (dto.getAbsences() != null && dto.getJustifiedAbsences() != null &&
            dto.getJustifiedAbsences() > dto.getAbsences()) {
            throw new IllegalArgumentException("Justified absences cannot exceed total absences");
        }
    }

}