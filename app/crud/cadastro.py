from sqlalchemy.orm import Session
from app.models.models import Aluno, Usuario, Administrador, Professor
from app.schemas.schemas import CriarCredenciais
from app.core.security import hash_senha, verificar_senha, criar_token
from fastapi import HTTPException


def buscar_aluno_por_matricula(db: Session, matricula: str) -> Aluno | None:
    return db.query(Aluno).filter(Aluno.matricula == matricula).first()


def validar_matricula(db: Session, matricula: str):
    aluno = buscar_aluno_por_matricula(db, matricula)
    if not aluno:
        return {"valido": False, "mensagem": "Matrícula não encontrada."}
    if aluno.usuario_id is not None:
        return {"valido": False, "mensagem": "Esta matrícula já possui cadastro. Faça login."}
    
    nome = aluno.usuario.nome if aluno.usuario else "Aluno"
    return {"valido": True, "nome": nome, "matricula": matricula}


def criar_credenciais(db: Session, dados: CriarCredenciais):
    if dados.senha != dados.confirmar_senha:
        raise HTTPException(status_code=400, detail="As senhas não coincidem.")

    aluno = buscar_aluno_por_matricula(db, dados.matricula)
    if not aluno:
        raise HTTPException(status_code=404, detail="Matrícula não encontrada.")
    if aluno.usuario_id is not None:
        raise HTTPException(status_code=400, detail="Esta matrícula já possui cadastro.")

    email_existente = db.query(Usuario).filter(Usuario.email == dados.email).first()
    if email_existente:
        raise HTTPException(status_code=400, detail="Este e-mail já está em uso.")

    
    usuario = Usuario(
        email=dados.email,
        senha=hash_senha(dados.senha),
        nome=f"Aluno {dados.matricula}",  
    )
    db.add(usuario)
    db.flush()

    aluno.usuario_id = usuario.id
    db.commit()
    db.refresh(usuario)
    return usuario


def autenticar_usuario(db: Session, email: str, senha: str):
    usuario = db.query(Usuario).filter(Usuario.email == email).first()
    if not usuario or not verificar_senha(senha, usuario.senha):
        raise HTTPException(status_code=401, detail="Email ou senha inválidos.")

    
    perfil = "aluno"
    if usuario.administrador:
        perfil = "administrador"
    elif usuario.professor:
        perfil = "professor"

    token = criar_token({"sub": str(usuario.id), "perfil": perfil})
    return {"access_token": token, "token_type": "bearer", "nome": usuario.nome, "perfil": perfil}
