import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoomCreate from './components/RoomCreate';
import Room from './components/Room';
import './App.css';

function App() {
  return (
    <Router>
      <div className=