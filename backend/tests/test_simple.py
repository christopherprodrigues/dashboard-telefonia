import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from main import app
from app.database import Base, get_db_session

SQLALCHEMY_DATABASE_URL = "sqlite+aiosqlite:///./test.db"
engine = create_async_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine, class_=AsyncSession
)


async def override_get_db():
    async with TestingSessionLocal() as session:
        yield session


app.dependency_overrides[get_db_session] = override_get_db


@pytest.fixture(scope="module", autouse=True)
async def setup_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.mark.asyncio
async def test_all_endpoints():
    async with AsyncClient(app=app, base_url="http://test") as client:
        # 1. Teste de criação
        response = await client.post(
            "/api/users/", json={"email": "test@example.com", "password": "password"}
        )
        assert response.status_code == 201

        # 2. Teste de login
        login_response = await client.post(
            "/api/token/", data={"username": "test@example.com", "password": "password"}
        )
        assert login_response.status_code == 200
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 3. Teste de rota protegida sem auth
        unauth_response = await client.post("/api/calls/ingest")
        assert unauth_response.status_code == 401

        # 4. Teste de métricas com auth
        await client.post("/api/calls/ingest", headers=headers)
        metrics_response = await client.get("/api/metrics/", headers=headers)
        assert metrics_response.status_code == 200
        assert metrics_response.json()["kpis"]["total_calls"] > 0

        # 5. Teste de usuário duplicado
        duplicate_response = await client.post(
            "/api/users/", json={"email": "test@example.com", "password": "password"}
        )
        assert duplicate_response.status_code == 400
