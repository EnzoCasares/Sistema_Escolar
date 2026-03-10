from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date



class UsuarioBase(BaseModel):
    email: EmailStr
    nome: str

class UsuarioCreate(UsuarioBase):
    senha: str

class UsuarioOut(UsuarioBase):
    id: int
    model_config = {"from_attributes": True}



class AlunoOut(BaseModel):
    id: int
    matricula: str
    data_nascimento: Optional[date]
    sala_id: Optional[int]
    usuario_id: Optional[int]
    model_config = {"from_attributes": True}



class ValidarMatricula(BaseModel):
    matricula: str

class ValidarMatriculaResponse(BaseModel):
    valido: bool
    nome: Optional[str] = None
    matricula: Optional[str] = None
    mensagem: Optional[str] = None

class CriarCredenciais(BaseModel):
    matricula: str
    email: EmailStr
    senha: str
    confirmar_senha: str

class CadastroResponse(BaseModel):
    sucesso: bool
    mensagem: str
    usuario: Optional[UsuarioOut] = None



class LoginRequest(BaseModel):
    email: EmailStr
    senha: str

class Token(BaseModel):
    access_token: str
    token_type: str
    nome: str
    perfil: str  
