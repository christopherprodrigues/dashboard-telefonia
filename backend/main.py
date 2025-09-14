import sys
import os
from app.main import app
from routers import auth, users

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI

app = FastAPI(
    title="Dashboard de Telefonia API",
    description="API para gerenciar usuários e visualizar métricas de chamadas.",
    version="1.0.0"
)

app.include_router(auth.router)
app.include_router(users.router)

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Bem-vindo à API do Dashboard de Telefonia!"}