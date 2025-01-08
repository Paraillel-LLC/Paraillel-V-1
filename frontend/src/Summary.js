import React, { useState } from 'react';

const SummaryPage = () => {
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [introWrap, setIntroWrap] = useState('');
  const [summary, setSummary] = useState(null);

  // Function to handle summary generation
  const handleGenerateSummary = () => {
    const generatedSummary = {
      grade,
      subject,
      topic,
      experienceLevel,
      introWrap,
    };
    setSummary(generatedSummary);

    // Reset fields
    setGrade('');
    setSubject('');
    setTopic('');
    setExperienceLevel('');
    setIntroWrap('');
  };

  return (
    <div style={styles.container}>
      <h1>Summary Page</h1>
      
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
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter Topic"
        />
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
          value={introWrap}
          onChange={(e) => setIntroWrap(e.target.value)}
          placeholder="Introduction or Wrap-Up"
        />
      </div>

      <button style={styles.button} onClick={handleGenerateSummary}>
        Generate Summary
      </button>

      {summary && (
        <div style={styles.summaryContainer}>
          <h2>Generated Summary</h2>
          <p><strong>Grade:</strong> {summary.grade}</p>
          <p><strong>Subject:</strong> {summary.subject}</p>
          <p><strong>Topic:</strong> {summary.topic}</p>
          <p><strong>Student Experience Level:</strong> {summary.experienceLevel}</p>
          <p><strong>Introduction or Wrap-Up:</strong> {summary.introWrap}</p>
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
  },
  summaryContainer: {
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

export default SummaryPage;
