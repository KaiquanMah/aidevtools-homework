import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RoomCreate.css';

function RoomCreate() {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substr(2, 9);
    navigate(`/room/${newRoomId}`);
  };

  const joinRoom = () => {
    if (roomId.trim()) {
      navigate(`/room/${roomId}`);
    }
  };

  return (
    <div className="room-create-container">
      <h1>Coding Interview</h1>
      <div className="actions">
        <button onClick={createRoom} className="create-btn">Create New Room</button>
        <div className="divider">OR</div>
        <div className="join-form">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={joinRoom} className="join-btn">Join Room</button>
        </div>
      </div>
    </div>
  );
}

export default RoomCreate;