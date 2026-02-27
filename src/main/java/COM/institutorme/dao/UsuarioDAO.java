package COM.institutorme.dao;

import COM.institutorme.model.Usuario;

import java.sql.*;

public class UsuarioDAO {

    public Usuario buscarPorEmail(String email) {
        String sql = """
                SELECT id, nome, email, senha, administrador, criado_em
                FROM usuarios
                WHERE email = ?
                """;

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, email);

            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return mapearUsuario(rs);
            }

            return null;

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar usuário por email", e);
        }
    }

    public Usuario salvar(Usuario usuario) {
        String sql = """
                INSERT INTO usuarios (nome, email, senha, administrador)
                VALUES (?, ?, ?, ?)
                RETURNING id, criado_em
                """;

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, usuario.getNome());
            stmt.setString(2, usuario.getEmail());
            stmt.setString(3, usuario.getSenha());
            stmt.setBoolean(4, usuario.isAdministrador());

            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                usuario.setId(rs.getLong("id"));
                usuario.setCriadoEm(rs.getTimestamp("criado_em"));
            }

            return usuario;

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao salvar usuário", e);
        }
    }

    private Usuario mapearUsuario(ResultSet rs) throws SQLException {
        Usuario usuario = new Usuario();
        usuario.setId(rs.getLong("id"));
        usuario.setNome(rs.getString("nome"));
        usuario.setEmail(rs.getString("email"));
        usuario.setSenha(rs.getString("senha"));
        usuario.setAdministrador(rs.getBoolean("administrador"));
        usuario.setCriadoEm(rs.getTimestamp("criado_em"));
        return usuario;
    }
}