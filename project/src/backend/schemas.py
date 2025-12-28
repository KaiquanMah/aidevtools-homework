from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

# Auth Schemas
class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Content Schemas
class ExerciseBase(BaseModel):
    id: int
    question: str
    options: List[str] # Will need to parse JSON string from DB
    correct_answer: str
    explanation: Optional[str] = None
    
    class Config:
        from_attributes = True

class ExerciseAttempt(BaseModel):
    exercise_id: int
    selected_option: str

class LessonBase(BaseModel):
    id: int
    title: str
    order: int
    
    class Config:
        from_attributes = True

class LessonDetail(LessonBase):
    content: str
    exercises: List[ExerciseBase] = []
    
class LevelBase(BaseModel):
    id: int
    name: str
    description: str
    
    class Config:
        from_attributes = True

class LevelDetail(LevelBase):
    lessons: List[LessonBase] = []

# Progress Schemas
class ProgressUpdate(BaseModel):
    score: int
    completed: bool = True

class UserProgressSchema(BaseModel):
    lesson_id: int
    completed: bool
    score: int
    completed_at: datetime
    
    class Config:
        from_attributes = True

class UserProfile(BaseModel):
    id: int
    username: str
    created_at: datetime
    progress: List[UserProgressSchema] = []
    
    class Config:
        from_attributes = True
