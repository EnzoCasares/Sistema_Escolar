package COM.institutorme.model;

import java.util.Objects;

public class Observacoes {
    private long id;
    private long materiaId;
    private long alunoId;
    private long professorId;
    private String comentario;


    public Observacoes(long id, long materiaId, long alunoId, long professorId, String comentario) {
        this.id = id;
        this.materiaId = materiaId;
        this.alunoId = alunoId;
        this.professorId = professorId;
        this.comentario = comentario;
    }

    public Observacoes() {
    }


    public long getId() {
        return id;
    }

    public long getMateriaId() {
        return materiaId;
    }

    public long getAlunoId() {
        return alunoId;
    }

    public long getProfessorId() {
        return professorId;
    }

    public String getComentario() {
        return comentario;
    }

}
