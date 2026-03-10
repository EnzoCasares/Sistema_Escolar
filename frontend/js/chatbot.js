

function initChatbot() {
    
    if (document.querySelector('.chat-widget')) return;

    
    const chatHTML = `
        <div class="chat-toggle" id="chatToggle" title="Falar com Tutor IA">
            <i data-feather="cpu"></i>
        </div>

        <div class="chat-widget hidden" id="chatWidget">
            <div class="chat-header">
                <div class="chat-header-info">
                    <i data-feather="cpu"></i>
                    <h2>Tutor Acadêmico IA</h2>
                </div>
                <div class="chat-close" id="chatClose">
                    <i data-feather="x"></i>
                </div>
            </div>
            
            <div class="chat-messages" id="chatMessages">
                <div class="message ai">Olá! Sou seu Tutor IA. Como posso ajudar com seus estudos e desempenho hoje?</div>
            </div>

            <div class="chat-input-area">
                <input type="text" id="chatInput" placeholder="Pergunte sobre notas, faltas...">
                <button id="chatSendBtn">
                    <i data-feather="send"></i>
                </button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatHTML);
    feather.replace();

    
    const toggle = document.getElementById('chatToggle');
    const widget = document.getElementById('chatWidget');
    const close = document.getElementById('chatClose');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSendBtn');

    toggle.addEventListener('click', () => {
        widget.classList.toggle('hidden');
        if (!widget.classList.contains('hidden')) {
            input.focus();
        }
    });

    close.addEventListener('click', () => {
        widget.classList.add('hidden');
    });

    sendBtn.addEventListener('click', enviarMensagemIA);
    input.addEventListener('keypress', e => {
        if (e.key === 'Enter') enviarMensagemIA();
    });
}

async function enviarMensagemIA() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;

    input.value = '';
    addChatMessage(msg, 'user');

    const loader = showChatLoader();

    try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/v1/ia/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ mensagem: msg })
        });

        if (!res.ok) throw new Error('Erro na requisição');

        const data = await res.json();
        loader.remove();

        if (data.resposta) {
            addChatMessage(data.resposta, 'ai');
        } else {
            addChatMessage("Não consegui processar sua dúvida agora. Pode tentar novamente em instantes?", 'ai');
        }
    } catch (err) {
        loader.remove();
        console.error("Chatbot Error:", err);
        addChatMessage("Houve um erro de conexão com o Tutor IA. Verifique sua rede.", 'ai');
    }
}

function addChatMessage(text, type) {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function showChatLoader() {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'loader';
    div.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return div;
}


document.addEventListener('DOMContentLoaded', initChatbot);

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initChatbot();
}
