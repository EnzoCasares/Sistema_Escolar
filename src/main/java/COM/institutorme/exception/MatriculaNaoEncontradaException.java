package COM.institutorme.exception;

/**
 * Exceção lançada quando uma matrícula não é encontrada
 */
public class MatriculaNaoEncontradaException extends ValidationException {

    private final String matricula;

    public MatriculaNaoEncontradaException(String matricula) {
        super("Matrícula não encontrada: " + matricula);
        this.matricula = matricula;
    }

    public String getMatricula() {
        return matricula;
    }
}