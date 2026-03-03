package COM.institutorme.service;

import COM.institutorme.dao.MateriaDAO;
import COM.institutorme.exception.MateriaJaExistenteException;
import COM.institutorme.model.Materia;

public class MateriaService{
    MateriaDAO materiaDao = new MateriaDAO();

    public Materia verificarMateriaExiste(String nome){
        Materia materia = materiaDao.verificarMateria(nome);

        if (materia.materiaEquals(nome)){
            throw new MateriaJaExistenteException(nome);
        }
        return materia;
    }


}
