package school_app.project.demo.domain.exceptions;

public class EnrollmentAlreadyExistsException extends RuntimeException {

    public EnrollmentAlreadyExistsException(Long studentId, Long subjectId) {
        super("Student " + studentId + " is already enrolled in subject " + subjectId + ".");
    }

}