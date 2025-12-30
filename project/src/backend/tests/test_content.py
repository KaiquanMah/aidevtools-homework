import json
from fastapi.testclient import TestClient
from main import app
from database import Base, get_db
import models
from models import Level, Lesson, Exercise
import pytest

# Database setup is now handled in conftest.py
client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_database(db_session):
    # Seed data using the session provided by conftest
    db = db_session
    
    # Check if already seeded (module scope fixture might run multiple times if not careful, 
    # but here scope='module' for this file is fine)
    if db.query(Level).filter(Level.id == 1).first():
        return

    level1 = Level(id=1, name="Level 1", description="Intro", order=1)
    db.add(level1)
    db.commit()
    
    lesson1 = Lesson(id=1, level_id=1, title="Lesson 1", content="Content 1", order=1)
    db.add(lesson1)
    db.commit()
    
    # Exercise with explanation
    ex1 = Exercise(
        id=1, 
        lesson_id=1, 
        question="Q1", 
        options=json.dumps(["A", "B"]), 
        correct_answer="A", 
        explanation="Explain 1"
    )
    # Exercise without explanation
    ex2 = Exercise(
        id=2, 
        lesson_id=1, 
        question="Q2", 
        options=json.dumps(["C", "D"]), 
        correct_answer="C", 
        explanation=None
    )
    db.add(ex1)
    db.add(ex2)
    db.commit()

def test_get_levels():
    response = client.get("/levels")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Level 1"

def test_get_level_details_success():
    response = client.get("/levels/1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert len(data["lessons"]) == 1

def test_get_level_details_not_found():
    response = client.get("/levels/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Level not found"

def test_get_lesson_exercises_parsing():
    response = client.get("/lessons/1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert len(data["exercises"]) == 2
    
    # Check Q1 (with explanation)
    ex1 = next(ex for ex in data["exercises"] if ex["id"] == 1)
    assert ex1["question"] == "Q1"
    assert ex1["explanation"] == "Explain 1"
    assert ex1["options"] == ["A", "B"]
    
    # Check Q2 (without explanation)
    ex2 = next(ex for ex in data["exercises"] if ex["id"] == 2)
    assert ex2["question"] == "Q2"
    assert ex2["explanation"] is None
    assert ex2["options"] == ["C", "D"]

def test_get_lesson_not_found():
    response = client.get("/lessons/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Lesson not found"
