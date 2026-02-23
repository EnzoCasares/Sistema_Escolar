package COM.institutorme.exception;

public class EmailJaCadastradoException extends ValidationException {

    private final String email;

    public EmailJaCadastradoException(String email) {
        super("Email já cadastrado: " + email);
        this.email = email;
    }

    public String getEmail() {
        return email;
    }
}