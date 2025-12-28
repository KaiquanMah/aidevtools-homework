from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    progress = relationship("UserProgress", back_populates="user")

class Level(Base):
    __tablename__ = "levels"

    id = Column(Integer, primary_key=True, index=True) # e.g., 0, 1 (A1), 2 (A2)
    name = Column(String, unique=True) # '0', 'A1', 'A2'
    description = Column(String)
    order = Column(Integer)

    lessons = relationship("Lesson", back_populates="level")

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    level_id = Column(Integer, ForeignKey("levels.id"))
    title = Column(String)
    content = Column(Text) # Markdown content
    order = Column(Integer)

    level = relationship("Level", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson")
    user_progress = relationship("UserProgress", back_populates="lesson")

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    question = Column(String)
    options = Column(Text) # JSON string of options lists
    correct_answer = Column(String)
    explanation = Column(Text, nullable=True)  # Optional explanation

    lesson = relationship("Lesson", back_populates="exercises")

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    completed = Column(Boolean, default=False)
    score = Column(Integer, default=0)
    completed_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="progress")
    lesson = relationship("Lesson", back_populates="user_progress")
