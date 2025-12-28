from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from database import engine, Base
from routers import auth, content, users, practice

# Create tables on startup (simplest for this homework, though migrations prefered in prod)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Finnish Language Learner API")

# CORS
origins = [
    "http://localhost:3000", # Next.js dev
    "http://localhost:8000", # Self
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins to prevent CORS/405 issues on local network/127.0.0.1
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(content.router)
app.include_router(users.router)
app.include_router(practice.router)

# Serve Static Files (Frontend)
# In production single-container mode, frontend built files will be in 'static/'
if os.path.exists("static"):
    app.mount("/", StaticFiles(directory="static", html=True), name="static")

@app.get("/health")
def health_check():
    return {"status": "ok"}
