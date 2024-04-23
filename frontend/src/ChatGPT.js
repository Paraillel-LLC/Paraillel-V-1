import React, { useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "./Calendar.css";

const ChatGPT = ({ setCurrentPage }) => {
  const [response, setResponse] = useState("");
  const [grade, setGrade] = useState("1");
  const [lessonTitle, setLessonTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [teachingStyle, setTeachingStyle] = useState("Montessori Style");
  const [planDuration, setPlanDuration] = useState("1-4 hours");
  const [stateAcademicStandard, setStateAcademicStandard] = useState("");
  const [startDate, setStartDate] = useState("");
  const [theme, setTheme] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("Easy");
  const [date, setDate] = useState(new Date());
  const [districtId, setDistrictId] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [gradeId, setGradeId] = useState(""); // Note: You already have a 'grade' state, you might repurpose it or distinguish between grade name and gradeId

  const teachingStyles = [
    "Regular School Based",
    "Montessori Style",
    "Reggio Emilia Style",
    "Project-Based Learning",
    "Flipped Classroom",
    "Mastery Learning",
    "Covert or Incidental Learning",
    "Inquiry-Based Learning",
    "Direct Instruction",
    "Collaborative Learning",
    "Problem-Based Learning",
    "Experiential Learning",
    "Game-Based Learning",
    "Gamification",
    "Differentiated Instruction",
    "Peer Teaching",
    "Service Learning",
    "Blended Learning",
    "Self-Directed Learning",
    "Co-Teaching",
    "Brain-Based Learning",
    "Outdoor Learning",
    "Integrative Learning",
    "Via Negativa Learning",
    "Culturally Responsive Teaching",
    "Constructivist Learning",
    "Socratic Method",
    "Competency-Based Learning",
    "Discrete Trial Teaching (DTT)",
    "Incidental Teaching",
    "Errorless Teaching",
    "Self-Management",
    "Task Analysis",
    "Video Modeling",
    "Natural Environment Teaching (NET)",
    "Picture Exchange Communication System (PECS)",
    "Prompting",
    "Reinforcement",
    "Chaining",
    "Differential Reinforcement",
    "Shaping",
    "Modeling",
    "Generalization Training",
    "Fading",
    "Task Variation",
    "Time Delay",
    "Incidental Teaching",
    "Pivotal Response Training",
    "Error Correction",
    "Self-Monitoring",
    "Cognitive Behavioral Therapy (CBT)",
    "Floortime Therapy",
    "Music Therapy",
    "Play Therapy",
    "Relationship Development Intervention (RDI)",
    "Social Skills Group",
  ];
  const planDurations = ["1-4 hours", "1-5 hours"];

  const openResponseInNewTab = (responseContent) => {
    const newWindow = window.open("", "_blank");
    newWindow.document.write(`<pre>${responseContent}</pre>`);
    newWindow.document.title = "Lesson Plan Response";
  };

  const createPlan = async () => {
    // Constructing the payload to include all necessary data
    const payload = {
      district_id: districtId,
      school_id: schoolId,
      grade_id: gradeId, // Make sure this captures the correct value for grade ID
      subject: subject,
      pedagogy: teachingStyle,
      plan_length: planDuration.includes("hours")
        ? planDuration.split(" ")[0]
        : planDuration, // Assuming planDuration is like "1-4 hours" and extracting just the number part
      experience_level: difficultyLevel, // Mapping this correctly to what your backend expects
      standard: stateAcademicStandard,
      difficulty_level: difficultyLevel, // Making sure this matches your database schema
      prompt: `As a seasoned expert in pedagogy, you are tasked to devise a comprehensive and engaging lesson plan for students in grade ${grade} studying ${subject} with a lesson titled "${lessonTitle}" based on a ${teachingStyle} pedagogical approach. The lesson plan should be suitable for a ${planDuration} period and compliant with the ${stateAcademicStandard} curriculum. The theme of the lesson is "${theme}" and is designed to have a difficulty level of "${difficultyLevel}". Please start by listing the relevant state academic standards, complete with their codes and descriptions, and then proceed with the lesson plan. As much as possible, try to factor in the ${teachingStyle} of the students. The first class will be on ${startDate}. Your output should be factual, impartial, thorough, and definitive.`,
      max_tokens: 1024, // Keeping this for consistency with your request configuration
    };

    try {
      const result = await axios.post(
        "http://localhost:5000/create-plan",
        payload
      );

      // Check if the backend returned the lesson plan content or a success message
      if (result.data && typeof result.data === "string") {
        // If the response is just a string (assuming lesson plan content or success message)
        openResponseInNewTab(result.data);
      } else if (result.data && result.data.message) {
        // If the response contains a 'message' key (assuming a success message)
        openResponseInNewTab(result.data.message);
      } else {
        // Handle any other unexpected response format
        console.error(
          "No response or unexpected format received from the server."
        );
      }
    } catch (error) {
      console.error("Error calling backend:", error);
    }
  };

  return (
    <div
      className="lesson-plan-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f0f0",
      }}
    >
      <div
        className="lesson-plan"
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "800px",
          width: "100%",
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
          Create Lesson Plan
        </h2>

        <div className="nav-buttons">
          <button onClick={() => setCurrentPage("cale")}>Calendar</button>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ flex: 1, marginRight: "20px" }}>
            {/* Form inputs for lesson plan details */}
            <label>
              Grade:
              <select value={grade} onChange={(e) => setGrade(e.target.value)}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Lesson Title:
              <input
                type="text"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                placeholder="Enter Lesson Title"
              />
            </label>
            <label>
              Subject:
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter Subject"
              />
            </label>
            <label>
              Teaching Style:
              <select
                value={teachingStyle}
                onChange={(e) => setTeachingStyle(e.target.value)}
              >
                {teachingStyles.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Plan Duration:
              <select
                value={planDuration}
                onChange={(e) => setPlanDuration(e.target.value)}
              >
                {planDurations.map((duration) => (
                  <option key={duration} value={duration}>
                    {duration}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Difficulty Level:
              <select
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value)}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </label>
          </div>
          <div style={{ flex: 1 }}>
            <label>
              State Academic Standard:
              <input
                type="text"
                value={stateAcademicStandard}
                onChange={(e) => setStateAcademicStandard(e.target.value)}
                placeholder="Enter State Academic Standard"
              />
            </label>
            <label>
              Theme:
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Enter Theme"
              />
            </label>
            <label>
              Start Date:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <label>
              District ID:
              <input
                type="text"
                value={districtId}
                onChange={(e) => setDistrictId(e.target.value)}
                placeholder="Enter District ID"
              />
            </label>
            <label>
              School ID:
              <input
                type="text"
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                placeholder="Enter School ID"
              />
            </label>
            <label>
              Grade ID:{" "}
              {/* If you are using 'grade' for something else, like grade name */}
              <input
                type="text"
                value={gradeId}
                onChange={(e) => setGradeId(e.target.value)}
                placeholder="Enter Grade ID"
              />
            </label>
          </div>
        </div>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button onClick={createPlan} className="accent-one">
            Generate
          </button>
          <div className="response" style={{ marginTop: "10px" }}>
            {response}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatGPT;