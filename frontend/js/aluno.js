

const API_BASE = '/api/v1';


function getToken() {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/login.html'; return null; }
    return token;
}

function logout() {
    localStorage.clear();
    window.location.href = '/login.html';
}


async function apiFetch(path) {
    const token = getToken();
    if (!token) return null;
    const res = await fetch(API_BASE + path, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.status === 401) { logout(); return null; }
    if (!res.ok) throw new Error(`Erro ${res.status} em ${path}`);
    return res.json();
}


function preencherSidebar(dados) {
    const iniciais = dados.nome
        .split(' ')
        .map(p => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const avatarEl = document.getElementById('avatarSidebar');
    const nomeEl = document.getElementById('nomeSidebar');
    if (avatarEl) avatarEl.textContent = iniciais;
    if (nomeEl) nomeEl.textContent = dados.nome.split(' ')[0];
}




function mediaChip(media) {
    if (media === null || media === undefined)
        return '<span style="color:#94a3b8">—</span>';
    const v = parseFloat(media);
    const cls = v >= 7 ? 'green' : v >= 5 ? 'yellow' : 'red';
    return `<span class="media-chip ${cls}">${v.toFixed(1)}</span>`;
}


function fmtHora(h) {
    if (!h) return '—';
    return String(h).slice(0, 5);
}


function capitalize(str) {
    if (!str) return '—';
    return str.charAt(0).toUpperCase() + str.slice(1);
}


function aulaAtual(horarios) {
    const dias = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    const hoje = dias[new Date().getDay()];
    const agora = new Date().toTimeString().slice(0, 5);

    const aula = horarios.find(h =>
        h.dia &&
        h.dia.toLowerCase().includes(hoje.slice(0, 3)) &&
        fmtHora(h.hora_inicio) <= agora &&
        fmtHora(h.hora_fim) >= agora
    );
    return aula
        ? `${aula.materia} · ${fmtHora(aula.hora_inicio)}–${fmtHora(aula.hora_fim)}`
        : 'Sem aula agora';
}


const _ICONES = {
    'matemática': '<i data-feather="pie-chart"></i>', 'mat': '<i data-feather="pie-chart"></i>',
    'português': '<i data-feather="book-open"></i>', 'port': '<i data-feather="book-open"></i>',
    'história': '<i data-feather="clock"></i>', 'hist': '<i data-feather="clock"></i>',
    'geografia': '<i data-feather="map"></i>', 'geo': '<i data-feather="map"></i>',
    'ciências': '<i data-feather="hexagon"></i>', 'cien': '<i data-feather="hexagon"></i>',
    'química': '<i data-feather="droplet"></i>', 'quim': '<i data-feather="droplet"></i>',
    'física': '<i data-feather="zap"></i>', 'fis': '<i data-feather="zap"></i>',
    'biologia': '<i data-feather="activity"></i>', 'bio': '<i data-feather="activity"></i>',
    'inglês': '<i data-feather="globe"></i>', 'ing': '<i data-feather="globe"></i>',
    'sociologia': '<i data-feather="users"></i>', 'soc': '<i data-feather="users"></i>',
    'filosofia': '<i data-feather="sun"></i>', 'fil': '<i data-feather="sun"></i>',
    'educação física': '<i data-feather="dribbble"></i>',
    'arte': '<i data-feather="pen-tool"></i>',
    'música': '<i data-feather="music"></i>',
};

function iconeMateria(nome) {
    const k = nome.toLowerCase();
    for (const [chave, icone] of Object.entries(_ICONES)) {
        if (k.includes(chave)) return icone;
    }
    return '<i data-feather="book"></i>';
}

const _CORES = ['#e0e7ff', '#f3e8ff', '#dcfce7', '#ffedd5', '#fef9c3', '#fee2e2', '#e0f2fe'];
function corIcone(i) { return _CORES[i % _CORES.length]; }


function tagObs(comentario) {
    const txt = (comentario || '').toLowerCase();
    const neg = ['conversa', 'colou', 'faltou', 'esqueceu', 'agressiv', 'indiscipl', 'atrasado', 'bagunça', 'perturbou'];
    const pos = ['parabéns', 'excelente', 'ótimo', 'destaque', 'dedicado', 'participou', 'colabor', 'ajudou', 'melhoria'];
    if (neg.some(p => txt.includes(p))) return { cls: 'negativa', label: 'Atenção' };
    if (pos.some(p => txt.includes(p))) return { cls: 'positiva', label: 'Positivo' };
    return { cls: 'neutra', label: 'Informativo' };
}


function renderNotas(notas) {
    const el = document.getElementById('notasContainer');
    if (!el) return;

    if (!notas.length) {
        el.innerHTML = '<p class="empty">Nenhuma nota registrada.</p>';
        return;
    }

    const rows = notas.map(n => `
        <tr>
            <td>${n.materia}</td>
            <td>${n.nota1 !== null ? parseFloat(n.nota1).toFixed(1) : '—'}</td>
            <td>${n.nota2 !== null ? parseFloat(n.nota2).toFixed(1) : '—'}</td>
            <td>${mediaChip(n.media)}</td>
        </tr>
    `).join('');

    el.innerHTML = `
        <table class="notas-table">
            <thead>
                <tr>
                    <th>Matéria</th>
                    <th>N1</th>
                    <th>N2</th>
                    <th style="text-align:right">Média</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>`;
}

function renderObsHome(observacoes) {
    const el = document.getElementById('obsContainer');
    if (!el) return;

    if (!observacoes.length) {
        el.innerHTML = '<p class="empty">Nenhuma observação registrada.</p>';
        return;
    }

    const items = observacoes.map(o => `
        <div class="obs-item">
            <div class="obs-header">
                <span class="obs-materia">${o.materia}</span>
                <span class="obs-prof">${o.professor}</span>
            </div>
            <p class="obs-texto">${o.comentario || '—'}</p>
        </div>
    `).join('');

    el.innerHTML = `<div class="obs-list">${items}</div>`;
}

function renderGradeHome(horarios) {
    const el = document.getElementById('gradeContainer');
    if (!el) return;

    if (!horarios.length) {
        el.innerHTML = '<p class="empty">Nenhum horário cadastrado.</p>';
        return;
    }

    const _ordemDias = ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo'];
    const ordered = [...horarios].sort((a, b) => {
        const di = d => _ordemDias.findIndex(x => d && d.toLowerCase().includes(x.slice(0, 3)));
        return di(a.dia) - di(b.dia) || (a.hora_inicio || '').localeCompare(b.hora_inicio || '');
    });

    const rows = ordered.map(h => `
        <tr>
            <td><span class="dia-chip">${capitalize(h.dia)}</span></td>
            <td>${fmtHora(h.hora_inicio)} – ${fmtHora(h.hora_fim)}</td>
            <td>${h.materia}</td>
            <td>${h.professor}</td>
        </tr>
    `).join('');

    el.innerHTML = `
        <table class="horario-table">
            <thead>
                <tr><th>Dia</th><th>Horário</th><th>Matéria</th><th>Professor</th></tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>`;
}


async function carregarDados() {
    const token = getToken();
    if (!token) return;

    try {
        const d = await apiFetch('/aluno/me');
        if (!d) return;

        
        preencherSidebar(d);

        
        const salaBadge = document.getElementById('salaBadge');
        const matriculaBadge = document.getElementById('matriculaBadge');
        if (salaBadge) salaBadge.textContent = d.sala || '—';
        if (matriculaBadge) matriculaBadge.textContent = d.matricula;

        
        const heroNome = document.getElementById('heroNome');
        const heroEmail = document.getElementById('heroEmail');
        if (heroNome) heroNome.textContent = `Olá, ${d.nome.split(' ')[0]}!`;
        if (heroEmail) heroEmail.textContent = d.email;

        
        const medias = d.notas.map(n => n.media).filter(m => m !== null);
        const mediaGeral = medias.length
            ? (medias.reduce((a, b) => a + b, 0) / medias.length).toFixed(1)
            : '—';

        const setEl = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
        setEl('statDisciplinas', d.notas.length);
        setEl('statMedia', mediaGeral);
        setEl('statObs', d.observacoes.length);

        
        setEl('cardObsTexto', d.observacoes.length
            ? `${d.observacoes.length} observação(ões) registrada(s)`
            : 'Nenhuma observação');

        setEl('cardAulaAtual', aulaAtual(d.horarios));

        const melhor = d.notas
            .filter(n => n.media !== null)
            .sort((a, b) => b.media - a.media)[0];
        setEl('cardMelhorNota', melhor
            ? `${melhor.materia}: ${parseFloat(melhor.media).toFixed(1)}`
            : 'Sem notas');

        
        renderNotas(d.notas);
        renderObsHome(d.observacoes);
        renderGradeHome(d.horarios);

    } catch (err) {
        console.error('Erro ao carregar home:', err);
        const heroEmail = document.getElementById('heroEmail');
        if (heroEmail) heroEmail.textContent = 'Erro ao carregar dados. Tente novamente.';
    }
}


async function initPagina() {
    if (!getToken()) return null;
    try {
        const dados = await apiFetch('/aluno/me');
        if (dados) preencherSidebar(dados);
        return dados;
    } catch (e) {
        console.error('Erro ao inicializar página:', e);
        return null;
    }
}