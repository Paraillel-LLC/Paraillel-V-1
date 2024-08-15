import { useState, useEffect } from 'react';
import './App.css';
import ChatGPT from './ChatGPT';
import Cale from './Cale';
import LessonPlanContextProvider from './LessonPlanContext';
import TheSettings from './TheSettings';
import Login from './Login';
import LoginSuccess from './LoginSuccess';
import Home from './Home';

function App() {
  // State to determine which component to render
  const [currentPage, setCurrentPage] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showHome, setShowHome] = useState(false); 

  // Scroll to top of page whenever a new page renders
   useEffect(() => {
    window.scrollTo(0, 0);
   }, [currentPage])

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('LoginSuccess');
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleSubmit = () => {
    setCurrentPage('home');
    setShowHome(true); 
  };

  // Function to render the appropriate component based on state
  const renderPage = () => {
    switch (currentPage) {
        case 'chat':
            return <ChatGPT setCurrentPage={handleNavigation} />;
        case 'cale':
            return <Cale setCurrentPage={handleNavigation} />;
        case 'TheSettings':
            return <TheSettings setCurrentPage={handleNavigation} />;
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
    <LessonPlanContextProvider>
      <div className="App">
      {showHome && <Home setCurrentPage={handleNavigation} />} 
      {renderPage()}
      {isLoggedIn && (
        <>
        </>
      )}
    </div>
    </LessonPlanContextProvider>
  );
}

export default App;