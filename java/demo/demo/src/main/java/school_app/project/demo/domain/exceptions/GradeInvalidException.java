package school_app.project.demo.domain.exceptions;

public class GradeInvalidException extends RuntimeException {

    public GradeInvalidException(Double grade) {
        super("Invalid grade value: " + grade + ". Grades must be between 0 and 10.");
    }

}