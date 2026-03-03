package COM.institutorme.dao;

import COM.institutorme.exception.DAOException;
import COM.institutorme.model.Materia;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class MateriaDAO {

    public int inserirMateria(Materia materia){
        String sql = """
                INSERT INTO MATERIA (NOME,PROFESSOR_ID) VALUES (?,?)
                """;

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)){
            pstmt.setString(1, materia.getNome());
            pstmt.setLong(2,materia.getProfessorId());
            if (pstmt.executeUpdate()>0){
                return 1;
            }
            else {
                return 0;
            }

        }catch (SQLException e){
            throw new DAOException("Ocorreu um erro ao adicionar a matéria",e);
        }
    }


    public int deletarMateria(long id){
        String sql = """
                DELETE FROM MATERIA WHERE ID=?
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
            throw new DAOException("Ocorreu um erro ao deletar a matéria",e);
        }
    }









    public List<Materia> listarMateriaPorAluno(long id){
        ResultSet rset;
        List<Materia> materias = new ArrayList<>();
        String sql = """
                SELECT A.ID,A.NOME,A.PROFESSOR_ID 
                FROM MATERIA A JOIN HORARIO B ON A.ID = B.MATERIA_ID 
                JOIN SALA C ON C.ID = B.SALA_ID 
                JOIN ALUNO D ON D.SALA_ID = C.ID 
                WHERE D.ID = ?
                """;
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
             pstmt.setLong(1,id);

             rset = pstmt.getResultSet();
             while (rset.next()){
                 Materia materia = new Materia(rset.getLong("id"),rset.getString("nome"),rset.getLong("professor_id"));
                 materias.add(materia);
             }

        } catch (SQLException e) {
            throw new DAOException("Erro ao buscar matérias", e);
        }
        return materias;
    }



    public List<Materia> listarMateriaPorProfessor(long id){
        ResultSet rset;
        List<Materia> materias = new ArrayList<>();
        String sql = """
                SELECT ID,NOME,PROFESSOR_ID 
                FROM MATERIA WHERE PROFESSOR_ID = ?
                """;
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
             pstmt.setLong(1,id);

            rset = pstmt.getResultSet();
            while (rset.next()){
                Materia materia = new Materia(rset.getLong("id"),rset.getString("nome"),rset.getLong("professor_id"));
                materias.add(materia);
            }

        } catch (SQLException e) {
            throw new DAOException("Erro ao buscar matérias", e);
        }
        return materias;
    }


    public List<Materia> listarMateria(){
        ResultSet rset;
        List<Materia> materias = new ArrayList<>();
        String sql = """
                SELECT ID,NOME,PROFESSOR_ID 
                FROM MATERIA 
                """;
        try (Connection conn = ConnectionFactory.getConnection();
             Statement stmt = conn.prepareStatement(sql)) {

            rset = stmt.getResultSet();
            while (rset.next()){
                Materia materia = new Materia(rset.getLong("id"),rset.getString("nome"),rset.getLong("professor_id"));
                materias.add(materia);
            }

        } catch (SQLException e) {
            throw new DAOException("Erro ao buscar matérias", e);
        }
        return materias;
    }



    public Materia verificarMateria(String nome){
        ResultSet rset;
        Materia materia = new Materia();
        String sql = """
                SELECT ID,NOME,PROFESSOR_ID 
                FROM MATERIA WHERE NOME = ?
                """;
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1,nome);
            rset = pstmt.getResultSet();
            if (rset.next()) {
                materia = new Materia(rset.getLong("id"), rset.getString("nome"), rset.getLong("professor_id"));
            }
        } catch (SQLException e) {
            throw new DAOException("Erro ao buscar matérias", e);
        }
        return materia;
    }


    public List<Materia> listarMateria(String nome){
        ResultSet rset;
        List<Materia> materias = new ArrayList<>();
        String sql = """
                SELECT ID,NOME,PROFESSOR_ID 
                FROM MATERIA WHERE NOME LIKE ?
                """;
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1,"%" + nome + "%");

            rset = pstmt.getResultSet();
            while (rset.next()){
                Materia materia = new Materia(rset.getLong("id"),rset.getString("nome"),rset.getLong("professor_id"));
                materias.add(materia);
            }

        } catch (SQLException e) {
            throw new DAOException("Erro ao buscar matérias", e);
        }
        return materias;
    }

}




