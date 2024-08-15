import React, { useState } from 'react';

const topics = {
  Profile: "Your personal information",
  Account: "Your account settings",
  LessonPlan: "Manage your lesson plans",
  Notification: "Your notification preferences",
  Subscription: "Your subscription details",
};

const profileDetails = {
  Teacher: [
    "First Name",
    "Last Name",
    "Profile Picture",
    "Subject(s) Taught",
    "Grade Level(s)",
    "Bio",
    "District ID",
    "School ID"
  ],
  Administration: [
    "First Name",
    "Last Name",
    "Profile Picture",
    "Department",
    "Role/Position",
    "Bio",
    "District ID",
    "School ID"
  ],
  District: [
    "First Name",
    "Last Name",
    "Profile Picture",
    "Role/Position",
    "District Information",
    "Bio",
    "District ID"
  ]
};

const districtSchoolMapping = {
  "District1": ["School1-1", "School1-2"],
  "District2": ["School2-1", "School2-2"],
  "District3": ["School3-1", "School3-2"]
};

const TheSettings = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState('Teacher');
  const [formData, setFormData] = useState({});
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [subjects, setSubjects] = useState([""]); // Default one subject field

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

  const handleDistrictChange = (event) => {
    const district = event.target.value;
    setSelectedDistrict(district);
    setFormData({
      ...formData,
      "District ID": district,
      "School ID": districtSchoolMapping[district][0]
    });
    setSelectedSchool(districtSchoolMapping[district][0]);
  };

  const handleSchoolChange = (event) => {
    const school = event.target.value;
    setSelectedSchool(school);
    setFormData({
      ...formData,
      "School ID": school
    });
  };

  const handleAddSubject = () => {
    setSubjects([...subjects, ""]);
  };

  const handleRemoveSubject = (index) => {
    if (subjects.length > 1) { // Ensure at least one subject field remains
      const newSubjects = subjects.filter((_, idx) => idx !== index);
      setSubjects(newSubjects);
      setFormData({
        ...formData,
        "Subject(s) Taught": newSubjects
      });
    }
  };

  const handleSubjectChange = (index, value) => {
    const newSubjects = [...subjects];
    newSubjects[index] = value;
    setSubjects(newSubjects);
    setFormData({
      ...formData,
      "Subject(s) Taught": newSubjects
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form data submitted:", formData);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
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
                detail === "District ID" ? (
                  <div key={index} className="form-group">
                    <label>{detail}</label>
                    <select 
                      name={detail} 
                      value={formData[detail] || ''} 
                      onChange={handleDistrictChange}
                      disabled={!isEditing}
                    >
                      <option value="">Select District</option>
                      {Object.keys(districtSchoolMapping).map((district, idx) => (
                        <option key={idx} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>
                ) : detail === "School ID" ? (
                  <div key={index} className="form-group">
                    <label>{detail}</label>
                    <select 
                      name={detail} 
                      value={selectedSchool} 
                      onChange={handleSchoolChange}
                      disabled={!isEditing || !selectedDistrict}
                    >
                      <option value="">Select School</option>
                      {selectedDistrict && districtSchoolMapping[selectedDistrict].map((school, idx) => (
                        <option key={idx} value={school}>{school}</option>
                      ))}
                    </select>
                  </div>
                ) : detail === "Subject(s) Taught" ? (
                  <div key={index} className="form-group">
                    <label>{detail}</label>
                    <div className="subjects-container">
                      {subjects.map((subject, idx) => (
                        <div key={idx} className="subject-entry">
                          <input 
                            type="text" 
                            value={subject} 
                            onChange={(e) => handleSubjectChange(idx, e.target.value)}
                            disabled={!isEditing}
                          />
                          {isEditing && (
                            <button 
                              type="button" 
                              onClick={() => handleRemoveSubject(idx)}
                              className="remove-subject-button"
                            >
                              −
                            </button>
                          )}
                        </div>
                      ))}
                      {isEditing && (
                        <button 
                          type="button" 
                          onClick={handleAddSubject}
                          className="add-subject-button"
                        >
                          +
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div key={index} className="form-group">
                    <label>{detail}</label>
                    <input 
                      type="text" 
                      name={detail} 
                      value={formData[detail] || ''} 
                      onChange={handleInputChange} 
                      disabled={!isEditing}
                    />
                  </div>
                )
              ))}
              <div className="button-group">
                <button type="submit" className="submit-button">Submit</button>
                <button type="button" className="edit-button" onClick={handleEdit}>Edit</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TheSettings;
