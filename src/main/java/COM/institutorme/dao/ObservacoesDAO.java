package COM.institutorme.dao;

import COM.institutorme.exception.DAOException;
import COM.institutorme.model.Materia;
import COM.institutorme.model.Observacoes;

import java.sql.*;
import java.util.List;
import java.util.ArrayList;


public class ObservacoesDAO {
    public int inserirObservacao(Observacoes observacao){
        String sql = """
                INSERT INTO OBSERVACOES (MATERIA_ID,ALUNO_ID,PROFESSOR_ID,COMENTARIO) VALUES (?,?,?,?)
                """;

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)){
            pstmt.setLong(1, observacao.getMateriaId());
            pstmt.setLong(2,observacao.getAlunoId());
            pstmt.setLong(3,observacao.getProfessorId());
            pstmt.setString(4,observacao.getComentario());
            if (pstmt.executeUpdate()>0){
                return 1;
            }
            else {
                return 0;
            }

        }catch (SQLException e){
            throw new DAOException("Ocorreu um erro ao adicionar a observação",e);
        }
    }


    public int atualizarObservacao(Observacoes observacao){
        String sql = """
                UPDATE FROM OBSERVACOES SET COMENTARIO = ? WHERE ID = ?
                """;

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)){
            pstmt.setString(1, observacao.getComentario());
            pstmt.setLong(2,observacao.getId());
            if (pstmt.executeUpdate()>0){
                return 1;
            }
            else {
                return 0;
            }

        }catch (SQLException e){
            throw new DAOException("Ocorreu um erro ao atualizar a observação",e);
        }


    }

    public int deletarObservacao(long id){
        String sql = """
                DELETE FROM OBSERVACOES WHERE ID = ?
                """;

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)){
            pstmt.setLong(1, id);
            if (pstmt.executeUpdate()>0){
                return 1;
            }
            else {
                return 0;
            }

        }catch (SQLException e){
            throw new DAOException("Ocorreu um erro ao deletar a observação",e);
        }
    }


    public List<Observacoes> listarObservacoes(){
        ResultSet rset;
        List<Observacoes> observacoes = new ArrayList<>();
        String sql = """
                SELECT ID,MATERIA_ID,ALUNO_ID,PROFESSO_ID,COMENTARIO FROM OBSERVACOES
                """;
        try (Connection conn = ConnectionFactory.getConnection();
             Statement stmt = conn.createStatement()) {


                rset = stmt.getResultSet();
                while (rset.next()){
                Observacoes observacao = new Observacoes(rset.getInt("id"),rset.getLong("materia_id"),rset.getLong("aluno_id"),rset.getLong("professor_id"),rset.getString("comentario"));
                observacoes.add(observacao);
            }

        } catch (SQLException e) {
            throw new DAOException("Erro ao buscar observacoes", e);
        }
        return observacoes;
    }

    public List<Observacoes> listarObservacoesPorAluno(int id){
        ResultSet rset;
        List<Observacoes> observacoes = new ArrayList<>();
        String sql = """
                SELECT ID,MATERIA_ID,ALUNO_ID,PROFESSO_ID,COMENTARIO FROM OBSERVACOES WHERE ALUNO_ID = ?
                """;
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setLong(1,id);

            rset = pstmt.getResultSet();
            while (rset.next()){
                Observacoes observacao = new Observacoes(rset.getInt("id"),rset.getLong("materia_id"),rset.getLong("aluno_id"),rset.getLong("professor_id"),rset.getString("comentario"));
                observacoes.add(observacao);
            }

        } catch (SQLException e) {
            throw new DAOException("Erro ao buscar observacoes", e);
        }
        return observacoes;
    }



    public List<Observacoes> listarObservacoesPorProfessor(int id){
        ResultSet rset;
        List<Observacoes> observacoes = new ArrayList<>();
        String sql = """
                SELECT ID,MATERIA_ID,ALUNO_ID,PROFESSO_ID,COMENTARIO FROM OBSERVACOES WHERE PROFESSOR_ID = ?
                """;
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setLong(1,id);

            rset = pstmt.getResultSet();
            while (rset.next()){
                Observacoes observacao = new Observacoes(rset.getInt("id"),rset.getLong("materia_id"),rset.getLong("aluno_id"),rset.getLong("professor_id"),rset.getString("comentario"));
                observacoes.add(observacao);
            }

        } catch (SQLException e) {
            throw new DAOException("Erro ao buscar observacoes", e);
        }
        return observacoes;
    }

    public List<Observacoes> listarObservacoesPorMateria(int id){
        ResultSet rset;
        List<Observacoes> observacoes = new ArrayList<>();
        String sql = """
                SELECT ID,MATERIA_ID,ALUNO_ID,PROFESSO_ID,COMENTARIO FROM OBSERVACOES WHERE MATERIA_ID = ?
                """;
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setLong(1,id);

            rset = pstmt.getResultSet();
            while (rset.next()){
                Observacoes observacao = new Observacoes(rset.getInt("id"),rset.getLong("materia_id"),rset.getLong("aluno_id"),rset.getLong("professor_id"),rset.getString("comentario"));
                observacoes.add(observacao);
            }

        } catch (SQLException e) {
            throw new DAOException("Erro ao buscar observacoes", e);
        }
        return observacoes;
    }

}






