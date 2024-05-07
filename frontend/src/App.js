import React, { useState } from 'react';
import './App.css';
import Home from './Home';
import ChatGPT from './ChatGPT';
import Cale from './Cale';
import TheSettings from './TheSettings';
import Login from './Login';
import LoginSuccess from './LoginSuccess';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showHome, setShowHome] = useState(false); 

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('LoginSuccess');
  };

  const handleNavigation = (page) => {
    setCurrentPage(page, () => {
      window.scrollTo(0, 0);
    });
  };

  const handleSubmit = () => {
    setCurrentPage('home');
    setShowHome(true); 
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
        return <Home setCurrentPage={handleNavigation} />;
      case 'login':
        return <Login onLogin={handleLogin} />;
      case 'LoginSuccess':
        return <LoginSuccess onSubmit={handleSubmit} />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="App">
      {showHome && <Home setCurrentPage={handleNavigation} />} 
      {renderPage()}
      {isLoggedIn && (
        <>
        </>
      )}
    </div>
  );
}

export default App;
