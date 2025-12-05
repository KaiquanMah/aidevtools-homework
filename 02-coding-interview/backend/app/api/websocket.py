import socketio
import random

# Create a Socket.IO server
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')

# Store room state: room_id -> list of {sid, name}
rooms = {}
# Store user state: sid -> room_id
sid_to_room = {}

# Funky name components
ADJECTIVES = ['Funky', 'Happy', 'Cool', 'Sleepy', 'Hyper', 'Silly', 'Brave', 'Clever', 'Swift', 'Calm']
NOUNS = ['Monkey', 'Apple', 'Cucumber', 'Tiger', 'Panda', 'Eagle', 'Dolphin', 'Fox', 'Badger', 'Koala']

def generate_random_name():
    return f"{random.choice(ADJECTIVES)} {random.choice(NOUNS)}"

@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")
    room_id = sid_to_room.get(sid)
    if room_id:
        # Remove user from room
        if room_id in rooms:
            rooms[room_id] = [u for u in rooms[room_id] if u['sid'] != sid]
            # Broadcast updated user list to remaining users
            user_names = [u['name'] for u in rooms[room_id]]
            for user in rooms[room_id]:
                await sio.emit('user_list_update', {'users': user_names}, to=user['sid'])
        
        del sid_to_room[sid]

@sio.event
async def join_room(sid, data):
    room_id = data.get('roomId')
    if room_id:
        await sio.enter_room(sid, room_id)
        
        # Assign random name
        name = generate_random_name()
        
        # Store user info
        if room_id not in rooms:
            rooms[room_id] = []
        
        rooms[room_id].append({'sid': sid, 'name': name})
        sid_to_room[sid] = room_id
        
        print(f"Client {sid} ({name}) joined room {room_id}")
        
        # Broadcast updated user list to EVERYONE in the room
        # NOTE: room-based emit doesn't work with our Socket.IO setup,
        # so we emit to each user's SID individually
        user_names = [u['name'] for u in rooms[room_id]]
        for user in rooms[room_id]:
            await sio.emit('user_list_update', {'users': user_names}, to=user['sid'])

@sio.event
async def code_change(sid, data):
    room_id = data.get('roomId')
    code = data.get('code')
    if room_id and code is not None:
        # Broadcast the code change to others in the room
        # NOTE: room-based emit doesn't work with our Socket.IO setup,
        # so we emit to each user's SID individually
        if room_id in rooms:
            for user in rooms[room_id]:
                if user['sid'] != sid:  # Skip sender
                    await sio.emit('code_update', {'code': code}, to=user['sid'])

@sio.event
async def language_change(sid, data):
    room_id = data.get('roomId')
    language = data.get('language')
    if room_id and language:
        # Broadcast the language change to others in the room
        if room_id in rooms:
            for user in rooms[room_id]:
                if user['sid'] != sid:  # Skip sender
                    await sio.emit('language_change', {'language': language}, to=user['sid'])

