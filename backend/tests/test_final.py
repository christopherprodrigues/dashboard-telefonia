from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from main import app
from app.database import Base, get_db_session

# Banco de dados de teste em memória
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Cria as tabelas
Base.metadata.create_all(bind=engine)

# Sobrescreve a dependência
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db_session] = override_get_db

client = TestClient(app)

# --- 5 Testes ---
def test_create_user():
    """Teste 1: CRUD de Usuários - Criação"""
    response = client.post("/api/users/", json={"email": "test@user.com", "password": "password"})
    assert response.status_code == 201

def test_login():
    """Teste 2: Autenticação"""
    email, password = "login@user.com", "password"
    client.post("/api/users/", json={"email": email, "password": password})
    response = client.post("/api/token/", data={"username": email, "password": password})
    assert response.status_code == 200

def test_ingest_unauthenticated():
    """Teste 3: Ingestão - Rota Protegida"""
    response = client.post("/api/calls/ingest")
    assert response.status_code == 401

def test_metrics_authenticated():
    """Teste 4: Métricas - Rota Protegida"""
    email, password = "metrics@user.com", "password"
    client.post("/api/users/", json={"email": email, "password": password})
    login_resp = client.post("/api/token/", data={"username": email, "password": password})
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    client.post("/api/calls/ingest", headers=headers)
    metrics_response = client.get("/api/metrics/", headers=headers)
    assert metrics_response.status_code == 200
    assert "kpis" in metrics_response.json()

def test_duplicate_user():
    """Teste 5: CRUD - Lógica de Duplicidade"""
    email, password = "duplicate@user.com", "password"
    client.post("/api/users/", json={"email": email, "password": password})
    response = client.post("/api/users/", json={"email": email, "password": password})
    assert response.status_code == 400