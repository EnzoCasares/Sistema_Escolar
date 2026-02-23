package COM.institutorme.validator;

import COM.institutorme.dto.CriarCredenciaisDTO;
import COM.institutorme.exception.ValidationException;

import java.util.regex.Pattern;

public class CredenciaisValidator {

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    private static final int SENHA_MIN_LENGTH = 6;
    private static final int SENHA_MAX_LENGTH = 100;

    /**
     * Valida os dados de entrada para criação de credenciais
     *
     * @param dto Dados de entrada
     * @throws ValidationException se houver erro de validação
     */
    public void validar(CriarCredenciaisDTO dto) {

        if (dto == null) {
            throw new ValidationException("Dados de credenciais não informados.");
        }

        validarMatricula(dto.getMatriculaTrimmed());
        validarEmail(dto.getEmailTrimmed());
        validarSenha(dto.getSenha(), dto.getConfirmarSenha());
    }

    private void validarMatricula(String matricula) {
        if (matricula == null || matricula.isEmpty()) {
            throw new ValidationException("Matrícula é obrigatória.");
        }
    }

    private void validarEmail(String email) {
        if (email == null || email.isEmpty()) {
            throw new ValidationException("Email é obrigatório.");
        }

        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw new ValidationException("Email inválido. Use um formato válido: usuario@dominio.com");
        }

        if (email.length() > 255) {
            throw new ValidationException("Email muito longo. Máximo de 255 caracteres.");
        }
    }

    private void validarSenha(String senha, String confirmarSenha) {
        if (senha == null || senha.isEmpty()) {
            throw new ValidationException("Senha é obrigatória.");
        }

        if (senha.length() < SENHA_MIN_LENGTH) {
            throw new ValidationException(
                    String.format("A senha deve ter no mínimo %d caracteres.", SENHA_MIN_LENGTH)
            );
        }

        if (senha.length() > SENHA_MAX_LENGTH) {
            throw new ValidationException(
                    String.format("A senha deve ter no máximo %d caracteres.", SENHA_MAX_LENGTH)
            );
        }

        if (confirmarSenha == null || confirmarSenha.isEmpty()) {
            throw new ValidationException("Confirmação de senha é obrigatória.");
        }

        if (!senha.equals(confirmarSenha)) {
            throw new ValidationException("As senhas não coincidem.");
        }

    }
}