import React, { useState } from 'react';
import './TheSettings.css'; 
import ProfileSettings from './ProfileSettings';

const topics = {
  Profile: "Your personal information",
  Account: "Your account settings",
  LessonPlan: "Manage your lesson plans",
  Notification: "Your notification preferences",
  Subscription: "Your subscription details",
};

const TheSettings = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleTopicSelection = (topic) => {
    setSelectedTopic(topic);
  };

  

  const renderPage = () => {
    switch (selectedTopic) {
      case 'Profile':
        return <ProfileSettings />;
      case 'Account':
        return <div>Account Component</div>;
      case 'LessonPlan':
        return <div>Lesson Plan Component</div>;
      case 'Notification':
        return <div>Notification Preferences Component</div>;
      case 'Subscription':
        return <div>Susbcription Details component</div>;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <div className="settings-navbar">
        {Object.keys(topics).map((topic, index) => (
          <button 
            key={index} 
            onClick={() => handleTopicSelection(topic)}
            className={selectedTopic === topic ? 'active' : ''}
          >
            {topic}
          </button>
        ))}
      </div>
      <div className="topic-description">
        {selectedTopic && <p>{topics[selectedTopic]}</p>}
        {renderPage()}
      </div>
    </div>
  );
};

export default TheSettings;