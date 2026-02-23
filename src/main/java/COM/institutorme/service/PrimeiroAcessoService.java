package COM.institutorme.service;

import COM.institutorme.dao.AlunoDAO;
import COM.institutorme.dao.UsuarioDAO;
import COM.institutorme.dao.ConnectionFactory;
import COM.institutorme.dto.CriarCredenciaisDTO;
import COM.institutorme.dto.ValidarMatriculaDTO;
import COM.institutorme.exception.*;
import COM.institutorme.model.Aluno;
import COM.institutorme.model.Usuario;
import COM.institutorme.validator.CredenciaisValidator;
import COM.institutorme.validator.MatriculaValidator;

import org.mindrot.jbcrypt.BCrypt;

import java.sql.Connection;
import java.sql.SQLException;

/**
 * Serviço responsável pelo processo de primeiro acesso do aluno
 * Implementa o fluxo de dois passos:
 * 1. Validar matrícula
 * 2. Criar credenciais
 */
public class PrimeiroAcessoService {

    private final AlunoDAO alunoDAO;
    private final UsuarioDAO usuarioDAO;
    private final MatriculaValidator matriculaValidator;
    private final CredenciaisValidator credenciaisValidator;

    public PrimeiroAcessoService() {
        this.alunoDAO = new AlunoDAO();
        this.usuarioDAO = new UsuarioDAO();
        this.matriculaValidator = new MatriculaValidator();
        this.credenciaisValidator = new CredenciaisValidator();
    }

    // Construtor para testes (dependency injection)
    public PrimeiroAcessoService(AlunoDAO alunoDAO,
                                 UsuarioDAO usuarioDAO,
                                 MatriculaValidator matriculaValidator,
                                 CredenciaisValidator credenciaisValidator) {
        this.alunoDAO = alunoDAO;
        this.usuarioDAO = usuarioDAO;
        this.matriculaValidator = matriculaValidator;
        this.credenciaisValidator = credenciaisValidator;
    }

    /**
     * PASSO 1: Valida a matrícula do aluno
     *
     * @param dto Dados da matrícula
     * @return Aluno encontrado
     * @throws ValidationException se dados inválidos
     * @throws MatriculaNaoEncontradaException se matrícula não existe
     * @throws AcessoJaExistenteException se aluno já possui acesso
     */
    public Aluno validarMatricula(ValidarMatriculaDTO dto) {

        // 1. Validar entrada
        matriculaValidator.validar(dto);

        String matricula = dto.getMatriculaTrimmed();

        // 2. Buscar aluno
        Aluno aluno = alunoDAO.buscarPorMatricula(matricula);

        if (aluno == null) {
            throw new MatriculaNaoEncontradaException(matricula);
        }

        // 3. Verificar se já possui acesso
        if (aluno.possuiUsuario()) {
            throw new AcessoJaExistenteException(matricula);
        }

        return aluno;
    }

    /**
     * PASSO 2: Cria as credenciais de acesso para o aluno
     *
     * @param dto Dados das credenciais
     * @return Aluno com usuário vinculado
     * @throws ValidationException se dados inválidos
     * @throws MatriculaNaoEncontradaException se matrícula não existe
     * @throws AcessoJaExistenteException se aluno já possui acesso
     * @throws EmailJaCadastradoException se email já existe
     * @throws ServiceException se ocorrer erro no processo
     */
    public Aluno criarCredenciais(CriarCredenciaisDTO dto) {

        // 1. Validar entrada
        credenciaisValidator.validar(dto);

        String matricula = dto.getMatriculaTrimmed();
        String email = dto.getEmailTrimmed();
        String senha = dto.getSenha();

        Connection conn = null;

        try {
            // 2. Iniciar transação
            conn = ConnectionFactory.getConnection();
            conn.setAutoCommit(false);

            // 3. Buscar e validar aluno
            Aluno aluno = alunoDAO.buscarPorMatricula(matricula);

            if (aluno == null) {
                throw new MatriculaNaoEncontradaException(matricula);
            }

            if (aluno.possuiUsuario()) {
                throw new AcessoJaExistenteException(matricula);
            }

            // 4. Verificar se email já existe
            Usuario usuarioExistente = usuarioDAO.buscarPorEmail(email);
            if (usuarioExistente != null) {
                throw new EmailJaCadastradoException(email);
            }

            // 5. Criptografar senha
            String senhaCriptografada = BCrypt.hashpw(senha, BCrypt.gensalt());

            // 6. Criar usuário
            Usuario usuario = new Usuario(
                    aluno.getNome(),
                    email,
                    senhaCriptografada
            );
            usuario = usuarioDAO.salvar(usuario);

            // 7. Vincular usuário ao aluno
            alunoDAO.vincularUsuario(aluno.getId(), usuario.getId());

            // 8. Commit da transação
            conn.commit();

            // 9. Retornar aluno com usuário vinculado
            aluno.setUsuario(usuario);
            return aluno;

        } catch (MatriculaNaoEncontradaException |
                 AcessoJaExistenteException | EmailJaCadastradoException e) {
            rollback(conn);
            throw e;

        } catch (Exception e) {
            // Outras exceções: rollback e encapsula
            rollback(conn);
            throw new ServiceException("Erro ao criar credenciais de acesso", e);

        } finally {
            closeConnection(conn);
        }
    }

    /**
     * Realiza rollback da transação de forma segura
     */
    private void rollback(Connection conn) {
        if (conn != null) {
            try {
                conn.rollback();
            } catch (SQLException ex) {
                // Log do erro (poderia usar um logger aqui)
                ex.printStackTrace();
            }
        }
    }

    /**
     * Fecha a conexão de forma segura
     */
    private void closeConnection(Connection conn) {
        if (conn != null) {
            try {
                conn.setAutoCommit(true);
                conn.close();
            } catch (SQLException e) {
                // Log do erro (poderia usar um logger aqui)
                e.printStackTrace();
            }
        }
    }
}