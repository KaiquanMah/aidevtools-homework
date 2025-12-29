from fastapi.testclient import TestClient
from main import app
from database import Base, engine, get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import pytest
import os

# Use an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

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
    # Create tables
    Base.metadata.create_all(bind=engine_test)
    yield
    # Drop tables
    Base.metadata.drop_all(bind=engine_test)
    if os.path.exists("./test.db"):
        os.remove("./test.db")

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_register_and_login():
    # Register
    response = client.post(
        "/auth/register",
        json={"username": "testuser", "password": "testpassword"},
    )
    assert response.status_code == 200
    # comment out because
    # The backend test was looking for a username field in the registration response, 
    # but your API (correctly) returns an access_token instead
    #     assert response.json()["username"] == "testuser"
    assert "access_token" in response.json()

    # Login
    response = client.post(
        "/auth/login",
        data={"username": "testuser", "password": "testpassword"},
    )
    assert response.status_code == 200
    token = response.json()["access_token"]
    assert token is not None
    return token

def test_get_levels():
    # Needs seeded data or we mock it. 
    # Since we use a fresh test.db, it's empty. 
    # We should verify it returns empty list or seed it.
    response = client.get("/levels")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
