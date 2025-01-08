import React, { useRef, useState, useEffect } from 'react';

const DocumentsPage = () => {
  const [lessonPlans, setLessonPlans] = useState([]);
  const [selectedEssay, setSelectedEssay] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // New state for edit mode
  const [editableEssay, setEditableEssay] = useState(""); // State for edited text
  const [lessonPlanid, setLessonPlanid] = useState(null);

  const fetchLessonPlans = async () => {
    try {
      const username = localStorage.getItem('username');

      const response = await fetch(`http://localhost:5000/lesson-plans-list/${username}`);
      const data = await response.json();
      
      if (data.successful)
      {
        setLessonPlans(data.lessonplans);
      }
      else
      {
        alert(data.message);
      }

      
    } catch (error) {
      console.error("Error fetching lesson plans:", error);
    }
  };

  const fetchEssay = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/lesson-plan-detail/${id}`);
      const data = await response.json();
      setSelectedEssay(data.essay);
      setEditableEssay(data.essay); // Initialize editable essay
      setLessonPlanid(id);
      setShowPopup(true);
    } catch (error) {
      console.error("Error fetching essay:", error);
    }
  };

  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("File selected:", file.name);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
    const saveEssay = async () => {
      try {
        const response = await fetch(`http://localhost:5000/update-lessonplan_essay`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lessonplan_id: lessonPlanid, essay: editableEssay }),
        });
        const data = await response.json();
  
        if (data.successful) {
          setSelectedEssay(editableEssay); // Update the selected essay
          setIsEditing(false); // Exit editing mode
          alert("Essay updated successfully!");
        } else {
          alert("Failed to update essay.");
        }
      } catch (error) {
        console.error("Error saving essay:", error);
      }
  };

  return (
    <div style={styles.container}>
       <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={triggerFileInput}>Upload Document</button>
        <button style={styles.button} onClick={fetchLessonPlans}>View Document</button>
        <button style={styles.button}>Edit Document</button>
      </div>
      <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileUpload} />
      {lessonPlans.length > 0 && (
        <div style={styles.gridContainer}>
          <div style={styles.gridHeader}>
            <div style={styles.gridCell}>Lesson Plan ID</div>
            <div style={styles.gridCell}>Title</div>
            <div style={styles.gridCell}>Subject</div>
          </div>
          {lessonPlans.map((plan) => (
            <div key={plan.lesson_id} style={styles.gridRow} onClick={() => fetchEssay(plan.lesson_id)}>
              <div style={styles.gridCell}>{plan.lesson_id} </div>
              <div style={styles.gridCell}>{plan.title}</div>
              <div style={styles.gridCell}>{plan.subject}</div>
            </div>
          ))}
        </div>
      )}

      {showPopup && (
        <div style={styles.popup}>
          <div style={styles.popupContent}>
            <h3>Essay</h3>
            {isEditing ? (
              <textarea
                style={styles.textArea}
                value={editableEssay}
                onChange={(e) => setEditableEssay(e.target.value)}
              />
            ) : (
            <div style={styles.essayContainer}dangerouslySetInnerHTML={{
        __html: selectedEssay?.replace(/\n/g, "<br>"), 
              }}
            ></div>
            )}
            <div style={styles.popupButtonContainer}>
              <button
                style={styles.editButton}
                onClick={() => {(isEditing ? saveEssay() : setIsEditing(true))}}
              >
                {isEditing ? "Save" : "Edit"}
              </button>
              <button
                style={styles.closeButton}
                onClick={() => {
                  if(isEditing)
                  {
                      setIsEditing(false);
                      setEditableEssay(selectedEssay);
                      
                  }
                  else
                  {
                      setShowPopup(false);
                      setIsEditing(false);
                  }
                }}
              >
                {isEditing ? "Cancel" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column', // Stack items vertically
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    gap: '20px', // Adds spacing between buttons and the grid
  },
  buttonContainer: {
    display: 'flex',
    gap: '20px', // Adds space between buttons
    marginBottom: '20px', // Adds space below buttons for the grid
  },
  button: {
    padding: '15px 30px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '200px', // Fixed width for uniform button size
  },
  gridContainer: {
    display: "flex",
    flexDirection: "column",
    width: "40%",
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden",
  },
  gridHeader: {
    display: "flex",
    backgroundColor: "#f1f1f1",
    fontWeight: "bold",
    borderBottom: "2px solid #ddd",
  },
  gridRow: {
    display: "flex",
    borderBottom: "1px solid #ddd",
    cursor: 'pointer', // Makes the row clickable
    transition: 'background-color 0.3s', // Smooth transition for hover effect
  },
  gridCell: {
    flex: 1,
    padding: "10px",
    textAlign: "left",
  },

  popup: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  popupContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "80%",
    height: "80%",
    overflowY: "auto",
  },
  essayContainer: {
    maxHeight: "calc(100% - 120px)",
    overflowY: "auto",
    lineHeight: '1.6', // Add line spacing
    fontFamily: 'Arial, sans-serif', // Use a readable font
    whiteSpace: 'pre-wrap', // Ensure whitespace is preserved
  },
  closeButton: {
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    display: "block", // Makes the button take the entire line
    
  },
  textArea: {
    width: "100%",
    height: "70%",
    padding: "10px",
    fontSize: "16px",
    lineHeight: "1.6",
    borderRadius: "8px",
    border: "1px solid #ddd",
    resize: "none",
  },
  popupButtonContainer: {
    display: "flex",
    justifyContent: "center", 
    alignItems: "center", 
    gap: "10px", 
    marginTop: "20px",
  },
  editButton: {
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#28a745", // Green for Save/Edit
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    
  },
  
};

export default DocumentsPage;