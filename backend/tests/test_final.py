# backend/test_final.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from main import app
from app.database import Base, get_db_session

# --- 1. Configuração do Banco de Dados de Teste ---
# Usamos um banco de dados SQLite em memória. Ele é criado e destruído para os testes.
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},  # Requisito do SQLite
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Cria as tabelas no banco de dados em memória
Base.metadata.create_all(bind=engine)


# --- 2. Sobrescreve a Dependência do Banco de Dados ---
# Diz ao FastAPI para usar nosso banco de teste em vez do PostgreSQL
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db_session] = override_get_db

# --- 3. Cria o Cliente de Teste ---
client = TestClient(app)

# --- 4. Nossos 5 Testes (agora síncronos e estáveis) ---


def test_create_user():
    """Teste 1: CRUD de Usuários - Criação"""
    response = client.post(
        "/api/users/", json={"email": "test@user.com", "password": "password"}
    )
    assert response.status_code == 201
    assert response.json()["email"] == "test@user.com"


def test_login():
    """Teste 2: Autenticação - Login e Token"""
    email, password = "login@user.com", "password"
    client.post("/api/users/", json={"email": email, "password": password})
    response = client.post(
        "/api/token/", data={"username": email, "password": password}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_ingest_unauthenticated():
    """Teste 3: Ingestão - Rota Protegida"""
    response = client.post("/api/calls/ingest")
    assert response.status_code == 401


def test_metrics_authenticated():
    """Teste 4: Métricas - Rota Protegida e Cálculo"""
    email, password = "metrics@user.com", "password"
    client.post("/api/users/", json={"email": email, "password": password})
    login_resp = client.post(
        "/api/token/", data={"username": email, "password": password}
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Ingestão usa dados mock, então a chamada deve funcionar
    ingest_response = client.post("/api/calls/ingest", headers=headers)
    assert ingest_response.status_code == 200

    # Verifica se as métricas são calculadas
    metrics_response = client.get("/api/metrics/", headers=headers)
    assert metrics_response.status_code == 200
    assert "kpis" in metrics_response.json()


def test_duplicate_user():
    """Teste 5: CRUD de Usuários - Lógica de Duplicidade"""
    email, password = "duplicate@user.com", "password"
    response1 = client.post("/api/users/", json={"email": email, "password": password})
    assert response1.status_code == 201
    response2 = client.post("/api/users/", json={"email": email, "password": password})
    assert response2.status_code == 400
