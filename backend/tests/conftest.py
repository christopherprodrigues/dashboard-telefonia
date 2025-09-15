import pytest
import pytest_asyncio
import asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
from fastapi.testclient import TestClient

from main import app
from app.database import Base, get_db_session

load_dotenv()

TEST_DATABASE_URL = (
    f"postgresql+asyncpg://{os.getenv('TEST_DB_USER')}:{os.getenv('TEST_DB_PASSWORD')}@"
    f"{os.getenv('TEST_DB_HOST')}/{os.getenv('TEST_DB_NAME')}"
)

test_engine = create_async_engine(TEST_DATABASE_URL)
TestSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=test_engine, class_=AsyncSession
)


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_database():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await test_engine.dispose()


@pytest_asyncio.fixture
async def db_session() -> AsyncSession:
    async with TestSessionLocal() as session:
        yield session


@pytest.fixture
def client(db_session: AsyncSession):
    def override_get_db():
        try:
            yield db_session
        finally:
            # O TestClient cuidará do fechamento da sessão
            pass

    app.dependency_overrides[get_db_session] = override_get_db
    with TestClient(app) as c:
        yield c
    del app.dependency_overrides[get_db_session]
