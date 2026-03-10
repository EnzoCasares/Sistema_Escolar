from fastapi import APIRouter
from app.api.v1.endpoints import cadastro, aluno, professor, ia

api_router = APIRouter()
api_router.include_router(cadastro.router, prefix="/cadastro", tags=["Cadastro"])
api_router.include_router(aluno.router, prefix="/aluno", tags=["Aluno"])
api_router.include_router(professor.router, prefix="/professor", tags=["Professor"])
api_router.include_router(ia.router, prefix="/ia", tags=["IA"])
