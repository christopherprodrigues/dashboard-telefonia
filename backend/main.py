from fastapi import FastAPI, APIRouter
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

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(calls.router)
api_router.include_router(metrics.router)

app.include_router(api_router, prefix="/api")


@app.get("/")
def read_root():
    return {"message": "API está online. Acesse /docs para a documentação."}
