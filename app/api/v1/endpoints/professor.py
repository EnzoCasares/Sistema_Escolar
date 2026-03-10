from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.db.session import get_db
from app.config import settings
from app.models.models import Usuario, Professor, Nota, Observacao, Horario, Aluno, Materia, Sala

from typing import Optional, Literal
from pydantic import BaseModel

class NotaProcess(BaseModel):
    aluno_id: int
    materia_id: int
    nota: float
    tipo: Optional[Literal['n1', 'n2']] = 'n1'

class ObservacaoCreate(BaseModel):
    aluno_id: int
    materia_id: int
    comentario: str

router = APIRouter()
bearer = HTTPBearer()

def get_usuario_id(credentials: HTTPAuthorizationCredentials = Depends(bearer)) -> int:
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=["HS256"])
        return int(payload["sub"])
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado.")


@router.get("/me")
def get_professor_me(usuario_id: int = Depends(get_usuario_id), db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()

    if not usuario or not usuario.professor:
        raise HTTPException(status_code=403, detail="Acesso restrito a professores.")

    professor: Professor = usuario.professor

    
    salas_ids = set()
    for materia in professor.materias:
        for horario in materia.horarios:
            if horario.sala_id:
                salas_ids.add(horario.sala_id)
                
    total_turmas = len(salas_ids)
    
    total_alunos = 0
    if salas_ids:
        total_alunos = db.query(Aluno).filter(Aluno.sala_id.in_(salas_ids)).count()

    return {
        "nome": usuario.nome,
        "email": usuario.email,
        "total_turmas": total_turmas,
        "total_alunos": total_alunos,
    }


@router.get("/horarios")
def get_professor_horarios(usuario_id: int = Depends(get_usuario_id), db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()

    if not usuario or not usuario.professor:
        raise HTTPException(status_code=403, detail="Acesso restrito a professores.")

    professor: Professor = usuario.professor
    horarios_list = []

    for materia in professor.materias:
        for horario in materia.horarios:
            horarios_list.append({
                "dia": horario.dia,
                "hora_inicio": str(horario.hora_inicio) if horario.hora_inicio else None,
                "hora_fim": str(horario.hora_fim) if horario.hora_fim else None,
                "sala": horario.sala.nome if horario.sala else "—",
                "materia": materia.nome
            })

    return {"horarios": horarios_list}


@router.get("/materias")
def get_professor_materias(usuario_id: int = Depends(get_usuario_id), db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario or not usuario.professor:
        raise HTTPException(status_code=403, detail="Acesso restrito a professores.")
    
    materias_list = [{"id": m.id, "nome": m.nome} for m in usuario.professor.materias]
    return {"materias": materias_list}


@router.get("/salas")
def get_professor_salas(usuario_id: int = Depends(get_usuario_id), db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario or not usuario.professor:
        raise HTTPException(status_code=403, detail="Acesso restrito a professores.")
    
    salas_ids = set()
    for m in usuario.professor.materias:
        for h in m.horarios:
            if h.sala_id:
                salas_ids.add(h.sala_id)
                
    salas_db = db.query(Sala).filter(Sala.id.in_(salas_ids)).all()
    salas_list = [{"id": s.id, "nome": s.nome} for s in salas_db]
    return {"salas": salas_list}


@router.get("/alunos")
def get_professor_alunos(sala_id: Optional[int] = None, usuario_id: int = Depends(get_usuario_id), db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()

    if not usuario or not usuario.professor:
        raise HTTPException(status_code=403, detail="Acesso restrito a professores.")

    professor: Professor = usuario.professor
    
    
    salas_ids = set()
    materias_ids = []
    for materia in professor.materias:
        materias_ids.append(materia.id)
        for horario in materia.horarios:
            if horario.sala_id:
                salas_ids.add(horario.sala_id)

    if not salas_ids:
        return {"alunos": []}

    query = db.query(Aluno).filter(Aluno.sala_id.in_(salas_ids))
    if sala_id:
        query = query.filter(Aluno.sala_id == sala_id)

    alunos_db = query.all()
    alunos_list = []

    for aluno in alunos_db:
        
        notas_aluno = db.query(Nota).filter(
            Nota.aluno_id == aluno.id,
            Nota.materia_id.in_(materias_ids)
        ).all()
        
        notas_simplificadas = []
        for n in notas_aluno:
             notas_simplificadas.append({
                 "materia": n.materia.nome if n.materia else "—",
                 "nota1": float(n.nota1) if n.nota1 is not None else None,
                 "nota2": float(n.nota2) if n.nota2 is not None else None,
                 "media": float(n.media) if n.media is not None else None,
             })

        alunos_list.append({
            "id": aluno.id,
            "matricula": aluno.matricula,
            "nome": aluno.usuario.nome if aluno.usuario else "—",
            "sala": aluno.sala.nome if aluno.sala else "—",
            "notas": notas_simplificadas
        })

    return {"alunos": alunos_list}


@router.get("/notas")
def get_professor_notas(usuario_id: int = Depends(get_usuario_id), db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()

    if not usuario or not usuario.professor:
        raise HTTPException(status_code=403, detail="Acesso restrito a professores.")

    professor: Professor = usuario.professor
    materias_ids = [m.id for m in professor.materias]

    if not materias_ids:
         return {"notas": []}

    notas_db = db.query(Nota).filter(Nota.materia_id.in_(materias_ids)).all()
    notas_list = []

    for n in notas_db:
        notas_list.append({
            "id": n.id,
            "aluno_id": n.aluno_id,
            "materia_id": n.materia_id,
            "aluno_nome": n.aluno.usuario.nome if n.aluno and n.aluno.usuario else "—",
            "aluno_matricula": n.aluno.matricula if n.aluno else "—",
            "materia_nome": n.materia.nome if n.materia else "—",
            "nota1": float(n.nota1) if n.nota1 is not None else None,
            "nota2": float(n.nota2) if n.nota2 is not None else None,
            "media": float(n.media) if n.media is not None else None,
        })

    return {"notas": notas_list}


@router.post("/notas")
def salvar_nota(payload: NotaProcess, usuario_id: int = Depends(get_usuario_id), db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario or not usuario.professor:
        raise HTTPException(status_code=403, detail="Acesso restrito a professores.")
    
    
    materia = db.query(Materia).filter(Materia.id == payload.materia_id, Materia.professor_id == usuario.professor.id).first()
    if not materia:
        raise HTTPException(status_code=403, detail="Matéria não pertence ao professor logado.")
        
    aluno = db.query(Aluno).filter(Aluno.id == payload.aluno_id).first()
    if not aluno:
        raise HTTPException(status_code=404, detail="Aluno não encontrado.")
        
    
    nota_existente = db.query(Nota).filter(
        Nota.aluno_id == payload.aluno_id,
        Nota.materia_id == payload.materia_id
    ).first()

    tipo = payload.tipo or 'n1'

    if nota_existente:
        
        if tipo == 'n2':
            nota_existente.nota2 = payload.nota
        else:
            nota_existente.nota1 = payload.nota
        
        n1 = float(nota_existente.nota1) if nota_existente.nota1 is not None else None
        n2 = float(nota_existente.nota2) if nota_existente.nota2 is not None else None
        if n1 is not None and n2 is not None:
            nota_existente.media = round((n1 + n2) / 2, 2)
        elif n1 is not None:
            nota_existente.media = n1
        elif n2 is not None:
            nota_existente.media = n2
    else:
        
        nova_nota = Nota(
            aluno_id=payload.aluno_id,
            materia_id=payload.materia_id,
            nota1=payload.nota if tipo == 'n1' else None,
            nota2=payload.nota if tipo == 'n2' else None,
            media=payload.nota
        )
        db.add(nova_nota)

    db.commit()
    return {"message": "Nota salva com sucesso"}


@router.get("/observacoes")
def get_professor_observacoes(usuario_id: int = Depends(get_usuario_id), db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()

    if not usuario or not usuario.professor:
        raise HTTPException(status_code=403, detail="Acesso restrito a professores.")

    professor: Professor = usuario.professor

    obs_db = db.query(Observacao).filter(Observacao.professor_id == professor.id).all()
    observacoes_list = []

    for o in obs_db:
        observacoes_list.append({
            "id": o.id,
            "aluno_nome": o.aluno.usuario.nome if o.aluno and o.aluno.usuario else "—",
            "aluno_matricula": o.aluno.matricula if o.aluno else "—",
            "materia": o.materia.nome if o.materia else "Geral",
            "comentario": o.comentario,
            "data": o.data.isoformat() if hasattr(o, 'data') and o.data else None,
        })

    return {"observacoes": observacoes_list}


@router.post("/observacoes")
def criar_observacao(payload: ObservacaoCreate, usuario_id: int = Depends(get_usuario_id), db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario or not usuario.professor:
        raise HTTPException(status_code=403, detail="Acesso restrito a professores.")

    professor: Professor = usuario.professor

    
    materia = db.query(Materia).filter(
        Materia.id == payload.materia_id,
        Materia.professor_id == professor.id
    ).first()
    if not materia:
        raise HTTPException(status_code=403, detail="Matéria não pertence ao professor logado.")

    aluno = db.query(Aluno).filter(Aluno.id == payload.aluno_id).first()
    if not aluno:
        raise HTTPException(status_code=404, detail="Aluno não encontrado.")

    nova_obs = Observacao(
        aluno_id=payload.aluno_id,
        materia_id=payload.materia_id,
        professor_id=professor.id,
        comentario=payload.comentario
    )
    db.add(nova_obs)
    db.commit()
    return {"message": "Observação salva com sucesso"}


@router.get("/debug")
def debug_professor(usuario_id: int = Depends(get_usuario_id), db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        return {"erro": "Usuário não encontrado", "usuario_id": usuario_id}

    professor = usuario.professor
    if not professor:
        return {
            "erro": "Usuário não tem professor vinculado",
            "usuario_id": usuario_id,
            "email": usuario.email,
        }

    return {
        "usuario_id": usuario_id,
        "email": usuario.email,
        "professor_id": professor.id,
        "materias_count": len(professor.materias),
        "observacoes_count": len(professor.observacoes),
    }

