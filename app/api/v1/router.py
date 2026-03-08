from fastapi import APIRouter
from app.api.v1.endpoints import cadastro

api_router = APIRouter()
api_router.include_router(cadastro.router, prefix="/cadastro", tags=["Cadastro"])
