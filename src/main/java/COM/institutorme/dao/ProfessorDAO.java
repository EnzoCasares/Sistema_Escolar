package COM.institutorme.dao;

import COM.institutorme.exception.DAOException;
import COM.institutorme.model.Materia;
import COM.institutorme.model.Observacoes;
import COM.institutorme.model.Professor;
import COM.institutorme.model.Usuario;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ProfessorDAO {

    public int inserirProfessor(Professor professor,String email) {
        UsuarioDAO userDao=new UsuarioDAO();
        Usuario usuario = userDao.buscarPorEmail(email);
        String sql = """
                INSERT INTO PROFESSORES (USUARIO_ID) VALUES (?)
                """;

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setLong(1, usuario.getId());
            if (pstmt.executeUpdate() > 0) {
                return 1;
            } else {
                return 0;
            }
        } catch (SQLException e) {
            throw new DAOException("Erro ao cadastrar professor", e);
        }


    }

    public int deletarProfessor(long id){
        String sql = """
                DELETE FROM PROFESSOR WHERE ID=?
                """;

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)){
            pstmt.setLong(1,id);
            if (pstmt.executeUpdate()>0){
                return 1;
            }
            else {
                return 0;
            }

        }catch (SQLException e){
            throw new DAOException("Ocorreu um erro ao apagar o professor",e);
        }
    }





}
