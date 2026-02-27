package COM.institutorme.exception;

public class ValidationException extends ServiceException {

    public ValidationException(String message) {
        super(message);
    }

    public ValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}