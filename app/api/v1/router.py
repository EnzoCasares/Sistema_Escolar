from fastapi import APIRouter
from app.api.v1.endpoints import cadastro, aluno

api_router = APIRouter()
api_router.include_router(cadastro.router, prefix="/cadastro", tags=["Cadastro"])
api_router.include_router(aluno.router, prefix="/aluno", tags=["Aluno"])
