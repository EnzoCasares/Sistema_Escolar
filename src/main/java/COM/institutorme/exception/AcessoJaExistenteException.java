package COM.institutorme.exception;


public class AcessoJaExistenteException extends ValidationException {

    private final String matricula;

    public AcessoJaExistenteException(String matricula) {
        super("Esta matrícula já possui acesso configurado. Use a tela de login.");
        this.matricula = matricula;
    }

    public String getMatricula() {
        return matricula;
    }
}