import React, { useState, useEffect } from 'react';
import './App.css';
import ChatGPT from './ChatGPT';
import Cale from './Cale';
import TheSettings from './TheSettings';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleNavigation = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleLogin = (status) => {
    setIsLoggedIn(status);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'chat':
        return <ChatGPT />;
      case 'cale':
        return <Cale />;
      case 'TheSettings':
        return <TheSettings />;
      case 'home':
        return <div>Home Page Content</div>;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <div>
          <h2>Login</h2>
          <form onSubmit={() => handleLogin(true)}>
          
            <button type="submit">Login</button>
          </form>
        </div>
      ) : (
        <>
          <div>
            <h2>Home</h2>
            <button onClick={() => handleNavigation('home')}>Home</button>
            <button onClick={() => handleNavigation('chat')}>Chat</button>
            <button onClick={() => handleNavigation('cale')}>Calendar</button>
            <button onClick={() => handleNavigation('TheSettings')}>Settings</button>
          </div>
          {renderPage()}
        </>
      )}
    </div>
  );
}

export default App;
