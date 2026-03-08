const API = '/api/v1/cadastro';
let matriculaValidada = '';

async function validarMatricula(event) {
    event.preventDefault();

    const matricula = document.getElementById('matricula').value.trim();
    const erroEl = document.getElementById('erro1');
    const btn = document.getElementById('btnPasso1');

    erroEl.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Verificando...';

    try {
        const res = await fetch(`${API}/validar-matricula`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ matricula })
        });
        const data = await res.json();

        if (!data.valido) {
            erroEl.textContent = data.mensagem || 'Matrícula inválida.';
            erroEl.style.display = 'block';
        } else {
            matriculaValidada = matricula;

            const nome = data.nome || '';
            document.getElementById('subtituloPasso2').textContent =
                nome ? `Olá, ${nome}! Crie seu email e senha` : 'Crie seu email e senha';
            document.getElementById('alertMatricula').innerHTML =
                `<strong>Matrícula validada:</strong> ${matricula}`;

            document.getElementById('passo1').style.display = 'none';
            document.getElementById('passo2').style.display = 'block';
            document.getElementById('email').focus();
        }
    } catch {
        erroEl.textContent = 'Erro de conexão. Tente novamente.';
        erroEl.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.textContent = 'Continuar';
    }
}

async function criarConta(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const confirmar = document.getElementById('confirmar_senha').value;
    const erroEl = document.getElementById('erro2');
    const btn = document.getElementById('btnPasso2');

    erroEl.style.display = 'none';

    if (senha.length < 6) {
        erroEl.textContent = 'A senha deve ter no mínimo 6 caracteres.';
        erroEl.style.display = 'block';
        return;
    }
    if (senha !== confirmar) {
        erroEl.textContent = 'As senhas não coincidem.';
        erroEl.style.display = 'block';
        return;
    }

    btn.disabled = true;
    btn.textContent = 'Criando conta...';

    try {
        const res = await fetch(`${API}/criar-credenciais`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                matricula: matriculaValidada,
                email,
                senha,
                confirmar_senha: confirmar
            })
        });
        const data = await res.json();

        if (!res.ok) {
            erroEl.textContent = data.detail || 'Erro ao criar conta.';
            erroEl.style.display = 'block';
        } else {
            document.getElementById('passo2').style.display = 'none';
            document.getElementById('passo3').style.display = 'block';
        }
    } catch {
        erroEl.textContent = 'Erro de conexão. Tente novamente.';
        erroEl.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.textContent = 'Criar Conta';
    }
}

function voltarPasso1() {
    document.getElementById('passo2').style.display = 'none';
    document.getElementById('passo1').style.display = 'block';
    document.getElementById('erro1').style.display = 'none';
    document.getElementById('matricula').focus();
}