import React, { useState, useEffect} from "react";
import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from './components/Header.js';
import Queue from './pages/Queue.js';
import Home from './pages/Home.js';
import Settings from './pages/Settings.js';
import Friends from './pages/Friends.js';
import Profile from './pages/Profile.js';
console.log("Hello!");

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" index element={<Home />} />
      <Route path="/queue" index element={<Queue />} />
      <Route path="/settings" index element={<Settings />} />
      <Route path="/profile" index element={<Profile />} />
      <Route path="/friends" index element={<Friends />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
