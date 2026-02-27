package COM.institutorme.model;

import java.util.Date;

public class Aluno {

    private Long id;
    private String matricula;
    private String nome;
    private Usuario usuario; // relacionamento
    private boolean ativo;
    private Date criadoEm;

    public Aluno() {}

    public Aluno(String matricula, String nome) {
        this.matricula = matricula;
        this.nome = nome;
        this.ativo = true;
        this.criadoEm = new Date();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public Date getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(Date criadoEm) {
        this.criadoEm = criadoEm;
    }

    public boolean possuiUsuario() {
        return usuario != null;
    }
}