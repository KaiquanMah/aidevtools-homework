import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import CodeEditor from './CodeEditor';
import UserList from './UserList';
import './Room.css';

function Room() {
  const { roomId } = useParams();
  const [connected, setConnected] = useState(false);
  const [code, setCode] = useState('// Start coding here\n');
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to WebSocket
    socketRef.current = io('http://localhost:8000');

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
      socketRef.current.emit('join_room', { roomId });
    });

    socketRef.current.on('user_joined', (data) => {
      console.log('User joined:', data);
    });

    socketRef.current.on('code_update', (data) => {
      setCode(data.code);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socketRef.current.emit('code_change', { roomId, code: newCode });
  };

  return (
    <div className="room-container">
      <div className="header">
        <h2>Room: {roomId}</h2>
        <span className={`status ${connected ? 'connected' : 'disconnected'}`}>
          {connected ? 'Connected' : 'Connecting...'}
        </span>
      </div>
      <div className="content">
        <div className="editor-panel">
          <CodeEditor code={code} onCodeChange={handleCodeChange} />
        </div>
        <div className="sidebar">
          <UserList />
        </div>
      </div>
    </div>
  );
}

export default Room;