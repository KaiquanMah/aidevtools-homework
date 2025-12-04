import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoomCreate from './components/RoomCreate';
import Room from './components/Room';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<RoomCreate />} />
          <Route path="/room/:roomId" element={<Room />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;