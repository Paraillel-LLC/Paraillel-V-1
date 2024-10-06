import React, { useState } from 'react';

const resourceTopics = ["Textbooks", "Material", "Shared", "Personal"];

const ResourcesPage = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleTopicSelection = (topic) => {
    setSelectedTopic(topic);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      {/* Navbar Section */}
      <div className="resources-navbar">
        <div className="flex space-x-2">
          {resourceTopics.map((topic, index) => (
            <button 
              key={index} 
              className="button" 
              onClick={() => handleTopicSelection(topic)}
            >
              {topic}
            </button>
          ))}
          <button className="button filter-button">+ Filter</button>
        </div>
        
        {/* Add Resources Button */}
        <button className="button add-resources-button">+ Add Resources</button>
      </div>

      {/* Display Selected Topic */}
      
      </div>
  );
};

export default ResourcesPage;
