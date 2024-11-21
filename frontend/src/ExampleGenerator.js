import React, { useState } from 'react';
import axios from "axios";

const ExampleGenerator = () => {
  const [step, setStep] = useState(1);
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [learningStyle, setLearningStyle] = useState('');
  const [comprehensionLevel, setComprehensionLevel] = useState('');
  const [exampleBasis, setExampleBasis] = useState('');

  const handleNextStep = () => {
    if (step === 1 && grade && subject) {
      setStep(2);
    }
  };

  const handleGenerateExample = () => {
    const newExampleGenerator = {
      grade,
      subject,
      topic,
      learningStyle,
      comprehensionLevel,
      exampleBasis,
    };
    
    createExampleGenerator(newExampleGenerator);
  };

  async function createExampleGenerator(newExampleGenerator){
    const exampleGenerator = {
  
    grade: newExampleGenerator.grade,
    subject: newExampleGenerator.subject,
    topic: newExampleGenerator.topic,
    learningStyle: newExampleGenerator.learningStyle,
    comprehensionLevel: newExampleGenerator.comprehensionLevel,
    exampleBasis: newExampleGenerator.exampleBasis,
    prompt: `" "`,
    max_tokens: 2048,
    };

    try {
      const result = await axios.post('http://localhost:5000/create-exampleGenerator', exampleGenerator);

      if (result.data && typeof result.data === 'string') {
        alert(result.data);
      } else if (result.data && result.data.message) {
        alert(result.data.message);
      } else {
        console.error('No response or unexpected format received from the server.');
      }
    } catch (error) {
      console.error('Error calling backend:', error);
    }
  };

  return (
    <div style={styles.container}>
      {step === 1 && (
        <div style={styles.inputContainer}>
          <h2>User Profile Information</h2>
          <input
            style={styles.inputBox}
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="Grade Level"
          />
          <input
            style={styles.inputBox}
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
          />
          <button style={styles.nextButton} onClick={handleNextStep}>
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={styles.inputContainer}>
          <h2>Example Generator Inputs</h2>
          <input
            style={styles.inputBox}
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic"
          />
          <select
            style={styles.selectBox}
            value={learningStyle}
            onChange={(e) => setLearningStyle(e.target.value)}
          >
            <option value="">Select Learning Style</option>
            <option value="Visual">Visual</option>
            <option value="Auditory">Auditory</option>
            <option value="Reading/Writing">Reading/Writing</option>
            <option value="Kinesthetic">Kinesthetic</option>
          </select>
          <select
            style={styles.selectBox}
            value={comprehensionLevel}
            onChange={(e) => setComprehensionLevel(e.target.value)}
          >
            <option value="">Select Comprehension Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <input
            style={styles.inputBox}
            type="text"
            value={exampleBasis}
            onChange={(e) => setExampleBasis(e.target.value)}
            placeholder="Basis for Example (Context)"
          />
          <button style={styles.generateButton} onClick={() => setStep(3)}>
            Generate Examples
          </button>
        </div>
      )}

      {step === 3 && (
        <div style={styles.summaryContainer}>
          <h2>Example Summary</h2>
          <p><strong>Grade:</strong> {grade}</p>
          <p><strong>Subject:</strong> {subject}</p>
          <p><strong>Topic:</strong> {topic}</p>
          <p><strong>Learning Style:</strong> {learningStyle}</p>
          <p><strong>Comprehension Level:</strong> {comprehensionLevel}</p>
          <p><strong>Basis for Example:</strong> {exampleBasis}</p>
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
  selectBox: {
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
  generateButton: {
    background: '#008CBA',
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

export default ExampleGenerator;