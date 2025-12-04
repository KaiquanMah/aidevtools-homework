import socketio

# Create a Socket.IO server
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')

@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")

@sio.event
async def join_room(sid, data):
    room_id = data.get('roomId')
    if room_id:
        sio.enter_room(sid, room_id)
        print(f"Client {sid} joined room {room_id}")
        await sio.emit('user_joined', {'sid': sid}, room=room_id, skip_sid=sid)

@sio.event
async def code_change(sid, data):
    room_id = data.get('roomId')
    code = data.get('code')
    if room_id and code is not None:
        # Broadcast the code change to others in the room
        await sio.emit('code_update', {'code': code}, room=room_id, skip_sid=sid)

@sio.event
async def language_change(sid, data):
    room_id = data.get('roomId')
    language = data.get('language')
    if room_id and language:
        # Broadcast the language change to others in the room
        await sio.emit('language_change', {'language': language}, room=room_id, skip_sid=sid)

