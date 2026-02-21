package COM.institutorme.service;

import COM.institutorme.dao.UsuarioDAO;
import COM.institutorme.model.Usuario;
import org.mindrot.jbcrypt.BCrypt;

public class LoginService {

    private final UsuarioDAO usuarioDAO = new UsuarioDAO();

    public Usuario autenticar(String email, String senha) {

        Usuario usuario = usuarioDAO.buscarPorEmail(email);

        if (usuario == null) {
            throw new RuntimeException("Email ou senha inválidos.");
        }

        if (!BCrypt.checkpw(senha, usuario.getSenha())) {
            throw new RuntimeException("Email ou senha inválidos.");
        }

        return usuario;
    }
}