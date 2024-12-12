import React, { useState } from 'react';

const DoNowPage = () => {
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [topic, setTopic] = useState('');
  const [generatedContent, setGeneratedContent] = useState(null);

  const handleGenerateDoNowQuiz = () => {
    const quiz = {
      type: 'Quiz',
      grade,
      subject,
      experienceLevel,
      topic,
    };
    setGeneratedContent(quiz);

    setGrade('');
    setSubject('');
    setExperienceLevel('');
    setTopic('');
  };

  const handleGenerateDoNowEssay = () => {
    const essay = {
      type: 'Essay',
      grade,
      subject,
      experienceLevel,
      topic,
    };
    setGeneratedContent(essay);

    setGrade('');
    setSubject('');
    setExperienceLevel('');
    setTopic('');
  };

  return (
    <div style={styles.container}>
      <h1>Do-Now Page</h1>

      <div style={styles.inputSection}>
        <h2>User Profile Information</h2>
        <input
          type="text"
          style={styles.inputBox}
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          placeholder="Enter Grade"
        />
        <input
          type="text"
          style={styles.inputBox}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter Subject"
        />
      </div>

      <div style={styles.inputSection}>
        <h2>User Action Inputs</h2>
        <input
          type="text"
          style={styles.inputBox}
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
          placeholder="Enter Student Experience Level"
        />
        <input
          type="text"
          style={styles.inputBox}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter Topic"
        />
      </div>

      {/* Buttons for Generating Quiz or Essay */}
      <button style={styles.button} onClick={handleGenerateDoNowQuiz}>
        Generate Do-Now Quiz
      </button>
      <button style={styles.button} onClick={handleGenerateDoNowEssay}>
        Generate Do-Now Essay
      </button>

      {/* Display Generated Content */}
      {generatedContent && (
        <div style={styles.contentContainer}>
          <h2>Generated Do-Now {generatedContent.type}</h2>
          <p><strong>Grade:</strong> {generatedContent.grade}</p>
          <p><strong>Subject:</strong> {generatedContent.subject}</p>
          <p><strong>Student Experience Level:</strong> {generatedContent.experienceLevel}</p>
          <p><strong>Topic:</strong> {generatedContent.topic}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: '20px',
  },
  inputBox: {
    display: 'block',
    margin: '10px auto',
    padding: '10px',
    width: '300px',
    fontSize: '14px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    width: '300px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '10px 0',
  },
  contentContainer: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#f0f8ff',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'left',
    width: '80%',
    maxWidth: '600px',
    margin: '0 auto',
  },
};

export default DoNowPage;
