document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cadastroForm');

    if (form) {
        form.addEventListener('submit', function(e) {
            const matricula = document.getElementById('matricula').value.trim();
            const email = document.getElementById('email').value.trim();
            const senha = document.getElementById('senha').value;

            // Validação de matrícula
            if (matricula === '') {
                e.preventDefault();
                showError('Por favor, informe a matrícula.');
                return false;
            }

            // Validação de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                e.preventDefault();
                showError('Por favor, informe um email válido.');
                return false;
            }

            // Validação de senha
            if (senha.length < 6) {
                e.preventDefault();
                showError('A senha deve ter no mínimo 6 caracteres.');
                return false;
            }

            showLoading();
        });

        // Limpa mensagens de erro ao digitar
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                hideError();
            });
        });
    }
});

// Função para mostrar erro
function showError(message) {
    // Remove alertas anteriores
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());

    // Cria novo alerta
    const alert = document.createElement('div');
    alert.className = 'alert alert-error';
    alert.textContent = message;

    const form = document.getElementById('cadastroForm');
    form.insertBefore(alert, form.firstChild);

    // Remove após 5 segundos
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Função para esconder erro
function hideError() {
    const alerts = document.querySelectorAll('.alert-error');
    alerts.forEach(alert => {
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 300);
    });
}

// Função para mostrar loading no botão
function showLoading() {
    const btn = document.querySelector('.btn-submit');
    btn.disabled = true;
    btn.textContent = 'Cadastrando...';
}


const matriculaInput = document.getElementById('matricula');
if (matriculaInput) {
    matriculaInput.addEventListener('input', function(e) {
        // Remove caracteres não numéricos
        let value = e.target.value.replace(/\D/g, '');

        // Limita a 10 dígitos (exemplo)
        if (value.length > 10) {
            value = value.slice(0, 10);
        }

        e.target.value = value;
    });
}


const senhaInput = document.getElementById('senha');
if (senhaInput) {
    senhaInput.addEventListener('input', function(e) {
        const senha = e.target.value;

        if (senha.length >= 8 && /[A-Z]/.test(senha) && /[0-9]/.test(senha)) {
            senhaInput.style.borderColor = '#22c55e'; // Verde - forte
        } else if (senha.length >= 6) {
            senhaInput.style.borderColor = '#eab308'; // Amarelo - média
        } else {
            senhaInput.style.borderColor = '#2a2a2a'; // Padrão
        }
    });
}