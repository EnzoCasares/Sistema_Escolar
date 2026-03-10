from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import os

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage

from app.db.session import get_db
from app.config import settings
from app.models.models import Usuario, Aluno, Nota, Observacao
from app.api.v1.endpoints.aluno import get_usuario_id

router = APIRouter()

class ChatRequest(BaseModel):
    mensagem: str

class ChatResponse(BaseModel):
    resposta: str


if settings.GOOGLE_API_KEY:
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=settings.GOOGLE_API_KEY,
        temperature=0.7
    )
else:
    llm = None

@router.post("/chat", response_model=ChatResponse)
async def chat_ia(
    request: ChatRequest,
    usuario_id: int = Depends(get_usuario_id),
    db: Session = Depends(get_db)
):
    if not llm:
        raise HTTPException(status_code=500, detail="Certifique-se de que GOOGLE_API_KEY está configurada.")

    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario or not usuario.aluno:
        raise HTTPException(status_code=403, detail="Acesso exclusivo para alunos.")

    aluno = usuario.aluno
    notas_db = db.query(Nota).filter(Nota.aluno_id == aluno.id).all()
    obs_db = db.query(Observacao).filter(Observacao.aluno_id == aluno.id).all()

    contexto_notas = [f"{n.materia.nome}: {n.media}" for n in notas_db if n.materia]
    contexto_obs = [o.comentario for o in obs_db]

    prompt_sistema = f"""Você é o Tutor IA do Instituto RME. Ajude o aluno {usuario.nome}.
    Contexto: Notas: {', '.join(contexto_notas)}. Observações: {'. '.join(contexto_obs)}.
    Seja breve, motivador e responda em português."""

    messages = [
        SystemMessage(content=prompt_sistema),
        HumanMessage(content=request.mensagem)
    ]

    try:
        response = llm.invoke(messages)
        return ChatResponse(resposta=response.content)
    except Exception as e:
        print(f"Erro Gemini/LangChain: {e}")
        raise HTTPException(status_code=500, detail=f"Erro na IA: {str(e)}")
