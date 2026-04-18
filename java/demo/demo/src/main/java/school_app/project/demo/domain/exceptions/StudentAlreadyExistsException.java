package school_app.project.demo.domain.exceptions;

public class StudentAlreadyExistsException extends RuntimeException {

    public StudentAlreadyExistsException(String cpf) {
        super("A student with CPF " + cpf + " already exists.");
    }

}