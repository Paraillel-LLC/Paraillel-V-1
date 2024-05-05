import React, { useState, useEffect } from 'react';
import './App.css';
import Home from './Home';
import ChatGPT from './ChatGPT';
import Cale from './Cale';
import TheSettings from './TheSettings';
import Login from './Login';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleNavigation = (page) => {
    setCurrentPage(page, () => {
      window.scrollTo(0, 0);
    });
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
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <Home setCurrentPage={handleNavigation} />
          {renderPage()}
        </>
      )}
    </div>
  );
}


export default App;
