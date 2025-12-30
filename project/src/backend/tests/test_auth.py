from fastapi.testclient import TestClient
from main import app
from database import Base, engine, get_db
# Import models immediately after Base to register tables
import models
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import pytest
import os

# Database setup is now handled in conftest.py
from database import get_db
client = TestClient(app)

def test_register_success():
    response = client.post(
        "/auth/register",
        json={"username": "newuser", "password": "testpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_register_duplicate_username():
    # Attempt to register with same username as test_register_success
    response = client.post(
        "/auth/register",
        json={"username": "newuser", "password": "newpassword"},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Username already registered"

def test_login_success():
    # We already have "newuser" from the first test (since fixture is module scope)
    response = client.post(
        "/auth/login",
        data={"username": "newuser", "password": "testpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_password():
    response = client.post(
        "/auth/login",
        data={"username": "newuser", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect username or password"

def test_login_non_existent_user():
    response = client.post(
        "/auth/login",
        data={"username": "nonexistent", "password": "somepassword"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect username or password"
