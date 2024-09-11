import React, { useState } from 'react';
import Home from './Home';
import ChatGPT from './ChatGPT';
import Cale from './Cale';
import TheSettings from './TheSettings';
import Login from './Login';
import LoginSuccess from './LoginSuccess';


// Function to generate events for a date range : Mohsen Code
export function createEventSchedule (title, startDate, endDate) {
  const events = [];
  
  const start = new Date(startDate);
  start.setDate(start.getDate() + 1) // The previous function always converts to one day before !!!!
  
  const end = new Date(endDate);
  end.setDate(end.getDate() + 1) // The previous function always converts to one day before !!!!

  // Loop through each day between start and end date
  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    events.push({
      title: title,
      start: new Date(date), // Ensure a new Date object is created
      allDay: true,
    });
  }

  return events;
}

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showHome, setShowHome] = useState(false); 
  const [lessonTitle, setLessonTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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

  const handleGenerate = (title, date, enddate) => {
    setLessonTitle(title);
    setStartDate(date);
    setEndDate(enddate);
    setCurrentPage('cale');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'chat':
        return <ChatGPT setCurrentPage={handleNavigation} onGenerate={handleGenerate} />;
      case 'cale':
        return <Cale lessonTitle={lessonTitle} startDate={startDate} endDate={endDate}/>;
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
