from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from database import engine, Base
from routers import auth, content, users, practice

# Create tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Finnish Language Learner API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
if os.path.exists("static"):
    @app.middleware("http")
    async def add_process_time_header(request, call_next):
        response = await call_next(request)
        if response.status_code == 404:
            path = request.url.path.strip("/")
            html_path = f"static/{path}.html"
            if os.path.exists(html_path):
                from fastapi.responses import FileResponse
                return FileResponse(html_path)
            index_path = f"static/{path}/index.html"
            if os.path.exists(index_path):
                from fastapi.responses import FileResponse
                return FileResponse(index_path)
        return response

    app.mount("/", StaticFiles(directory="static", html=True), name="static")

@app.get("/health")
def health_check():
    return {"status": "ok"}
