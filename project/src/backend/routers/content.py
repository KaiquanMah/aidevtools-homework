import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Level, Lesson
from schemas import LevelBase, LevelDetail, LessonDetail, ExerciseBase
from auth import get_current_user

router = APIRouter(tags=["content"])

@router.get("/levels", response_model=List[LevelBase])
def get_levels(db: Session = Depends(get_db)):
    return db.query(Level).order_by(Level.order).all()

@router.get("/levels/{level_id}", response_model=LevelDetail)
def get_level_details(level_id: int, db: Session = Depends(get_db)):
    level = db.query(Level).filter(Level.id == level_id).first()
    if not level:
        raise HTTPException(status_code=404, detail="Level not found")
    return level

@router.get("/lessons/{lesson_id}", response_model=LessonDetail)
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    # Convert manually if needed, but Pydantic Config from_attributes handles relations mostly.
    # We need to parse the JSON options string for exercises though? 
    # Actually Pydantic won't auto-parse JSON string to list. We need a helper.
    
    response_exercises = []
    for ex in lesson.exercises:
        opts = []
        try:
            opts = json.loads(ex.options)
        except:
            opts = []
        
        response_exercises.append(ExerciseBase(
            id=ex.id,
            question=ex.question,
            options=opts,
            correct_answer=ex.correct_answer,
            explanation=ex.explanation
        ))

    return LessonDetail(
        id=lesson.id,
        title=lesson.title,
        order=lesson.order,
        content=lesson.content,
        exercises=response_exercises
    )

from services.llm_service import generate_text

@router.post("/lessons/{lesson_id}/explain")
async def explain_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    prompt = f"Explain the Finnish lesson titled '{lesson.title}' which contains: {lesson.content}. Keep it short and encouraging."
    response = await generate_text(prompt)
    return {"explanation": response}
