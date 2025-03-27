import React, { useEffect, useState } from 'react';
import axios from "axios";
import Modal from "./Modal";

const QuizGenerator = () => {
  const [step, setStep] = useState(1); 
  const [quizAudience, setQuizAudience] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [numQuestions, setNumQuestions] = useState(''); 
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [due_date, setdue_date] = useState('');

  const [classname, setclassname] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
      

  const [showModal, setShowModal] = useState(false);
  const [essayContent, setEssayContent] = useState("Initializing...");
  const [ititle, setititle] = useState("");
  const [tablename, settablename] = useState("");
  const [keyname, setkeyname] = useState("");
  const [valname, setvalname] = useState("");
  const [keyval, setkeyval] = useState("");
    
  const hideModal = () => setShowModal(false);

  // Function to handle moving to the next step
  const handleNextStep = () => {
    if (quizAudience && questionType && numQuestions && subject && topic) {
      
      const newQuiz = {
        quizAudience,
        questionType,
        numQuestions,
        subject,
        topic,
        due_date,
        selectedClass
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
    due_date: newQuiz.due_date,
    class_name: newQuiz.selectedClass,

    prompt: `"Create a quiz for the audience of "${quizAudience}", focusing on the subject of "${subject}" and the topic of "${topic}". The quiz should consist of "${numQuestions}" questions and cover the following question type: "${questionType}". Ensure the questions are appropriate for the specified audience and effectively assess their knowledge of the chosen subject and topic."`,
    username: localStorage.getItem('username'),
    max_tokens: 2048,
    };

    try {
      const result = await axios.post('http://localhost:5000/create-quiz', quiz);

      if (result.data && typeof result.data === 'string') {
        settablename("Quiz")
        setkeyname("quiz_id")
        setvalname("content")
        setkeyval(result.data.quiz_id);
        
        setShowModal(true)

        alert(result.data);
      } else if (result.data && result.data.message) {
        settablename("Quiz")
        setkeyname("quiz_id")
        setvalname("content")
        setkeyval(result.data.quiz_id);
        
        setShowModal(true)

        alert(result.data.message);
      } else {
        console.error('No response or unexpected format received from the server.');
      }
    } catch (error) {
      console.error('Error calling backend:', error);
    }
  };

  useEffect(() => {
    fetch("http://localhost:5000/Get_ClassName/"+ localStorage.getItem('username'))  // Backend API URL
      .then(response => response.json())
      .then(data => setclassname(data.options))
      .catch(error => console.error("Error fetching data:", error));
  }, []);
    
  
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
           <input
            style={styles.inputBox}
            type="text"
            value={due_date}
            onChange={(e) => setdue_date(e.target.value)}
            placeholder="Enter due date (YYYY-MM-DD)"
          />
          <select id="classcombo" style={styles.selectBox} lassName="input mt-1" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            <option value="" disabled>Select a ClassName</option>
              {classname.map((option, index) => (
                <option key={index} value={option}>
                {option}
            </option>
            ))}
          </select>
          
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
          <p><strong>Due Date:</strong> {due_date}</p>
          <p><strong>Class:</strong> {selectedClass}</p>
        </div>
      )}
      <Modal
        isVisible={showModal}
        essay={essayContent}
        tablename={tablename}
        keyname={keyname}
        valname={valname}
        keyval={keyval}
        onHide={hideModal}
      />  
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
  summaryContainer: {
    marginTop: '20px',
  },
};

export default QuizGenerator;