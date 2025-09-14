from fastapi import FastAPI

from .routers import auth, users

app = FastAPI(
    title = "Dashboard Telefonia API",
    description = "API para gerenciar usuários e visualizar métricas de chamadas",
    version = "1.0.0",
)

app.include_router(auth.router)
app.include_router(users.router)

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Bem-vindo à API do Dashboard de Telefonia!"}

# Futuramente adicionar rotas e lógica da aplicação aqui