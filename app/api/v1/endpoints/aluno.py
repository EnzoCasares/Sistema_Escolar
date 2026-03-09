from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from jose import jwt, JWTError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.db.session import get_db
from app.config import settings
from app.models.models import Usuario, Aluno, Nota, Observacao, Horario

router = APIRouter()
bearer = HTTPBearer()


def get_usuario_id(credentials: HTTPAuthorizationCredentials = Depends(bearer)) -> int:
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=["HS256"])
        return int(payload["sub"])
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado.")


@router.get("/me")
def get_aluno_me(usuario_id: int = Depends(get_usuario_id), db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()

    if not usuario or not usuario.aluno:
        raise HTTPException(status_code=403, detail="Acesso restrito a alunos.")

    aluno: Aluno = usuario.aluno

    # Busca notas diretamente pela tabela (garante que carrega independente do lazy load)
    notas_db = db.query(Nota).filter(Nota.aluno_id == aluno.id).all()
    notas = []
    for n in notas_db:
        prof = "—"
        if n.materia and n.materia.professor and n.materia.professor.usuario:
            prof = n.materia.professor.usuario.nome
        notas.append({
            "materia":   n.materia.nome if n.materia else "—",
            "professor": prof,
            "nota1":     float(n.nota1) if n.nota1 is not None else None,
            "nota2":     float(n.nota2) if n.nota2 is not None else None,
            "media":     float(n.media) if n.media is not None else None,
        })

    # Busca observações diretamente
    obs_db = db.query(Observacao).filter(Observacao.aluno_id == aluno.id).all()
    observacoes = []
    for o in obs_db:
        prof = "—"
        if o.professor and o.professor.usuario:
            prof = o.professor.usuario.nome
        observacoes.append({
            "materia":    o.materia.nome if o.materia else "Geral",
            "professor":  prof,
            "comentario": o.comentario,
        })

    # Horários pela sala
    horarios = []
    if aluno.sala:
        for h in aluno.sala.horarios:
            prof = "—"
            if h.materia and h.materia.professor and h.materia.professor.usuario:
                prof = h.materia.professor.usuario.nome
            horarios.append({
                "dia":         h.dia,
                "hora_inicio": str(h.hora_inicio) if h.hora_inicio else None,
                "hora_fim":    str(h.hora_fim)    if h.hora_fim    else None,
                "materia":     h.materia.nome if h.materia else "—",
                "professor":   prof,
            })

    return {
        "nome":        usuario.nome,
        "email":       usuario.email,
        "matricula":   aluno.matricula,
        "sala":        aluno.sala.nome if aluno.sala else None,
        "notas":       notas,
        "observacoes": observacoes,
        "horarios":    horarios,
    }


# ──────────────────────────────────────────────────────────
# DEBUG — GET /api/v1/aluno/debug
# Mostra o que existe no banco para o aluno autenticado.
# Use para verificar se os dados estão inseridos corretamente.
# Remova ou restrinja em produção.
# ──────────────────────────────────────────────────────────
@router.get("/debug")
def debug_aluno(usuario_id: int = Depends(get_usuario_id), db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        return {"erro": "Usuário não encontrado", "usuario_id": usuario_id}

    aluno = usuario.aluno
    if not aluno:
        return {
            "erro": "Usuário não tem aluno vinculado",
            "usuario_id":  usuario_id,
            "email":       usuario.email,
            "todos_alunos": [
                {"id": a.id, "matricula": a.matricula, "usuario_id": a.usuario_id}
                for a in db.query(Aluno).all()
            ],
        }

    notas_raw = db.query(Nota).filter(Nota.aluno_id == aluno.id).all()
    obs_raw   = db.query(Observacao).filter(Observacao.aluno_id == aluno.id).all()

    return {
        "usuario_id":      usuario_id,
        "email":           usuario.email,
        "aluno_id":        aluno.id,
        "matricula":       aluno.matricula,
        "sala_id":         aluno.sala_id,
        "sala_nome":       aluno.sala.nome if aluno.sala else None,

        "notas_count":     len(notas_raw),
        "notas": [
            {
                "id":         n.id,
                "materia_id": n.materia_id,
                "materia":    n.materia.nome if n.materia else None,
                "nota1":      float(n.nota1) if n.nota1 else None,
                "nota2":      float(n.nota2) if n.nota2 else None,
                "media":      float(n.media) if n.media else None,
            }
            for n in notas_raw
        ],

        "observacoes_count": len(obs_raw),
        "observacoes": [
            {
                "id":           o.id,
                "materia_id":   o.materia_id,
                "materia":      o.materia.nome if o.materia else None,
                "professor_id": o.professor_id,
                "comentario":   o.comentario,
            }
            for o in obs_raw
        ],

        "horarios_count": len(aluno.sala.horarios) if aluno.sala else 0,
    }