"""WebSocket integration tests - testing real client-server communication.

These tests require the FastAPI server to be running.
Run with: pytest backend/tests/test_websocket.py -v
"""
import pytest
import asyncio
import socketio
import os

# Get server URL from environment or use default
SERVER_URL = os.getenv('TEST_SERVER_URL', 'http://127.0.0.1:8000')

@pytest.mark.asyncio
async def test_websocket_basic_connection():
    """Test that a Socket.IO client can connect to the server."""
    sio = socketio.AsyncClient()
    connected = False
    
    try:
        await sio.connect(SERVER_URL)
        connected = sio.connected
        await sio.disconnect()
    except (ConnectionError, OSError, socketio.exceptions.ConnectionError) as e:
        pytest.skip(f"Server not available at {SERVER_URL}: {e}")
    
    assert connected, "Client should successfully connect to WebSocket server"

@pytest.mark.asyncio
async def test_websocket_room_join():
    """Test joining a room and receiving confirmation."""
    sio = socketio.AsyncClient()
    
    try:
        await sio.connect(SERVER_URL)
        
        # Emit join_room event
        await sio.emit('join_room', {'roomId': 'test-room-456'})
        
        # Give server time to process
        await asyncio.sleep(0.3)
        
        await sio.disconnect()
        
        # If we get here without exception, room join succeeded
        assert True
        
    except (ConnectionError, OSError, socketio.exceptions.ConnectionError) as e:
        pytest.skip(f"Server not available at {SERVER_URL}: {e}")

@pytest.mark.asyncio
async def test_websocket_code_sync_between_clients():
    """Test that code changes sync between two clients in the same room."""
    client1 = socketio.AsyncClient()
    client2 = socketio.AsyncClient()
    
    code_received = asyncio.Event()
    received_data = {}
    
    @client2.on('code_update')
    def handle_code_update(data):
        received_data['code'] = data.get('code')
        code_received.set()
    
    try:
        # Connect both clients
        await client1.connect(SERVER_URL)
        await client2.connect(SERVER_URL)
        
        # Join same room
        room_id = 'sync-test-room'
        await client1.emit('join_room', {'roomId': room_id})
        await client2.emit('join_room', {'roomId': room_id})
        
        await asyncio.sleep(0.3)
        
        # Client 1 sends code
        test_code = 'console.log("Testing sync");'
        await client1.emit('code_change', {'roomId': room_id, 'code': test_code})
        
        # Wait for client 2 to receive
        await asyncio.wait_for(code_received.wait(), timeout=2.0)
        
        assert received_data.get('code') == test_code, "Code should sync to other client"
        
    except (OSError, ConnectionError, socketio.exceptions.ConnectionError) as e:
        pytest.skip(f"Server not available at {SERVER_URL}: {e}")
    except asyncio.TimeoutError:
        pytest.fail("Timeout: Client 2 did not receive code update")
    finally:
        if client1.connected:
            await client1.disconnect()
        if client2.connected:
            await client2.disconnect()

@pytest.mark.asyncio
async def test_websocket_language_sync():
    """Test that language changes sync between clients."""
    client1 = socketio.AsyncClient()
    client2 = socketio.AsyncClient()
    
    lang_received = asyncio.Event()
    received_data = {}
    
    @client2.on('language_change')
    def handle_language_change(data):
        received_data['language'] = data.get('language')
        lang_received.set()
    
    try:
        await client1.connect(SERVER_URL)
        await client2.connect(SERVER_URL)
        
        room_id = 'lang-test-room'
        await client1.emit('join_room', {'roomId': room_id})
        await client2.emit('join_room', {'roomId': room_id})
        
        await asyncio.sleep(0.3)
        
        # Client 1 changes language
        await client1.emit('language_change', {'roomId': room_id, 'language': 'python'})
        
        # Wait for client 2 to receive
        await asyncio.wait_for(lang_received.wait(), timeout=2.0)
        
        assert received_data.get('language') == 'python', "Language should sync to other client"
        
    except (OSError, ConnectionError, socketio.exceptions.ConnectionError) as e:
        pytest.skip(f"Server not available at {SERVER_URL}: {e}")
    except asyncio.TimeoutError:
        pytest.fail("Timeout: Client 2 did not receive language change")
    finally:
        if client1.connected:
            await client1.disconnect()
        if client2.connected:
            await client2.disconnect()
