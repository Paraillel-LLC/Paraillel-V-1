import React, { useState } from 'react';
import './TheSettings.css'; 

const topics = {
  Profile: "Your personal information",
  Account: "Your account settings",
  LessonPlan: "Manage your lesson plans",
  Notification: "Your notification preferences",
  Subscription: "Your subscription details",
};

const profileDetails = {
  Teacher: [
    "Name",
    "Email",
    "Phone Number",
    "Profile Picture",
    "Subject(s) Taught",
    "Grade Level(s)",
    "Bio",
    "District ID",
    "School ID"
  ],
  Administration: [
    "Name",
    "Email",
    "Phone Number",
    "Profile Picture",
    "Department",
    "Role/Position",
    "Bio",
    "District ID",
    "School ID"
  ],
  District: [
    "Name",
    "Email",
    "Phone Number",
    "Profile Picture",
    "Role/Position",
    "District Information",
    "Bio",
    "District ID"
  ]
};

const additionalDetails = [
  "Name",
  "Email",
  "Phone Number",
  "Profile Picture",
  "Role/Position",
  "District Information",
  "Bio",
  "District ID"
];

const TheSettings = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState('Teacher'); 
  const [formData, setFormData] = useState({}); 

  const handleTopicSelection = (topic) => {
    setSelectedTopic(topic);
  };

  const handleProfileSelection = (event) => {
    setSelectedProfile(event.target.value);
    setFormData({}); 
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form data submitted:", formData);
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
      <div className="profile-selector">
        {selectedTopic === "Profile" && (
          <select value={selectedProfile} onChange={handleProfileSelection}>
            <option value="Teacher">Teacher</option>
            <option value="Administration">Administration</option>
            <option value="District">District</option>
          </select>
        )}
      </div>
      <div className="topic-description">
        {selectedTopic && <p>{topics[selectedTopic]}</p>}
        {selectedTopic === "Profile" && (
          <div className="profile-content">
            <form onSubmit={handleSubmit}>
              {profileDetails[selectedProfile].map((detail, index) => (
                <div key={index} className="form-group">
                  <label>{detail}</label>
                  <input 
                    type="text" 
                    name={detail} 
                    value={formData[detail] || ''} 
                    onChange={handleInputChange} 
                  />
                </div>
              ))}
              <button type="submit" className="submit-button">Submit</button>
            </form>
            <div className="additional-details">
              {additionalDetails.map((detail, index) => (
                <p key={index}>{detail}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TheSettings;
