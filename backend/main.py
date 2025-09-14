from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, users, calls, metrics

app = FastAPI(
    title="Dashboard de Telefonia API",
    description="API para gerenciar usuários e visualizar métricas de chamadas.",
    version="1.0.0",
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(calls.router)
app.include_router(metrics.router)


@app.get("/", tags=["Root"], summary="Endpoint raiz da API")
async def read_root():
    """Retorna uma mensagem de boas-vindas."""
    return {"message": "Bem-vindo à API do Dashboard de Telefonia!"}
