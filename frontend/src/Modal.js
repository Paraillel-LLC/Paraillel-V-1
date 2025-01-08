import React, { useState, useEffect } from "react";
import axios from "axios";

const Modal = ({ isVisible, ititle, tablename, keyname, valname, keyval, essay, onHide }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(essay);

  const fetchEssay = async () => {
    try {
      const response = await fetch(`http://localhost:5000/Get_LLM_detail/${tablename}/${keyname}/${valname}/${keyval}`);
      const data = await response.json();
      //setSelectedEssay(data.essay);
      setEditableContent(data.essay); // Initialize editable essay
      //setLessonPlanid(id);
      //setShowPopup(true);
    } catch (error) {
      console.error("Error fetching essay:", error);
    }
  };

  useEffect(() => {
   
    if (isVisible) {
    fetchEssay(); // Call the RESTful API
    setEditableContent(essay);
  }
  }, [isVisible, essay]);

  if (!isVisible) return null;

  
  const handleSave = async () => {
    
    const saveitems = {
  
      tablename: tablename,
      keyname: keyname,
      valname: valname,
      keyval: keyval,
      editableContent: editableContent
      };
  
      
    try {
        const response = await axios.post('http://localhost:5000/Save_LLM_detail', saveitems);
        const data = response.data; // Axios automatically parses JSON

        if (data.successful) {
           alert(data.message);
        } else {
        alert(data.message);
        }
    } catch (error) {
        console.error("Error saving essay:", error);
  }
    setIsEditing(false);
    //onHide(); // Close the modal after saving
  };

  const handleClose = () => {
    if (isEditing) {
      setIsEditing(false);
      setEditableContent(essay); // Revert changes
    } else {
      onHide()
    }
  };

  return (
    <div style={styles.popup}>
      <div style={styles.popupContent}>
        <div style={styles.contentContainer}>
          <h3>{ititle}</h3>
          {isEditing ? (
            <textarea
              style={styles.textArea}
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
            />
          ) : (
            <div
              style={styles.essayContainer}
              dangerouslySetInnerHTML={{
                __html: editableContent?.replace(/\n/g, "<br>"),
              }}
            ></div>
          )}
        </div>
        <div style={styles.popupButtonContainer}>
          <button
            style={styles.editButton}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
          >
            {isEditing ? "Save" : "Edit"}
          </button>
          <button style={styles.closeButton} onClick={handleClose}>
            {isEditing ? "Cancel" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
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
    zIndex: 1000,
  },
  popupContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "80%",
    height: "80%",
    display: "flex",
    flexDirection: "column", // Ensure vertical layout
    justifyContent: "space-between", // Space between content and buttons
    
  },
  contentContainer: {
    flex: 1,
    overflowY: "auto", // Allow scrolling for content
    marginBottom: "10px", // Add some space above the buttons
    
  },
  textArea: {
    width: "100%",
    height: "100%",
    padding: "10px",
    fontSize: "16px",
    lineHeight: "1.6",
    borderRadius: "8px",
    border: "1px solid #ddd",
    resize: "none",
  },
  essayContainer: {
    whiteSpace: "pre-wrap", // Ensure whitespace is preserved
    lineHeight: "1.6", // Add line spacing
    fontFamily: "Arial, sans-serif", // Use a readable font
  },
  popupButtonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px", // Add some space above the buttons
  },
  editButton: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  closeButton: {
    padding: "10px 20px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Modal;
