import React, { useState } from 'react';
import axios from "axios";
import Modal from "./Modal";

const StudyGuide = () => {
  const [studyGuides, setStudyGuides] = useState([]);
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [teachingStyle, setTeachingStyle] = useState('');
  const [showInput, setShowInput] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [essayContent, setEssayContent] = useState("Initializing...");
  const [ititle, setititle] = useState("");
  const [tablename, settablename] = useState("");
  const [keyname, setkeyname] = useState("");
  const [valname, setvalname] = useState("");
  const [keyval, setkeyval] = useState("");
      
  const hideModal = () => setShowModal(false);

  // Function to Add a New Study Guide
  const handleAddStudyGuide = () => {
    if (grade.trim() !== '' && subject.trim() !== '' && teachingStyle.trim() !== '') {
      const newStudyGuide = {
        createdDate: new Date().toLocaleDateString('en-US'), // The current date
        grade,
        subject,
        topic,
        teachingStyle,
      };
      createStudyGuide(newStudyGuide);

      setStudyGuides([...studyGuides, newStudyGuide]);
      setGrade('');
      setSubject('');
      setTopic('');
      setTeachingStyle('');
      setShowInput(false);
    }
  };

  async function createStudyGuide(newStudyGuide){
    const studyGuide = {
  
    grade: newStudyGuide.grade,
    subject: newStudyGuide.subject,
    topic: newStudyGuide.topic,
    teachingStyle: newStudyGuide.teachingStyle,
    prompt: `"Generate a detailed and structured study guide for the subject "${subject}", focusing on the topic "${topic}". The guide should incorporate curated resources such as academic papers, articles, and relevant study materials, with direct links to each resource. Additionally, include insights and discussions from social media platforms (e.g., Twitter, Reddit, LinkedIn) that offer practical perspectives or advice on the topic. Ensure the content aligns with the teaching style of "${teachingStyle}" and is tailored to the learning needs of "${grade}" students.The guide should offer a balance of theoretical knowledge and practical applications suitable for the grade level."`,
    username: localStorage.getItem('username'),
    max_tokens: 2048,
    };

    try {
      const result = await axios.post('http://localhost:5000/create-studyGuide', studyGuide);

      if (result.data && typeof result.data === 'string') {

        settablename("StudyGuide")
        setkeyname("id")
        setvalname("output")
        setkeyval(result.data.studyguide_id);
        
        setShowModal(true)

        alert(result.data);
      } else if (result.data && result.data.message) {
        
        settablename("StudyGuide")
        setkeyname("id")
        setvalname("output")
        setkeyval(result.data.studyguide_id);
        
        setShowModal(true)

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
      {/* Centered Add Study Guide Button */}
      {!showInput && (
        <button style={styles.centerButton} onClick={() => setShowInput(true)}>
          Add Study Guide
        </button>
      )}

      {/* Input Form */}
      {showInput && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>New Study Guide</h2>
            <input
              style={styles.inputBox}
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="Enter Grade"
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
              value={teachingStyle}
              onChange={(e) => setTeachingStyle(e.target.value)}
              placeholder="Enter Teaching Style"
            />
            <button style={styles.saveButton} onClick={handleAddStudyGuide}>
              Save
            </button>
            <button style={styles.cancelButton} onClick={() => setShowInput(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Display Study Guides */}
      <div style={styles.guidesContainer}>
        {studyGuides.map((guide, index) => (
          <div key={index} style={styles.studyBox}>
            <p><strong>Created Date:</strong> {guide.createdDate}</p>
            <p><strong>Grade:</strong> {guide.grade}</p>
            <p><strong>Subject:</strong> {guide.subject}</p>
            <p><strong>Topic:</strong> {guide.topic}</p>
            <p><strong>Teaching Style:</strong> {guide.teachingStyle}</p>
          </div>
        ))}
      </div>
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
  centerButton: {
    background: '#4CAF50',
    color: 'white',
    padding: '15px 30px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
    marginTop: '20px',
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    zIndex: 10,
    padding: '30px',
    width: '300px',
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  modalTitle: {
    marginBottom: '20px',
    fontSize: '18px',
  },
  inputBox: {
    padding: '10px',
    margin: '10px 0',
    fontSize: '14px',
    width: '100%',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  saveButton: {
    background: '#008CBA',
    color: 'white',
    padding: '10px 20px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
    marginTop: '15px',
  },
  cancelButton: {
    background: '#f44336',
    color: 'white',
    padding: '10px 20px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
    marginTop: '10px',
  },
  guidesContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: '30px',
  },
  studyBox: {
    background: '#f0f8ff',
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '15px',
    margin: '10px',
    width: 'calc(30% - 20px)',
    boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.1)',
  },
};

export default StudyGuide;