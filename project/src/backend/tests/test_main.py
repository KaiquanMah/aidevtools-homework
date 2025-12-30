from fastapi.testclient import TestClient
from main import app
from database import get_db
import models
import pytest

# Database setup is now handled in conftest.py
client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_register_and_login():
    # Register
    response = client.post(
        "/auth/register",
        json={"username": "testuser_main", "password": "testpassword"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

    # Login
    response = client.post(
        "/auth/login",
        data={"username": "testuser_main", "password": "testpassword"},
    )
    assert response.status_code == 200
    token = response.json()["access_token"]
    assert token is not None
    return token

def test_get_levels():
    response = client.get("/levels")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
