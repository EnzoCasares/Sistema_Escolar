from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.schemas import (
    ValidarMatricula, ValidarMatriculaResponse,
    CriarCredenciais, CadastroResponse,
    LoginRequest, Token
)
from app.crud import cadastro as crud

router = APIRouter()


@router.post("/validar-matricula", response_model=ValidarMatriculaResponse)
def validar_matricula(body: ValidarMatricula, db: Session = Depends(get_db)):
    return crud.validar_matricula(db, body.matricula)


@router.post("/criar-credenciais", response_model=CadastroResponse)
def criar_credenciais(body: CriarCredenciais, db: Session = Depends(get_db)):
    usuario = crud.criar_credenciais(db, body)
    return {"sucesso": True, "mensagem": "Conta criada com sucesso!", "usuario": usuario}


@router.post("/login", response_model=Token)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    return crud.autenticar_usuario(db, body.email, body.senha)
