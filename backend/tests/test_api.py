import pytest
from fastapi.testclient import TestClient

# Nota: Não importamos mais o app aqui, pois a fixture já o utiliza.

# Pytest Fixture: Cria um cliente limpo para CADA teste
# Esta fixture está definida em conftest.py, o pytest a encontrará automaticamente.

# --- Início dos Testes ---


def test_get_on_users_route_not_allowed(client: TestClient):
    """Testa se um método GET na rota /api/users/ retorna 405."""
    response = client.get("/api/users/")
    assert response.status_code == 405


def test_create_user_successfully(client: TestClient):
    """Testa a criação de um novo usuário com sucesso."""
    response = client.post(
        "/api/users/",
        json={"email": "create.user@example.com", "password": "password123"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "create.user@example.com"
    assert "id" in data


def test_create_duplicate_user(client: TestClient):
    """Testa se a criação de um usuário duplicado retorna erro 400."""
    email = "duplicate.user@example.com"
    password = "password"
    # Cria o usuário na primeira vez
    response1 = client.post("/api/users/", json={"email": email, "password": password})
    assert response1.status_code == 201

    # Tenta criar o mesmo usuário de novo
    response2 = client.post("/api/users/", json={"email": email, "password": password})
    assert response2.status_code == 400


def test_login_for_access_token(client: TestClient):
    """Testa o login com um usuário existente e o recebimento de um token."""
    email = "login.user@example.com"
    password = "password"
    # Garante que o usuário exista antes de tentar o login
    client.post("/api/users/", json={"email": email, "password": password})

    response = client.post(
        "/api/token/", data={"username": email, "password": password}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_protected_route_authenticated(client: TestClient):
    """Testa se um endpoint protegido funciona com um token válido."""
    email = "metrics.user@example.com"
    password = "password"
    # Cria e loga um usuário para obter um token válido
    client.post("/api/users/", json={"email": email, "password": password})
    login_response = client.post(
        "/api/token/", data={"username": email, "password": password}
    )
    token = login_response.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/metrics/", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "kpis" in data
