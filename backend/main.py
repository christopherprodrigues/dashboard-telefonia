from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, users, calls, metrics

app = FastAPI(
    title="Dashboard de Telefonia API",
    description="API para gerenciar usuários e visualizar métricas de chamadas.",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permissivo para desenvolvimento
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/token", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(calls.router, prefix="/api/calls", tags=["Calls"])
app.include_router(metrics.router, prefix="/api/metrics", tags=["Metrics"])
