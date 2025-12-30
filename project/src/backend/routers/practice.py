"""
Practice API router for speech practice functionality.
Uses browser's Web Speech API for transcription, then grades text with Gemma.
"""
import os
import json
from pathlib import Path
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from services.speech_service import grade_pronunciation_text

router = APIRouter(prefix="/practice", tags=["practice"])

# Path to vocabulary files
default_vocab_dir = Path(__file__).parent.parent.parent / "database" / "vocabulary"
VOCABULARY_DIR = Path(os.getenv("VOCABULARY_DIR", str(default_vocab_dir)))


class GradeTextRequest(BaseModel):
    """Request body for text grading."""
    spoken_text: str
    target_text: str


def get_level_folder(level_id: int) -> str:
    """Map level ID to folder name."""
    level_map = {1: "0", 2: "A1", 3: "A2"}
    if level_id not in level_map:
        raise HTTPException(status_code=404, detail="Level vocabulary not found")
    return level_map.get(level_id)


@router.get("/vocabulary/{level_id}/{lesson_order}")
async def get_vocabulary(level_id: int, lesson_order: int):
    """
    Get vocabulary words for a specific lesson.
    
    Args:
        level_id: The level ID (1=Level 0, 2=A1, 3=A2)
        lesson_order: The lesson order within the level (1, 2, 3...)
    """
    level_folder = get_level_folder(level_id)
    vocab_dir = VOCABULARY_DIR / level_folder
    
    if not vocab_dir.exists():
        raise HTTPException(status_code=404, detail=f"Level vocabulary not found")
    
    # Find vocabulary file by lesson order
    vocab_files = sorted(vocab_dir.glob("*.json"))
    
    if lesson_order < 1 or lesson_order > len(vocab_files):
        raise HTTPException(status_code=404, detail=f"Lesson vocabulary not found")
    
    vocab_file = vocab_files[lesson_order - 1]
    
    try:
        with open(vocab_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading vocabulary: {str(e)}")


@router.post("/grade-text")
async def grade_text(request: GradeTextRequest):
    """
    Grade user's pronunciation based on transcribed text.
    The transcription is done by browser's Web Speech API.
    
    Args:
        spoken_text: What the browser heard (from Web Speech API)
        target_text: The Finnish word/phrase the user was trying to say
    
    Returns:
        Score (0-100), issues, and encouraging feedback
    """
    result = await grade_pronunciation_text(
        spoken_text=request.spoken_text,
        target_text=request.target_text
    )
    
    return result
