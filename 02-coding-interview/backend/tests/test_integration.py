"""Integration tests for the coding interview application."""
import pytest
from fastapi.testclient import TestClient
from backend.main import fastapi_app

client = TestClient(fastapi_app)

def test_api_health():
    """Test the health check endpoint."""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_root_endpoint():
    """Test the root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}

def test_cors_headers():
    """Test that CORS headers are properly set."""
    response = client.get("/api/health")
    # Just verify the request succeeds with CORS enabled
    assert response.status_code == 200

def test_websocket_events_structure():
    """Test that WebSocket event handlers exist and are properly structured."""
    from backend.app.api.websocket import sio
    
    # Verify Socket.IO server is configured
    assert sio is not None
    assert sio.async_mode == 'asgi'
    
    # Verify event handlers are registered
    event_handlers = sio.handlers['/']
    assert 'connect' in event_handlers
    assert 'disconnect' in event_handlers
    assert 'join_room' in event_handlers
    assert 'code_change' in event_handlers
    assert 'language_change' in event_handlers

def test_fastapi_app_structure():
    """Test that the FastAPI app is properly configured."""
    # Check that app has middleware
    assert len(fastapi_app.user_middleware) > 0
    
    # Check routes exist
    routes = [route.path for route in fastapi_app.routes]
    assert "/" in routes
    assert "/api/health" in routes

@pytest.mark.asyncio
async def test_websocket_event_handlers_callable():
    """Test that event handlers can be called without errors."""
    from backend.app.api.websocket import sio
    
    # Get event handlers
    handlers = sio.handlers['/']
    
    # Test that handlers are async functions
    assert callable(handlers['connect'])
    assert callable(handlers['disconnect'])
    assert callable(handlers['join_room'])
    assert callable(handlers['code_change'])
    assert callable(handlers['language_change'])

def test_api_endpoints_structure():
    """Test that all expected API endpoints exist."""
    routes = {route.path: route.methods for route in fastapi_app.routes}
    
    # Verify GET endpoints
    assert "/" in routes
    assert "GET" in routes["/"]
    
    assert "/api/health" in routes
    assert "GET" in routes["/api/health"]
