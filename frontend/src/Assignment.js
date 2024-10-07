import React, { useState } from 'react';

const Assignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [Type, setType] = useState('');
  const [Subject, setSubject] = useState('');
  const [Standard, setStandard] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [Questions, setQuestions] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleAddAssignment = () => {
    if (Type.trim() !== '' && dueDate.trim() !== '' && Questions.trim() !== '') {
      const newAssignment = {
        createdDate: new Date().toLocaleDateString('en-US'), // the current date

        Type,
        Subject,
        dueDate,
        Questions,
        Standard,
      };
      setAssignments([...assignments, newAssignment]);
      setType('');
      setSubject('')
      setStandard('');
      setDueDate('');
      setQuestions('');
      setShowInput(false); // Hide input box after adding
    }
  };

  return (
    <div style={styles.container}>
      {/* Assignment Button */}
      <button style={styles.addButton} onClick={() => setShowInput(!showInput)}>
        Add Assignments
      </button>

      {/* Input Container - Appears when the button is clicked */}
      {showInput && (
        <div style={styles.inputContainer}>
        {/* Assignment Subject */}
           <input
            style={styles.inputBox}
            type="text"
            value={Subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter Subject "
          />
          {/* Assignment type Input */}
          <input
            style={styles.inputBox}
            type="text"
            value={Type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Enter Type of Assignment "
          />
           {/* number of questions */}
           <input
            style={styles.inputBox}
            type="text"
            value={Questions}
            onChange={(e) => setQuestions(e.target.value)}
            placeholder="Enter Number of questions"
          />

          {/* Academic Standard Input */}

          <input
            style={styles.inputBox}
            type="text"
            value={Standard}
            onChange={(e) => setStandard(e.target.value)}
            placeholder="Enter Academic State Standards "
          />
          
         
          
          {/* Due Date as a Text Input */}
          <input
            style={styles.inputBox}
            type="text"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            placeholder="Enter due date (MM/DD/YYYY)"
          />

          {/* Save Button */}
          <button style={styles.saveButton} onClick={handleAddAssignment}>
            Save
          </button>
        </div>
      )}

      {/* Rectangle Container */}
      <div style={styles.rectangle}>
        {/* Display Assignments */}
        <div style={styles.assignmentsContainer}>
          {assignments.map((assignment, index) => (
            <div key={index} style={styles.assignmentBox}>
             <p>Created Date: {assignment.createdDate}</p>
              <p><strong>Subject: {assignment.Subject}</strong></p>
              <p>Number of Questions: {assignment.Questions}</p>
              <p>Assignment Type: {assignment.Type}</p>
              <p>Academic Standards: {assignment.Standard}</p>             
              <p>Due Date: {assignment.dueDate}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// Styles for the component
const styles = {
  container: {
    position: 'relative',
    padding: '20px',
  },
  addButton: {
    background: '#008CBA',
    color: 'white',
    border: 'none',
    padding: '15px 32px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '10px 0',
    cursor: 'pointer',
    position: 'absolute',
    left: '250px', // Adjusted position to move slightly to the right
    top: '150px',
    zIndex: 1,
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column', // Display input boxes one below the other
    justifyContent: 'start',
    alignItems: 'flex-start',
    margin: '20px 0',
    position: 'absolute',
    left: '250px', // Same adjusted position as the button
    top: '200px',
    zIndex: 1,
  },
  inputBox: {
    padding: '3px',
    margin: '3px 0', // Add spacing between inputs
    fontSize: '12px',
    width: '200px', // Set a consistent width for all input fields
  },
  saveButton: {
    padding: '10px 15px',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    marginTop: '10px',
  },
  rectangle: {
    boxSizing: 'border-box',
    position: 'absolute',
    width: '1264px',
    height: '600px',
    left: '248px',
    top: '400px', 
    background: '#FFFFFF',
    border: '1px solid #E8E8E8',
  },
  assignmentsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '20px',
  },
  assignmentBox: {
    background: '#ADD8E6',
    border: '1px solid #ddd',
    padding: '20px',
    margin: '10px',
    borderRadius: '5px',
    width: 'calc(30% - 40px)', 
    textAlign: 'left',
  },
  assignmentTitle: {
    marginBottom: '10px',
  },
};

export default Assignment;
