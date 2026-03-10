

const API_BASE = '/api/v1';


function getToken() {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '../login.html'; return null; }
    return token;
}

function logout() {
    localStorage.clear();
    window.location.href = '../login.html';
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
    const nomeProf = dados.nome || 'Professor';
    const iniciais = nomeProf
        .split(' ')
        .map(p => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    
    const avatarEls = document.querySelectorAll('.sidebar-user .avatar');
    avatarEls.forEach(el => el.textContent = iniciais);

    
    const nomeEls = document.querySelectorAll('.sidebar-user .u-name');
    nomeEls.forEach(el => el.textContent = `${nomeProf.split(' ')[0]}`);
}



function mediaChip(media) {
    if (media === null || media === undefined)
        return '<span style="color:#94a3b8">—</span>';
    const v = parseFloat(media);
    const corClass = v >= 7 ? 'color: #10b981' : v >= 5 ? 'color: #f59e0b' : 'color: #ef4444';
    return `<span style="font-weight:600; ${corClass}">${v.toFixed(1)}</span>`;
}

function fmtHora(h) {
    if (!h) return '—';
    return String(h).slice(0, 5);
}

function capitalize(str) {
    if (!str) return '—';
    return str.charAt(0).toUpperCase() + str.slice(1);
}




async function renderHome() {
    try {
        const [me, salasRes, horariosRes, notasRes] = await Promise.all([
            apiFetch('/professor/me'),
            apiFetch('/professor/salas'),
            apiFetch('/professor/horarios'),
            apiFetch('/professor/notas')
        ]);

        if (!me) return;
        preencherSidebar(me);

        
        const heroNome = document.getElementById('heroNome');
        const heroTurmas = document.getElementById('heroTurmas');
        if (heroNome) heroNome.textContent = `Olá, Prof. ${me.nome.split(' ')[0]}!`;
        if (heroTurmas) heroTurmas.textContent = `Você tem ${me.total_turmas} turmas sob sua responsabilidade hoje.`;

        const statAlunos = document.getElementById('statAlunos');
        const statTurmas = document.getElementById('statTurmas');
        if (statAlunos) statAlunos.textContent = `${me.total_alunos} alunos ativos`;
        if (statTurmas) statTurmas.textContent = `${me.total_turmas} turmas atribuídas`;

        
        const glassCards = document.querySelectorAll('.glass-card');
        if (glassCards.length >= 4) {
            const card3 = glassCards[2];
            const proxAula = horariosRes?.horarios?.[0]?.materia || 'Nenhuma';
            const card3H3 = card3.querySelector('h3');
            const card3P = card3.querySelector('p');
            const card3IconCont = card3.querySelector('.card-icon');
            const card3Icon = card3.querySelector('i');

            if (card3H3) card3H3.textContent = 'Próxima Aula';
            if (card3P) card3P.textContent = proxAula;
            if (card3IconCont) card3IconCont.className = 'card-icon sky';
            if (card3Icon) card3Icon.setAttribute('data-feather', 'calendar');

            const card4 = glassCards[3];
            const card4H3 = card4.querySelector('h3');
            const card4P = card4.querySelector('p');
            const card4IconCont = card4.querySelector('.card-icon');
            const card4Icon = card4.querySelector('i');

            if (card4H3) card4H3.textContent = 'Turma';
            if (card4P) card4P.textContent = me.total_turmas > 0 ? 'Acompanhamento Ativo' : 'Nenhuma';
            if (card4IconCont) card4IconCont.className = 'card-icon indigo';
            if (card4Icon) card4Icon.setAttribute('data-feather', 'pie-chart');

            feather.replace();
        }

        
        const tituloTurma = document.getElementById('tituloTurma');
        const tbody = document.querySelector('.recent-section tbody');

        let alunosRes = null;

        if (salasRes?.salas?.length > 0) {
            const salaId = salasRes.salas[0].id;
            const turmaNome = salasRes.salas[0].nome;

            if (tituloTurma) {
                tituloTurma.innerHTML = `<i data-feather="list"></i> Acompanhamento: ${turmaNome}`;
                feather.replace();
            }

            alunosRes = await apiFetch(`/professor/alunos?sala_id=${salaId}`);
        } else {
            if (tituloTurma) {
                tituloTurma.innerHTML = `<i data-feather="list"></i> Nenhuma turma encontrada`;
                feather.replace();
            }
        }
        if (tbody && alunosRes && alunosRes.alunos) {
            const alunos = alunosRes.alunos.slice(0, 8);
            if (!alunos.length) {
                tbody.innerHTML = '<tr><td colspan="5" class="empty">Nenhum aluno encontrado nesta turma.</td></tr>';
            } else {
                tbody.innerHTML = alunos.map(a => {
                    const n1 = (a.notas && a.notas.length > 0 && a.notas[0].nota1 !== null)
                        ? parseFloat(a.notas[0].nota1).toFixed(1)
                        : '—';
                    return `
                        <tr>
                            <td><strong>${a.nome}</strong></td>
                            <td>0</td>
                            <td>${n1}</td>
                            <td><span class="status-badge status-done">Ativo</span></td>
                            <td><button class="btn-icon" onclick="window.location.href='notas.html'">Ver</button></td>
                        </tr>
                    `;
                }).join('');
            }
        } else if (tbody) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty">Nenhum dado de aluno disponível.</td></tr>';
        }

        
        const searchInput = document.querySelector('.search-bar input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const rows = document.querySelectorAll('.recent-section tbody tr');
                rows.forEach(row => {
                    const text = row.innerText.toLowerCase();
                    row.style.display = text.includes(term) ? '' : 'none';
                });
            });
        }

    } catch (err) {
        console.error("Erro renderHome", err);
        const tbody = document.querySelector('.recent-section tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty" style="color:#ef4444;">Erro ao carregar dados. Verifique sua conexão.</td></tr>';
        }
    }
}


async function renderGradeHoraria() {
    try {
        const [me, res] = await Promise.all([
            apiFetch('/professor/me'),
            apiFetch('/professor/horarios')
        ]);
        if (!me) return;
        preencherSidebar(me);

        const lista = document.getElementById('listaGrade');
        const draw = (horarios) => {
            if (!horarios || !horarios.length) {
                lista.innerHTML = '<p class="empty" style="text-align:center;width:100%;color:#64748b;">Nenhum horário cadastrado.</p>';
            } else {
                const _ordemDias = ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo'];
                const ordered = [...horarios].sort((a, b) => {
                    const di = d => _ordemDias.findIndex(x => d && d.toLowerCase().includes(x.slice(0, 3)));
                    return di(a.dia) - di(b.dia) || (a.hora_inicio || '').localeCompare(b.hora_inicio || '');
                });

                lista.innerHTML = ordered.map(h => `
                    <div class="grade-card">
                        <div class="grade-horario">
                            <span class="hora-inicio">${fmtHora(h.hora_inicio)}</span>
                            <span class="hora-sep">até</span>
                            <span class="hora-fim">${fmtHora(h.hora_fim)}</span>
                        </div>
                        <div class="grade-info">
                            <strong>${h.materia}</strong>
                            <span>Turma/Sala</span>
                        </div>
                        <span class="grade-sala">${h.sala || '—'}</span>
                        <span class="dia-chip" style="margin-left: 10px;">${capitalize(h.dia)}</span>
                    </div>
                 `).join('');
            }
        };

        draw(res?.horarios);

        const searchInput = document.getElementById('filtroGrade');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const filtered = res.horarios.filter(h =>
                    (h.materia && h.materia.toLowerCase().includes(term)) ||
                    (h.sala && h.sala.toLowerCase().includes(term)) ||
                    (h.dia && h.dia.toLowerCase().includes(term))
                );
                draw(filtered);
            });
        }
    } catch (err) {
        console.error("Erro renderGradeHoraria", err);
        const lista = document.getElementById('listaGrade');
        if (lista) {
            lista.innerHTML = '<p class="empty" style="text-align:center;width:100%;color:#ef4444;">Erro ao carregar a grade. Tente atualizar.</p>';
        }
    }
}


async function renderMeusAlunos() {
    try {
        const [me, res] = await Promise.all([
            apiFetch('/professor/me'),
            apiFetch('/professor/alunos')
        ]);
        if (!me) return;
        preencherSidebar(me);

        const tbody = document.querySelector('tbody');
        const searchInput = document.querySelector('.search-bar input');

        function draw(alunos) {
            if (!alunos || !alunos.length) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center" class="empty">Nenhum aluno encontrado.</td></tr>';
            } else {
                tbody.innerHTML = alunos.map(a => {
                    const materia = a.materia || a.materia_nome || '—';
                    return `
                         <tr>
                             <td>${a.matricula || a.id}</td>
                             <td><strong>${a.nome}</strong></td>
                             <td><span class="materia-badge">${materia}</span></td>
                             <td>Manhã</td>
                             <td><span class="status-badge status-done">Matriculado</span></td>
                             <td><button class="btn-icon" onclick="window.location.href='notas.html'">Notas →</button></td>
                         </tr>
                     `;
                }).join('');
            }
        }

        draw(res?.alunos);

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const filtered = res.alunos.filter(a =>
                    a.nome.toLowerCase().includes(term) ||
                    (a.matricula && a.matricula.toLowerCase().includes(term)) ||
                    (a.sala && a.sala.toLowerCase().includes(term))
                );
                draw(filtered);
            });
        }

    } catch (err) {
        console.error("Erro renderMeusAlunos", err);
    }
}


async function renderNotas() {
    try {
        const [me, res] = await Promise.all([
            apiFetch('/professor/me'),
            apiFetch('/professor/notas')
        ]);
        if (!me) return;
        preencherSidebar(me);

        const tbody = document.querySelector('tbody');
        const searchInput = document.querySelector('.search-bar input');

        function draw(notas) {
            if (!notas || !notas.length) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center" class="empty">Nenhuma nota registrada.</td></tr>';
            } else {
                tbody.innerHTML = notas.map(n => {
                    const nota1 = n.nota1 !== null ? parseFloat(n.nota1).toFixed(2) : '—';
                    const nota2 = n.nota2 !== null ? parseFloat(n.nota2).toFixed(2) : '—';
                    const media = n.media !== null ? parseFloat(n.media).toFixed(2) : '—';
                    const mediaNum = n.media !== null ? parseFloat(n.media) : null;
                    const mediaClass = mediaNum === null ? '' : mediaNum >= 7 ? 'status-done' : mediaNum >= 5 ? 'status-pending' : 'status-alert';
                    return `
                         <tr>
                             <td>${n.aluno_matricula}</td>
                             <td>${n.aluno_nome}</td>
                             <td><span class="materia-badge">${n.materia_nome || '—'}</span></td>
                             <td>${nota1}</td>
                             <td>${nota2}</td>
                             <td><span class="status-badge ${mediaClass}">${media}</span></td>
                         </tr>
                     `;
                }).join('');
            }
        }

        draw(res?.notas);

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const filtered = res.notas.filter(n =>
                    n.aluno_nome.toLowerCase().includes(term) ||
                    n.aluno_matricula.toLowerCase().includes(term) ||
                    (n.materia_nome && n.materia_nome.toLowerCase().includes(term))
                );
                draw(filtered);
            });
        }

    } catch (err) {
        console.error("Erro renderNotas", err);
    }
}



async function renderObservacoes() {
    try {
        const [me, res] = await Promise.all([
            apiFetch('/professor/me'),
            apiFetch('/professor/observacoes')
        ]);
        if (!me) return;
        preencherSidebar(me);

        const lista = document.querySelector('.lista-observacoes');
        const searchInput = document.getElementById('filtroObs');

        function draw(obs) {
            if (!obs || !obs.length) {
                lista.innerHTML = '<p class="empty" style="text-align:center;width:100%;color:#64748b;">Nenhuma observação registrada.</p>';
            } else {
                lista.innerHTML = obs.map(o => {
                    let comentario = o.comentario || 'Sem descrição.';
                    let tipo = 'Informativo';
                    let tagClass = 'neutra';

                    
                    if (comentario.startsWith('[')) {
                        const endIdx = comentario.indexOf(']');
                        if (endIdx !== -1) {
                            tipo = comentario.substring(1, endIdx);
                            comentario = comentario.substring(endIdx + 1).trim();

                            const t = tipo.toLowerCase();
                            if (t === 'comportamento') tagClass = 'negativa';
                            else if (t === 'desempenho') tagClass = 'positiva';
                        }
                    }

                    return `
                        <div class="obs-card">
                            <div class="obs-card-body">
                                <div class="obs-card-titulo">
                                    <strong>${o.aluno_nome}</strong>
                                    <span class="obs-tag ${tagClass}">${tipo}</span>
                                </div>
                                <p class="obs-card-prof">Matéria: ${o.materia || '—'}</p>
                                <p class="obs-card-texto">${comentario}</p>
                            </div>
                            <span class="obs-card-data">${new Date().toLocaleDateString('pt-BR')}</span>
                        </div>
                    `;
                }).join('');
            }
        }

        draw(res?.observacoes);

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const filtered = res.observacoes.filter(o =>
                    o.aluno_nome.toLowerCase().includes(term) ||
                    o.comentario.toLowerCase().includes(term) ||
                    (o.materia && o.materia.toLowerCase().includes(term))
                );
                draw(filtered);
            });
        }
    } catch (err) {
        console.error("Erro renderObservacoes", err);
    }
}


async function abrirModalNota() {
    const modal = document.getElementById('modalLancarNota');
    if (!modal) return;

    document.getElementById('formLancarNota').reset();
    document.getElementById('selectAluno').innerHTML = '<option value="">Selecione a sala primeiro</option>';
    
    const r = document.getElementById('tipoN1');
    if (r) r.checked = true;

    modal.style.display = 'flex';
    await carregarOpcoesModal();
}

function fecharModalNota() {
    const modal = document.getElementById('modalLancarNota');
    if (modal) modal.style.display = 'none';
}

async function carregarOpcoesModal() {
    try {
        const [materiasRes, salasRes] = await Promise.all([
            apiFetch('/professor/materias'),
            apiFetch('/professor/salas')
        ]);

        const selMateria = document.getElementById('selectMateria');
        const selSala = document.getElementById('selectSala');

        if (materiasRes && materiasRes.materias) {
            selMateria.innerHTML = '<option value="">Selecione uma matéria</option>' +
                materiasRes.materias.map(m => `<option value="${m.id}">${m.nome}</option>`).join('');
        }

        if (salasRes && salasRes.salas) {
            selSala.innerHTML = '<option value="">Selecione a sala/turma</option>' +
                salasRes.salas.map(s => `<option value="${s.id}">${s.nome}</option>`).join('');
        }
    } catch (err) {
        console.error('Erro ao carregar opções do modal', err);
        mostrarToast('Erro ao carregar dados', 'Verifique sua conexão e tente novamente.', 'erro');
    }
}

async function aoMudarSala(salaId) {
    const selAluno = document.getElementById('selectAluno');
    selAluno.innerHTML = '<option value="">Carregando alunos...</option>';

    if (!salaId) {
        selAluno.innerHTML = '<option value="">Selecione a sala primeiro</option>';
        return;
    }

    try {
        const res = await apiFetch(`/professor/alunos?sala_id=${salaId}`);
        if (res && res.alunos) {
            if (res.alunos.length === 0) {
                selAluno.innerHTML = '<option value="">Nenhum aluno nesta sala</option>';
            } else {
                selAluno.innerHTML = '<option value="">Selecione o aluno</option>' +
                    res.alunos.map(a => `<option value="${a.id}" data-nome="${a.nome}">${a.matricula} - ${a.nome}</option>`).join('');
            }
        }
    } catch (err) {
        console.error('Erro ao carregar alunos no modal', err);
        selAluno.innerHTML = '<option value="">Erro ao carregar</option>';
    }
}

async function iniciarSalvarNota(event) {
    event.preventDefault();

    const materiaId = document.getElementById('selectMateria').value;
    const alunoId = document.getElementById('selectAluno').value;
    const notaVal = document.getElementById('inputNota').value;
    const tipo = document.querySelector('input[name="tipoNota"]:checked')?.value || 'n1';

    if (!materiaId || !alunoId || !notaVal) {
        mostrarToast('Campos obrigatórios', 'Preencha todos os campos antes de continuar.', 'aviso');
        return;
    }

    const selAluno = document.getElementById('selectAluno');
    const nomeAluno = selAluno.options[selAluno.selectedIndex]?.dataset?.nome || 'este aluno';
    const tipoLabel = tipo.toUpperCase();

    
    let notaExistente = false;
    try {
        const notas = await apiFetch('/professor/notas');
        if (notas && notas.notas) {
            notaExistente = notas.notas.some(n =>
                String(n.aluno_id) === String(alunoId) &&
                String(n.materia_id) === String(materiaId) &&
                (tipo === 'n1' ? n.nota1 !== null : n.nota2 !== null)
            );
        }
    } catch {  }

    if (notaExistente) {
        
        confirmar(
            '⚠️',
            'Nota já existente',
            `Essa nota já existe para ${nomeAluno}.\nTem certeza que deseja continuar? A nota existente será alterada.`,
            'Confirmar alteração',
            () => confirmarLancarNota(alunoId, materiaId, notaVal, tipo, nomeAluno, tipoLabel)
        );
    } else {
        confirmar(
            '📋',
            'Lançar Nota',
            'Confirmar lançamento da nota?',
            'Confirmar',
            () => confirmarLancarNota(alunoId, materiaId, notaVal, tipo, nomeAluno, tipoLabel)
        );
    }
}

async function confirmarLancarNota(alunoId, materiaId, notaVal, tipo, nomeAluno, tipoLabel) {
    const btn = document.getElementById('btnSalvarNota');
    if (btn) { btn.textContent = 'Salvando...'; btn.disabled = true; }

    try {
        const token = getToken();
        const res = await fetch(API_BASE + '/professor/notas', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                aluno_id: parseInt(alunoId),
                materia_id: parseInt(materiaId),
                nota: parseFloat(notaVal),
                tipo: tipo
            })
        });

        if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            throw new Error(errBody.detail || 'Erro ao salvar nota');
        }

        fecharModalNota();
        mostrarToast('Nota lançada com sucesso.', '', 'sucesso');

        
        const tbody = document.querySelector('tbody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="loading" style="text-align:center;padding:2rem;">Carregando notas...</td></tr>';
        if (typeof renderNotas === 'function') renderNotas();
    } catch (err) {
        console.error('Erro ao salvar nota', err);
        mostrarToast('Erro ao lançar a nota. Tente novamente.', '', 'erro');
    } finally {
        if (btn) { btn.textContent = 'Lançar Nota'; btn.disabled = false; }
    }
}


async function abrirModalObservacao() {
    const modal = document.getElementById('modalObservacao');
    if (!modal) return;

    document.getElementById('formObservacao').reset();
    document.getElementById('obsSelectAluno').innerHTML = '<option value="">Selecione a sala primeiro</option>';
    modal.style.display = 'flex';

    await carregarOpcoesObsModal();
}

function fecharModalObservacao() {
    const modal = document.getElementById('modalObservacao');
    if (modal) modal.style.display = 'none';
}

async function carregarOpcoesObsModal() {
    try {
        const [materiasRes, salasRes] = await Promise.all([
            apiFetch('/professor/materias'),
            apiFetch('/professor/salas')
        ]);

        const selMateria = document.getElementById('obsSelectMateria');
        const selSala = document.getElementById('obsSelectSala');

        if (materiasRes && materiasRes.materias) {
            selMateria.innerHTML = '<option value="">Selecione uma matéria</option>' +
                materiasRes.materias.map(m => `<option value="${m.id}">${m.nome}</option>`).join('');
        }
        if (salasRes && salasRes.salas) {
            selSala.innerHTML = '<option value="">Selecione a sala/turma</option>' +
                salasRes.salas.map(s => `<option value="${s.id}">${s.nome}</option>`).join('');
        }
    } catch (err) {
        console.error('Erro ao carregar opções da observação', err);
        mostrarToast('Erro ao carregar dados', 'Verifique sua conexão.', 'erro');
    }
}

async function obsAoMudarSala(salaId) {
    const selAluno = document.getElementById('obsSelectAluno');
    selAluno.innerHTML = '<option value="">Carregando alunos...</option>';

    if (!salaId) {
        selAluno.innerHTML = '<option value="">Selecione a sala primeiro</option>';
        return;
    }

    try {
        const res = await apiFetch(`/professor/alunos?sala_id=${salaId}`);
        if (res && res.alunos) {
            selAluno.innerHTML = res.alunos.length === 0
                ? '<option value="">Nenhum aluno nesta sala</option>'
                : '<option value="">Selecione o aluno</option>' +
                res.alunos.map(a => `<option value="${a.id}" data-nome="${a.nome}">${a.matricula} - ${a.nome}</option>`).join('');
        }
    } catch (err) {
        selAluno.innerHTML = '<option value="">Erro ao carregar</option>';
    }
}

async function iniciarSalvarObservacao(event) {
    event.preventDefault();

    const materiaId = document.getElementById('obsSelectMateria').value;
    const alunoId = document.getElementById('obsSelectAluno').value;
    const tipo = document.getElementById('obsTipo').value;
    const comentario = document.getElementById('obsComentario').value.trim();

    if (!materiaId || !alunoId || !comentario || !tipo) {
        mostrarToast('Campos obrigatórios', 'Preencha todos os campos antes de continuar.', 'aviso');
        return;
    }

    const selAluno = document.getElementById('obsSelectAluno');
    const nomeAluno = selAluno.options[selAluno.selectedIndex]?.dataset?.nome || 'este aluno';

    const comentarioFinal = `[${tipo}] ${comentario}`;

    confirmar(
        'message-square',
        'Nova Observação',
        'Confirmar registro de observação?',
        'Confirmar',
        () => confirmarSalvarObservacao(alunoId, materiaId, comentarioFinal, nomeAluno)
    );
}

async function confirmarSalvarObservacao(alunoId, materiaId, comentario, nomeAluno) {
    const btn = document.getElementById('btnSalvarObs');
    if (btn) { btn.textContent = 'Salvando...'; btn.disabled = true; }

    try {
        const token = getToken();
        const res = await fetch(API_BASE + '/professor/observacoes', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                aluno_id: parseInt(alunoId),
                materia_id: parseInt(materiaId),
                comentario: comentario
            })
        });

        if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            throw new Error(errBody.detail || 'Erro ao salvar observação');
        }

        fecharModalObservacao();
        mostrarToast('Observação salva com sucesso.', '', 'sucesso');

        
        const lista = document.querySelector('.lista-observacoes');
        if (lista) lista.innerHTML = '<div class="obs-card loading" style="text-align:center;padding:2rem;">Atualizando...</div>';
        if (typeof renderObservacoes === 'function') renderObservacoes();
    } catch (err) {
        console.error('Erro ao salvar observação', err);
        mostrarToast('Erro ao salvar a observação. Tente novamente.', '', 'erro');
    } finally {
        if (btn) { btn.textContent = 'Salvar'; btn.disabled = false; }
    }
}


function confirmar(iconeFeather, titulo, mensagem, labelOk, onConfirm) {
    const modal = document.getElementById('modalConfirmacao');
    if (!modal) { onConfirm(); return; }

    const iconEl = document.getElementById('confirmIcon');
    iconEl.innerHTML = `<i data-feather="${iconeFeather}"></i>`;
    feather.replace();

    document.getElementById('confirmTitulo').textContent = titulo;
    document.getElementById('confirmMensagem').textContent = mensagem;
    document.getElementById('btnConfirmOk').textContent = labelOk;

    modal.style.display = 'flex';

    const btnOk = document.getElementById('btnConfirmOk');
    const btnCan = document.getElementById('btnConfirmCancelar');

    
    const newOk = btnOk.cloneNode(true);
    const newCan = btnCan.cloneNode(true);
    btnOk.parentNode.replaceChild(newOk, btnOk);
    btnCan.parentNode.replaceChild(newCan, btnCan);

    newOk.addEventListener('click', () => {
        modal.style.display = 'none';
        onConfirm();
    });
    newCan.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}


function mostrarToast(titulo, mensagem, tipo = 'sucesso') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const icons = { sucesso: 'check-circle', erro: 'x-circle', aviso: 'alert-triangle' };
    const cssClass = tipo === 'erro' ? 'toast-error' : tipo === 'aviso' ? 'toast-warning' : '';

    const toast = document.createElement('div');
    toast.className = `toast ${cssClass}`;
    toast.innerHTML = `
        <div class="toast-icon"><i data-feather="${icons[tipo] || 'check-circle'}"></i></div>
        <div class="toast-body">
            <div class="toast-title">${titulo}</div>
            <div class="toast-msg">${mensagem}</div>
        </div>
    `;

    container.appendChild(toast);
    feather.replace();

    
    setTimeout(() => {
        toast.classList.add('dismissing');
        setTimeout(() => toast.remove(), 280);
    }, 4000);

    
    toast.addEventListener('click', () => {
        toast.classList.add('dismissing');
        setTimeout(() => toast.remove(), 280);
    });
}
