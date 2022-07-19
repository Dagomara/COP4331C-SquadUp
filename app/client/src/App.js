import React, { useState, useEffect} from "react";
import './App.css';
import './assets/bootstrap/css/bootstrap.min.css';
//import 'https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i&amp;display=swap';
//import 'https://fonts.googleapis.com/css?family=Inconsolata:400,700&amp;display=swap';
import './assets/stylesheets/styles.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";


import Header from './components/Header.js';
import Queue from './pages/Queue.js';
import Home from './pages/Home.js';
import Settings from './pages/Settings.js';
import Friends from './pages/Friends.js';
import Profile from './pages/Profile.js';
import Welcome from './pages/Welcome.js';
console.log("Hello!");

function App() {
  return (
  <BrowserRouter>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i&amp;display=swap"></link>
    <Routes>
      <Route path="/" index element={<Home />} />
      <Route path="/queue" index element={<Queue />} />
      <Route path="/settings" index element={<Settings />} />
      <Route path="/profile" index element={<Profile />} />
      <Route path="/friends" index element={<Friends />} />
      <Route path="/welcome" index element={<Welcome />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
