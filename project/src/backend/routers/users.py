from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, UserProgress, Lesson
from schemas import UserProfile, ProgressUpdate
from auth import get_current_user

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserProfile)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/progress/{lesson_id}")
def update_progress(
    lesson_id: int, 
    update: ProgressUpdate, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
        
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.lesson_id == lesson_id
    ).first()
    
    if progress:
        progress.completed = update.completed
        progress.score = update.score # keep highest score? simple overwrite for now
    else:
        progress = UserProgress(
            user_id=current_user.id,
            lesson_id=lesson_id,
            completed=update.completed,
            score=update.score
        )
        db.add(progress)
    
    db.commit()
    return {"status": "success"}
