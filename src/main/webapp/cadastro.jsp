<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="COM.institutorme.model.Aluno" %>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instituto RME - Primeiro Acesso</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
<div class="container">
    <div class="banner-section">
        <div class="logo">
            <img src="images/logo.png" alt="Instituto RME">
            <span>Instituto RME</span>
        </div>
        <h1>Bem-vindo ao Instituto RME!</h1>
        <p class="subtitle">Configure seu acesso para começar sua jornada de aprendizado.</p>
    </div>

    <div class="form-section">
        <div class="form-container">
            <%
                String step = (String) request.getAttribute("step");
                Aluno aluno = (Aluno) request.getAttribute("aluno");
                String erro = (String) request.getAttribute("erro");

                if (step == null || !"2".equals(step)) {
                    // PASSO 1: Informar matrícula
            %>

            <h2>Primeiro Acesso</h2>
            <p class="form-subtitle">Informe sua matrícula para começar</p>

            <% if (erro != null) { %>
            <div class="alert alert-error"><%= erro %></div>
            <% } %>

            <form action="cadastro" method="post">
                <input type="hidden" name="step" value="validar-matricula">

                <div class="form-group">
                    <label for="matricula">Matrícula</label>
                    <input type="text" id="matricula" name="matricula" required autofocus>
                    <small style="color: #888; font-size: 12px;">Digite a matrícula fornecida pela secretaria</small>
                </div>

                <button type="submit" class="btn-submit">Continuar</button>
            </form>

            <div style="margin-top: 20px; text-align: center;">
                <a href="login.jsp" style="color: #2d8659; text-decoration: none;">Já tenho cadastro</a>
            </div>

            <% } else {
                // PASSO 2: Criar email e senha
            %>

            <h2>Configurar Acesso</h2>
            <p class="form-subtitle">Olá, <%= aluno.getNome() %>! Crie seu email e senha</p>

            <% if (erro != null) { %>
            <div class="alert alert-error"><%= erro %></div>
            <% } %>

            <div class="alert" style="background-color: rgba(45, 134, 89, 0.1); border: 1px solid rgba(45, 134, 89, 0.3); color: #4ade80; margin-bottom: 20px;">
                <strong>Matrícula validada:</strong> <%= aluno.getMatricula() %>
            </div>

            <form action="cadastro" method="post">
                <input type="hidden" name="step" value="criar-credenciais">
                <input type="hidden" name="matricula" value="<%= aluno.getMatricula() %>">

                <div class="form-group">
                    <label for="email">Email Institucional</label>
                    <input type="email" id="email" name="email" required autofocus>
                    <small style="color: #888; font-size: 12px;">Use um email válido para recuperação de senha</small>
                </div>

                <div class="form-group">
                    <label for="senha">Senha</label>
                    <input type="password" id="senha" name="senha" required>
                    <small style="color: #888; font-size: 12px;">Mínimo 6 caracteres</small>
                </div>

                <div class="form-group">
                    <label for="confirmar_senha">Confirmar Senha</label>
                    <input type="password" id="confirmar_senha" name="confirmar_senha" required>
                </div>

                <button type="submit" class="btn-submit">Criar Conta</button>
            </form>

            <% } %>
        </div>
    </div>
</div>
</body>
</html>