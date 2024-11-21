import React, { useState } from 'react';
import axios from "axios";

const QuizGenerator = () => {
  const [step, setStep] = useState(1); 
  const [quizAudience, setQuizAudience] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [numQuestions, setNumQuestions] = useState(''); 
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');

  // Function to handle moving to the next step
  const handleNextStep = () => {
    if (quizAudience && questionType && numQuestions && subject && topic) {

      const newQuiz = {
        quizAudience,
        questionType,
        numQuestions,
        subject,
        topic
      };
      createQuiz(newQuiz); // Call createQuiz with the form data
      setStep(2); // Move to step 2 after submitting the form
    } else {
      alert('Please fill out all fields');
    }

  };

  async function createQuiz(newQuiz){
    const quiz = {
  
    quizAudience: newQuiz.quizAudience,
    questionType: newQuiz.questionType,
    numQuestions: newQuiz.numQuestions,
    subject: newQuiz.subject,
    topic: newQuiz.topic,
    prompt: `"As an experienced pedagogy expert, create a comprehensive and engaging quiz for Grade-level students on the topic of "${topic}" within ${subject}. This quiz should be structured as a ${questionType} and contain ${numQuestions} questions. Ensure the assignment aligns with ${quizAudience}."`,
    max_tokens: 2048,
    };

    try {
      const result = await axios.post('http://localhost:5000/create-quiz', quiz);

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
          <h2>Quiz Details</h2>
          <input
            style={styles.inputBox}
            type="text"
            value={quizAudience}
            onChange={(e) => setQuizAudience(e.target.value)}
            placeholder="For which audience is the quiz?"
          />
          <input
            style={styles.inputBox}
            type="text"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            placeholder="What kind of questions?"
          />
          <input
            style={styles.inputBox}
            type="number"
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
            placeholder="Enter Number of Questions"
          />
          <input
            style={styles.inputBox}
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter Subject"
          />
          <input
            style={styles.inputBox}
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter Topic"
          />
          <button style={styles.nextButton} onClick={handleNextStep}>
            Next
          </button>
        </div>
      )}

      {/* Step 2: Display a summary */}
      {step === 2 && (
        <div style={styles.summaryContainer}>
          <h2>Quiz Summary</h2>
          <p><strong>Audience:</strong> {quizAudience}</p>
          <p><strong>Question Type:</strong> {questionType}</p>
          <p><strong>Number of Questions:</strong> {numQuestions}</p>
          <p><strong>Subject:</strong> {subject}</p>
          <p><strong>Topic:</strong> {topic}</p>
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

export default QuizGenerator;