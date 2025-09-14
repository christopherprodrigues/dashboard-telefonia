from fastapi import FastAPI
from routers import auth, users, calls

app = FastAPI(
    title="Dashboard de Telefonia API",
    description="API para gerenciar usuários e visualizar métricas de chamadas.",
    version="1.0.0",
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(calls.router)


@app.get("/", tags=["Root"], summary="Endpoint raiz da API")
async def read_root():
    """Retorna uma mensagem de boas-vindas."""
    return {"message": "Bem-vindo à API do Dashboard de Telefonia!"}
