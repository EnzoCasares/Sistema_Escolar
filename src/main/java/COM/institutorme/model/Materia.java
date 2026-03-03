package COM.institutorme.model;


public class Materia {
    private long id;
    private String nome;
    private long ProfessorId;

    public Materia(long id, String nome, long idProfessor) {
        this.id = id;
        this.nome = nome;
        this.ProfessorId = idProfessor;
    }

    public Materia() {
    }

    public long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public long getProfessorId() {
        return ProfessorId;
    }


    public void setNome(String nome) {
        this.nome = nome;
    }

    public boolean materiaEquals(String nome){
        return !this.nome.equals(nome);
    }
}
