import React, { useState } from 'react';
import './TheSettings.css'; 

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

  return (
    <div>
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
      </div>
    </div>
  );
};

export default TheSettings;
