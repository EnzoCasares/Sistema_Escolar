package COM.institutorme.dto;


public class CriarCredenciaisDTO {

    private String matricula;
    private String email;
    private String senha;
    private String confirmarSenha;

    public CriarCredenciaisDTO() {
    }

    public CriarCredenciaisDTO(String matricula, String email,
                               String senha, String confirmarSenha) {
        this.matricula = matricula;
        this.email = email;
        this.senha = senha;
        this.confirmarSenha = confirmarSenha;
    }

    // Getters e Setters
    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getConfirmarSenha() {
        return confirmarSenha;
    }

    public void setConfirmarSenha(String confirmarSenha) {
        this.confirmarSenha = confirmarSenha;
    }

    // Métodos auxiliares
    public String getMatriculaTrimmed() {
        return matricula != null ? matricula.trim() : null;
    }

    public String getEmailTrimmed() {
        return email != null ? email.trim().toLowerCase() : null;
    }
}