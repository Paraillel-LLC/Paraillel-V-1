import React, { useState } from 'react';

const Assignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [className, setClassName] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleAddAssignment = () => {
    if (title.trim() !== '' && dueDate.trim() !== '' && className.trim() !== '') {
      const newAssignment = {
        createdDate: new Date().toLocaleDateString('en-US'), // the current date
        title,
        dueDate,
        className,
      };
      setAssignments([...assignments, newAssignment]);
      setTitle('');
      setDueDate('');
      setClassName('');
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
          {/* Assignment Title Input */}
          <input
            style={styles.inputBox}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter assignment title"
          />
          
          {/* Class Name Input */}
          <input
            style={styles.inputBox}
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Enter class name"
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
              <p style={styles.assignmentTitle}><strong>{assignment.title}</strong></p>
              <p>Class: {assignment.className}</p>
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
