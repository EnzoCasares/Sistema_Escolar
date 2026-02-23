package COM.institutorme.servlet;

import COM.institutorme.dto.CriarCredenciaisDTO;
import COM.institutorme.dto.ValidarMatriculaDTO;
import COM.institutorme.exception.ValidationException;
import COM.institutorme.model.Aluno;
import COM.institutorme.service.PrimeiroAcessoService;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;

/**
 * Servlet responsável pelo fluxo de cadastro de primeiro acesso
 *
 * Responsabilidades:
 * - Receber requisições HTTP
 * - Extrair parâmetros
 * - Delegar para o service
 * - Tratar erros e redirecionar
 *
 * NÃO contém lógica de negócio ou validação
 */
@WebServlet("/cadastro")
public class CadastroServlet extends HttpServlet {

    private PrimeiroAcessoService primeiroAcessoService;

    @Override
    public void init() {
        this.primeiroAcessoService = new PrimeiroAcessoService();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // GET redireciona para o formulário inicial
        request.getRequestDispatcher("cadastro.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");

        String step = request.getParameter("step");

        if ("validar-matricula".equals(step)) {
            processarValidacaoMatricula(request, response);

        } else if ("criar-credenciais".equals(step)) {
            processarCriacaoCredenciais(request, response);

        } else {
            // Step inválido ou não informado
            response.sendRedirect("cadastro.jsp");
        }
    }

    /**
     * Processa o passo 1: validação de matrícula
     */
    private void processarValidacaoMatricula(HttpServletRequest request,
                                             HttpServletResponse response)
            throws ServletException, IOException {

        try {
            // 1. Extrair parâmetros
            String matricula = request.getParameter("matricula");

            // 2. Criar DTO
            ValidarMatriculaDTO dto = new ValidarMatriculaDTO(matricula);

            // 3. Delegar para o service
            Aluno aluno = primeiroAcessoService.validarMatricula(dto);

            // 4. Sucesso: avançar para passo 2
            request.setAttribute("step", "2");
            request.setAttribute("aluno", aluno);
            request.getRequestDispatcher("cadastro.jsp").forward(request, response);

        } catch (ValidationException e) {
            // Erro de validação: retorna para passo 1 com erro
            request.setAttribute("erro", e.getMessage());
            request.getRequestDispatcher("cadastro.jsp").forward(request, response);

        } catch (Exception e) {
            // Erro inesperado
            request.setAttribute("erro", "Erro ao validar matrícula. Tente novamente.");
            request.getRequestDispatcher("cadastro.jsp").forward(request, response);
        }
    }

    /**
     * Processa o passo 2: criação de credenciais
     */
    private void processarCriacaoCredenciais(HttpServletRequest request,
                                             HttpServletResponse response)
            throws ServletException, IOException {

        try {
            // 1. Extrair parâmetros
            String matricula = request.getParameter("matricula");
            String email = request.getParameter("email");
            String senha = request.getParameter("senha");
            String confirmarSenha = request.getParameter("confirmar_senha");

            // 2. Criar DTO
            CriarCredenciaisDTO dto = new CriarCredenciaisDTO(
                    matricula, email, senha, confirmarSenha
            );

            // 3. Delegar para o service
            Aluno aluno = primeiroAcessoService.criarCredenciais(dto);

            // 4. Sucesso: criar sessão e redirecionar
            HttpSession session = request.getSession();
            session.setAttribute("usuario", aluno.getUsuario());
            session.setAttribute("aluno", aluno);

            response.sendRedirect("dashboard.jsp");

        } catch (ValidationException e) {
            // Erro de validação: retorna para passo 2 com erro
            retornarParaPasso2ComErro(request, response, e.getMessage());

        } catch (Exception e) {
            // Erro inesperado
            retornarParaPasso2ComErro(request, response,
                    "Erro ao criar credenciais. Tente novamente.");
        }
    }

    /**
     * Retorna para o passo 2 mantendo o contexto do aluno
     */
    private void retornarParaPasso2ComErro(HttpServletRequest request,
                                           HttpServletResponse response,
                                           String mensagemErro)
            throws ServletException, IOException {

        String matricula = request.getParameter("matricula");

        try {
            // Revalidar matrícula para recuperar dados do aluno
            ValidarMatriculaDTO dto = new ValidarMatriculaDTO(matricula);
            Aluno aluno = primeiroAcessoService.validarMatricula(dto);

            request.setAttribute("step", "2");
            request.setAttribute("aluno", aluno);
            request.setAttribute("erro", mensagemErro);
            request.getRequestDispatcher("cadastro.jsp").forward(request, response);

        } catch (Exception e) {
            // Se falhar ao recuperar aluno, volta para passo 1
            request.setAttribute("erro", mensagemErro);
            request.getRequestDispatcher("cadastro.jsp").forward(request, response);
        }
    }
}