from fastapi.testclient import TestClient
from main import app
from database import get_db
import models
from models import User, Level, Lesson
import pytest

# Database setup is now handled in conftest.py
client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_database(db_session):
    db = db_session
    if not db.query(Level).filter(Level.id == 1).first():
        # Seed a level and lesson for progress testing
        level = Level(id=1, name="Level 1", description="Intro", order=1)
        lesson = Lesson(id=1, level_id=1, title="Lesson 1", content="Content", order=1)
        db.add(level)
        db.add(lesson)
        db.commit()

def get_auth_token(username="user1", password="password1"):
    # Register and then return token
    client.post("/auth/register", json={"username": username, "password": password})
    response = client.post("/auth/login", data={"username": username, "password": password})
    return response.json()["access_token"]

def test_get_profile_success():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/users/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "user1"
    assert "progress" in data
    assert isinstance(data["progress"], list)

def test_get_profile_unauthorized():
    response = client.get("/users/me")
    assert response.status_code == 401 

def test_update_progress_success():
    token = get_auth_token("user2", "pass2")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Update progress for lesson 1
    response = client.post(
        "/users/progress/1",
        json={"score": 85, "completed": True},
        headers=headers
    )
    assert response.status_code == 200
    assert response.json() == {"status": "success"}
    
    # Verify in profile
    profile_response = client.get("/users/me", headers=headers)
    assert profile_response.status_code == 200
    profile_data = profile_response.json()
    assert len(profile_data["progress"]) == 1
    assert profile_data["progress"][0]["lesson_id"] == 1
    assert profile_data["progress"][0]["score"] == 85

def test_update_progress_lesson_not_found():
    token = get_auth_token("user3", "pass3")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Update progress for non-existent lesson 999
    response = client.post(
        "/users/progress/999",
        json={"score": 100, "completed": True},
        headers=headers
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Lesson not found"
