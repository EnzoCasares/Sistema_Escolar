package COM.institutorme.dao;

import COM.institutorme.exception.DAOException;
import COM.institutorme.model.Aluno;
import COM.institutorme.model.Usuario;

import java.sql.*;

public class AlunoDAO {

    public Aluno buscarPorMatricula(String matricula) {

        String sql = """
                SELECT a.id AS aluno_id,
                       a.matricula,
                       a.nome AS aluno_nome,
                       a.ativo,
                       a.criado_em AS aluno_criado,
                       u.id AS usuario_id,
                       u.nome AS usuario_nome,
                       u.email,
                       u.senha,
                       u.administrador,
                       u.criado_em AS usuario_criado
                FROM alunos a
                LEFT JOIN usuarios u ON a.usuario_id = u.id
                WHERE a.matricula = ? AND a.ativo = true
                """;

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, matricula);

            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return mapearAlunoComUsuario(rs);
            }

            return null;

        } catch (SQLException e) {
            throw new DAOException("Erro ao buscar aluno",e);
        }
    }

    public void vincularUsuario(Long alunoId, Long usuarioId) {

        String sql = "UPDATE alunos SET usuario_id = ? WHERE id = ?";

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setLong(1, usuarioId);
            stmt.setLong(2, alunoId);

            stmt.executeUpdate();

        } catch (SQLException e) {
            throw new DAOException("Erro ao vincular usuário ao aluno", e);
        }
    }

    public boolean cadastrarAluno(String matricula, String nome) {

        String sql = """
                INSERT INTO alunos (matricula, nome, ativo)
                VALUES (?, ?, true)
                """;

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, matricula);
            stmt.setString(2, nome);

            return stmt.executeUpdate() > 0;

        } catch (SQLException e) {
            throw new DAOException("Erro ao cadastrar aluno", e);
        }
    }

    private Aluno mapearAlunoComUsuario(ResultSet rs) throws SQLException {

        Aluno aluno = new Aluno();
        aluno.setId(rs.getLong("aluno_id"));
        aluno.setMatricula(rs.getString("matricula"));
        aluno.setNome(rs.getString("aluno_nome"));
        aluno.setAtivo(rs.getBoolean("ativo"));
        aluno.setCriadoEm(rs.getTimestamp("aluno_criado"));

        Long usuarioId = rs.getLong("usuario_id");

        if (!rs.wasNull()) {
            Usuario usuario = new Usuario();
            usuario.setId(usuarioId);
            usuario.setNome(rs.getString("usuario_nome"));
            usuario.setEmail(rs.getString("email"));
            usuario.setSenha(rs.getString("senha"));
            usuario.setAdministrador(rs.getBoolean("administrador"));
            usuario.setCriadoEm(rs.getTimestamp("usuario_criado"));

            aluno.setUsuario(usuario);
        }

        return aluno;
    }
}