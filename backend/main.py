from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, users, calls, metrics

app = FastAPI(title="Dashboard de Telefonia API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(calls.router)
app.include_router(metrics.router)