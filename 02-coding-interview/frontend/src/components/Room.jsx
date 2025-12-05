import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import CodeEditor from './CodeEditor';
import UserList from './UserList';
import OutputPanel from './OutputPanel';
import { useCodeExecutor } from '../hooks/useCodeExecutor';
import './Room.css';

function Room() {
  const { roomId } = useParams();
  const [connected, setConnected] = useState(false);
  const [code, setCode] = useState('// Start coding here\nfunction hello() {\n  console.log("Hello World!");\n}\nhello();');
  const [language, setLanguage] = useState('javascript');
  const [users, setUsers] = useState([]);
  const socketRef = useRef(null);

  const { executeCode, output, isRunning, error, pyodideLoaded } = useCodeExecutor(language);

  useEffect(() => {
    // Connect to WebSocket
    // In production, we connect to the same origin (Nginx proxies /socket.io)
    // In dev, Vite proxies /socket.io to backend
    const socketUrl = import.meta.env.PROD ? '/' : 'http://localhost:8000';

    socketRef.current = io(socketUrl, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });

    socketRef.current.onAny((event, ...args) => {
      console.log(`[Socket Event] ${event}`, args);
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
      socketRef.current.emit('join_room', { roomId });
    });

    socketRef.current.on('user_list_update', (data) => {
      console.log('User list updated:', data.users);
      setUsers(data.users);
    });

    socketRef.current.on('code_update', (data) => {
      setCode(data.code);
    });

    socketRef.current.on('language_change', (data) => {
      setLanguage(data.language);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socketRef.current.emit('code_change', { roomId, code: newCode });
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    socketRef.current.emit('language_change', { roomId, language: newLanguage });

    // Update default code based on language
    if (newLanguage === 'python') {
      setCode('# Start coding here\nprint("Hello World!")');
    } else {
      setCode('// Start coding here\nconsole.log("Hello World!");');
    }
  };

  const handleRunCode = () => {
    executeCode(code);
  };

  const handleClearOutput = () => {
    // Output clearing is handled by the hook
  };

  const isReady = language === 'javascript' || pyodideLoaded;

  return (
    <div className="room-container">
      <div className="header">
        <div className="header-left">
          <h2>Room: {roomId}</h2>
          <span className={`status ${connected ? 'connected' : 'disconnected'}`}>
            {connected ? '● Connected' : '○ Connecting...'}
          </span>
        </div>
        <div className="header-right">
          <label htmlFor="language-select">Language: </label>
          <select
            id="language-select"
            value={language}
            onChange={handleLanguageChange}
            className="language-selector"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>
          <button
            onClick={handleRunCode}
            disabled={isRunning || !isReady}
            className="run-code-btn"
            title={!isReady ? 'Loading Python runtime...' : 'Run code (Ctrl+Enter)'}
          >
            {isRunning ? (
              <>
                <span className="spinner"></span>
                Running...
              </>
            ) : (
              <>
                ▶ Run
              </>
            )}
          </button>
        </div>
      </div>
      <div className="content">
        <div className="editor-panel">
          <CodeEditor code={code} onCodeChange={handleCodeChange} language={language} />
          <OutputPanel output={output} error={error} onClear={handleClearOutput} />
        </div>
        <div className="sidebar">
          <UserList users={users} />
        </div>
      </div>
    </div>
  );
}

export default Room;