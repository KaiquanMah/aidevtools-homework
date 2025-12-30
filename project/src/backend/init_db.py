import json
import os
import sys

# Ensure we can import from local modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import engine, SessionLocal, Base
from models import Level, Lesson, Exercise

def seed_data():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if data exists
    if db.query(Level).first():
        print("Data already seeded.")
        db.close()
        return

    print("Seeding data from content directories...")
    
    # Define paths
    # 1. /app/content (Docker - we will mount or copy here)
    # 2. src/database/content (Local dev)
    base_paths = [
        "/app/src/database/content", 
        "/data/content",
        os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "database", "content")
    ]
    
    content_dir = None
    for p in base_paths:
        if os.path.exists(p):
            content_dir = p
            print(f"Found content directory at: {p}")
            break
            
    if not content_dir:
        print("Content directory not found.")
        db.close()
        return

    # Map level names to order
    level_order_map = {"0": 0, "A1": 1, "A2": 2}

    # Iterate over level directories
    for level_name in sorted(os.listdir(content_dir)):
        level_path = os.path.join(content_dir, level_name)
        if not os.path.isdir(level_path):
            continue
            
        print(f"Processing Level: {level_name}")
        
        # Create Level
        level = Level(
            name=level_name, 
            description=f"Finnish Level {level_name}", 
            order=level_order_map.get(level_name, 99)
        )
        db.add(level)
        db.commit()
        db.refresh(level)
        
        # Iterate over lesson files
        # Files are like: 01_alphabet.json, 02_greetings.json
        lesson_files = sorted(os.listdir(level_path))
        
        for filename in lesson_files:
            if not filename.endswith(".json"):
                continue
                
            file_path = os.path.join(level_path, filename)
            with open(file_path, 'r', encoding='utf-8') as f:
                lesson_data = json.load(f)
                
            # Parse order from filename (e.g. "01_..." -> 1)
            try:
                order_prefix = filename.split('_')[0]
                lesson_order = int(order_prefix)
            except ValueError:
                lesson_order = 99
            
            print(f"  - Adding Lesson: {lesson_data['title']}")
            
            lesson = Lesson(
                level_id=level.id,
                title=lesson_data['title'],
                content=lesson_data['content'],
                order=lesson_order
            )
            db.add(lesson)
            db.commit()
            db.refresh(lesson)
            
            for ex_data in lesson_data.get('exercises', []):
                exercise = Exercise(
                    lesson_id=lesson.id,
                    question=ex_data['question'],
                    options=json.dumps(ex_data['options']),
                    correct_answer=ex_data['correct_answer'],
                    explanation=ex_data.get('explanation')  # Optional field
                )
                db.add(exercise)
        
        db.commit()
    
    print("Seeding complete.")
    db.close()

if __name__ == "__main__":
    seed_data()
