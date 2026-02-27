package COM.institutorme.dto;

public class ValidarMatriculaDTO {

    private String matricula;

    public ValidarMatriculaDTO() {
    }

    public ValidarMatriculaDTO(String matricula) {
        this.matricula = matricula;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public String getMatriculaTrimmed() {
        return matricula != null ? matricula.trim() : null;
    }
}