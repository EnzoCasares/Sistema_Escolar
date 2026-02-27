package COM.institutorme.exception;

public class MateriaJaExistenteException extends  ValidationException{

    private final String materia;


    public MateriaJaExistenteException(String materia){
        super("Matéria já existente: "+materia);
        this.materia = materia;
    }


    public String getMateria(){
        return this.materia;
    }


}
