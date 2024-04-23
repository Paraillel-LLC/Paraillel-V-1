import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Home';
import LoginWrapper from './LoginWrapper';
import CreateAccountWrapper from './CreateAccountWrapper';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginWrapper onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/create-account" element={<CreateAccountWrapper />} />
          <Route
            path="/"
            element={isLoggedIn ? <Home /> : <LoginWrapper onLogin={() => setIsLoggedIn(true)} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
