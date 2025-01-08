import React, { useState } from 'react';

const EssayGenerator = () => {
  const [step, setStep] = useState(1); 
  const [gradeLevel, setGradeLevel] = useState('');
  const [essayFile, setEssayFile] = useState(null); 
  const [rubricType, setRubricType] = useState('');

  const handleNextStep = () => {
    if (gradeLevel && essayFile && rubricType) {
      setStep(2);
    }
  };

  const handleFileChange = (event) => {
    setEssayFile(event.target.files[0]);
  };

  return (
    <div style={styles.container}>
      
      {step === 1 && (
        <div style={styles.inputContainer}>
          <h2>Essay Submission</h2>
          <input
            style={styles.inputBox}
            type="text"
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
            placeholder="Enter Student Grade Level"
          />
          <input
            style={styles.inputBox}
            type="file"
            onChange={handleFileChange}
            placeholder="Upload Student Essay File"
          />
          <select
            style={styles.inputBox}
            value={rubricType}
            onChange={(e) => setRubricType(e.target.value)}
          >
            <option value="">Select Rubric Type</option>
            <option value="6+1 Trait Writing Model">6+1 Trait Writing Model</option>
            <option value="AP English Language and Composition Rubric">AP English Language and Composition Rubric</option>
            <option value="Common Core State Standards Writing Rubric">Common Core State Standards Writing Rubric</option>
            <option value="Five-Paragraph Essay Rubric">Five-Paragraph Essay Rubric</option>
            <option value="ODL Rubric">Organization, Development, and Language (ODL) Rubric</option>
          </select>
          <button style={styles.nextButton} onClick={handleNextStep}>
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={styles.summaryContainer}>
          <h2>Essay Submission Summary</h2>
          <p><strong>Grade Level:</strong> {gradeLevel}</p>
          <p><strong>Essay File:</strong> {essayFile ? essayFile.name : 'No file uploaded'}</p>
          <p><strong>Rubric Type:</strong> {rubricType}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    textAlign: 'center',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  inputBox: {
    padding: '10px',
    margin: '10px 0',
    fontSize: '14px',
    width: '100%',
    maxWidth: '300px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  nextButton: {
    background: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
    marginTop: '15px',
  },
  summaryContainer: {
    marginTop: '20px',
  },
};

export default EssayGenerator;