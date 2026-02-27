package COM.institutorme.validator;

import COM.institutorme.dto.ValidarMatriculaDTO;
import COM.institutorme.exception.ValidationException;

public class MatriculaValidator {
    public void validar(ValidarMatriculaDTO dto) {

        if (dto == null) {
            throw new ValidationException("Dados de matrícula não informados.");
        }

        String matricula = dto.getMatriculaTrimmed();

        if (matricula == null || matricula.isEmpty()) {
            throw new ValidationException("Matrícula é obrigatória.");
        }

        if (matricula.length() < 3) {
            throw new ValidationException("Matrícula deve ter pelo menos 3 caracteres.");
        }

        if (matricula.length() > 20) {
            throw new ValidationException("Matrícula deve ter no máximo 20 caracteres.");
        }

    }
}