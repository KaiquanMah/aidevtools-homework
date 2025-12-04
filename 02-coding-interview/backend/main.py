from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio
from backend.app.api.websocket import sio

fastapi_app = FastAPI()

# CORS middleware
fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Wrap FastAPI app with Socket.IO
app = socketio.ASGIApp(sio, fastapi_app)

@fastapi_app.get("/")
async def root():
    return {"message": "Hello World"}

@fastapi_app.get("/api/health")
async def health_check():
    return {"status": "healthy"}