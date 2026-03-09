const API = '/api/v1/cadastro';

async function fazerLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const erroEl = document.getElementById('erroLogin');
    const btn = document.getElementById('btnLogin');

    erroEl.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Entrando...';

    try {
        const res = await fetch(`${API}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const data = await res.json();

        if (!res.ok) {
            erroEl.textContent = data.detail || 'Email ou senha inválidos.';
            erroEl.style.display = 'block';
        } else {

            localStorage.setItem('token', data.access_token);
            localStorage.setItem('perfil', data.perfil);
            localStorage.setItem('nome', data.nome);



            if (data.perfil === "aluno") {
                window.location.href = "aluno/home.html";
            } else if (data.perfil === "professor") {
                window.location.href = "professor/home.html";
            } else if (data.perfil === "administrador") {
                window.location.href = "admin/home.html";
            }

        }

    } catch {
        erroEl.textContent = 'Erro de conexão. Tente novamente.';
        erroEl.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.textContent = 'Entrar';
    }
}