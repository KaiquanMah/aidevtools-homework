from fastapi.testclient import TestClient
from main import app
from database import Base, engine, get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import pytest
import os

# Use an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_auth.db"

engine_test = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine_test)
    yield
    Base.metadata.drop_all(bind=engine_test)
    if os.path.exists("./test_auth.db"):
        os.remove("./test_auth.db")

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
