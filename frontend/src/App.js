import React, { useState } from 'react';
import './App.css';
import ChatGPT from './ChatGPT';
import Cale from './Cale';

function App() {
  // State to determine which component to render
  const [currentPage, setCurrentPage] = useState('chat');

  // Function to render the appropriate component based on state
  const renderPage = () => {
    if (currentPage === 'chat') {
      return <ChatGPT setCurrentPage={setCurrentPage} />;
    } else if (currentPage === 'cale') {
      return <Cale />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;