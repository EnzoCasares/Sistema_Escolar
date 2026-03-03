package COM.institutorme.model;

public class Professor {

    private long id;
    private long usuarioId;


    public Professor() {
    }

    public Professor(long id, long usuarioId) {
        this.id = id;
        this.usuarioId = usuarioId;
    }

    public long getId() {
        return id;
    }

    public long getUsuarioId() {
        return usuarioId;
    }
}
