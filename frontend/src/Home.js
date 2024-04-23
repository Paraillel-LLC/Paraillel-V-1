import React from 'react';
import './Home.css'; 

function Home({ setCurrentPage }) {
  const topics = {
    
    "General": ["Login/CreateAccount","Dashboard", "Calendar","LessonPlan", "Assignments", "Resources"],
    "Communications": ["Collaborations", "Messages"],
    "Data": ["Roster", "Analytics", "Reports"],
    "Control": ["Settings"]
  };

  // Function to handle page navigation
  const handleNavigation = (topic) => {
    if (topic === "LessonPlan") {
      setCurrentPage("chat"); 
    } else if (topic === "Dashboard") {
      setCurrentPage("home"); 
    } else if (topic === "Calendar") {
      setCurrentPage("cale"); 
    }else if (topic === "Settings") {
      setCurrentPage("TheSettings"); 
    }
      else if (topic === "Login/CreateAccount") {
        setCurrentPage("LoginWrapper"); 
    } else {
      setCurrentPage(topicComponents[topic]);
    }
  };

  const topicComponents = {
    "LessonPlan": "ChatGPT", 
    "Dashboard": "home", 
    "Calendar": "Cale",
    "Assignments": "Assignments", 
    "Resources": "Resources", 
    "Collaborations": "Collaborations", 
    "Messages": "Messages",
    "Roster": "Roster",
    "Analytics": "Analytics", 
    "Reports": "Reports", 
    "Settings": "Settings" 
  };
  

  
  return (
    <div className="home-container">
      <div className="nav-bar">
      <img src="/logo.png" alt="Navigation" style={{ width: '198px', height: 'auto' }} />
        <ul>
          {Object.keys(topics).map((topicCategory, index) => (
            <li key={index}>
              <p className="topic-category">{topicCategory}</p>
              <ul>
                {topics[topicCategory].map((topic, idx) => (
                  <li key={idx}>
                    <a href="#!" onClick={() => handleNavigation(topic)} className="topic-link">
                      <span className="topic-name">{topic}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
