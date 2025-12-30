import json
import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from main import app
from pathlib import Path

client = TestClient(app)

# Mock vocabulary directory for testing if needed, 
# but we just fixed Dockerfile to include it, so we'll use actual files or mock the glob.

@pytest.fixture
def mock_vocab_dir(tmp_path):
    # Create a temporary vocabulary structure
    v_dir = tmp_path / "src" / "database" / "vocabulary" / "0"
    v_dir.mkdir(parents=True)
    vocab_file = v_dir / "01_test.json"
    vocab_file.write_text(json.dumps({"words": ["kissa", "koira"]}), encoding="utf-8")
    return tmp_path

def test_get_vocabulary_success():
    # Since we can't easily change VOCABULARY_DIR at runtime without refactoring,
    # we'll assume the files copied by Dockerfile exist.
    # Level 1 -> folder '0'
    response = client.get("/practice/vocabulary/1/1")
    assert response.status_code == 200
    data = response.json()
    assert "vocabulary" in data
    assert isinstance(data["vocabulary"], list)

def test_get_vocabulary_not_found():
    # Invalid level
    response = client.get("/practice/vocabulary/999/1")
    assert response.status_code == 404

def test_grade_text_llm_success():
    # Mock the Gemini client
    with patch("services.speech_service.get_client") as mock_get_client:
        mock_client = MagicMock()
        mock_get_client.return_value = mock_client
        
        # Mock the LLM response
        mock_response = MagicMock()
        mock_response.text = json.dumps({
            "score": 95,
            "issues": [],
            "feedback": "Great job!",
            "correct": True
        })
        mock_client.models.generate_content.return_value = mock_response
        
        response = client.post(
            "/practice/grade-text",
            json={"spoken_text": "moi", "target_text": "moi"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["score"] == 95
        assert data["correct"] is True
        assert data["transcription"] == "moi"

def test_grade_text_llm_fallback():
    # Mock LLM to raise an exception to trigger fallback
    with patch("services.speech_service.get_client") as mock_get_client:
        mock_get_client.side_effect = Exception("API error")
        
        # This should trigger simple_text_comparison
        response = client.post(
            "/practice/grade-text",
            json={"spoken_text": "kiitos", "target_text": "kiitos"}
        )
        
        assert response.status_code == 200
        data = response.json()
        # Fallback for exact match returns score 100
        assert data["score"] == 100
        assert data["correct"] is True
        assert "kiitos" in data["transcription"]

def test_grade_text_empty_input():
    response = client.post(
        "/practice/grade-text",
        json={"spoken_text": "", "target_text": "moi"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["score"] == 0
    assert data["correct"] is False
    assert "no speech detected" in data["transcription"].lower()
