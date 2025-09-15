from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import asyncio

from main import app
from app.database import Base, get_db_session

# --- Configuração do Banco de Dados de Teste (SQLite em memória) ---
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}, # Requisito do SQLite
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Cria as tabelas no banco de dados
Base.metadata.create_all(bind=engine)

# --- Sobrescreve a dependência do banco de dados para os testes ---
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db_session] = override_get_db

# --- Cria o Cliente de Teste ---
client = TestClient(app)

# --- 5 Testes Síncronos ---

def test_create_user_and_login():
    """Teste 1 & 2: Cria um usuário e faz login."""
    email, password = "test.user@example.com", "password123"
    
    # Criação
    response = client.post("/api/users/", json={"email": email, "password": password})
    assert response.status_code == 201, response.text
    
    # Login
    login_response = client.post("/api/token/", data={"username": email, "password": password})
    assert login_response.status_code == 200, login_response.text
    assert "access_token" in login_response.json()

def test_ingest_unauthenticated():
    """Teste 3: Tenta acessar uma rota protegida sem token."""
    response = client.post("/api/calls/ingest")
    assert response.status_code == 401, response.text

def test_metrics_authenticated():
    """Teste 4: Acessa a rota de métricas com um token válido."""
    email, password = "metrics.user@example.com", "password"
    client.post("/api/users/", json={"email": email, "password": password})
    login_resp = client.post("/api/token/", data={"username": email, "password": password})
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    ingest_response = client.post("/api/calls/ingest", headers=headers)
    assert ingest_response.status_code == 200, ingest_response.text

    metrics_response = client.get("/api/metrics/", headers=headers)
    assert metrics_response.status_code == 200, metrics_response.text
    assert "kpis" in metrics_response.json()

def test_create_duplicate_user():
    """Teste 5: Tenta criar um usuário que já existe."""
    email, password = "duplicate.user@example.com", "password"
    
    response1 = client.post("/api/users/", json={"email": email, "password": password})
    assert response1.status_code == 201, response1.text
    
    response2 = client.post("/api/users/", json={"email": email, "password": password})
    assert response2.status_code == 400, response2.text