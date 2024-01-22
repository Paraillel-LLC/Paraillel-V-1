import React, { useState } from "react";
import axios from "axios";

const ChatGPT = () => {
  const [response, setResponse] = useState("");
  const [grade, setGrade] = useState("1");
  const [subject, setSubject] = useState("");
  const [teachingStyle, setTeachingStyle] = useState("Montessori Style");
  const [planLength, setPlanLength] = useState("1-4 hours");
  const [stateAcademicStandard, setStateAcademicStandard] = useState("");
  const [startDate, setStartDate] = useState("");

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

  const createPlan = async () => {
    const customPrompt = `As a seasoned expert in pedagogy, you are tasked to devise a comprehensive and engaging lesson plan for students in the ${grade} studying ${subject} based on a ${teachingStyle} pedagogical approach. The lesson plan should be suitable for a ${planLength} period and compliant with the ${stateAcademicStandard} curriculum. Please start by listing the relevant state academic standards, complete with their codes and descriptions, and then proceed with the lesson plan. As much as possible, try to factor in the ${teachingStyle} of the students. The first class will be on ${startDate}. Your output should be factual, impartial, thorough, and definitive.`;
    try {
      const result = await axios.post("http://localhost:5000/create-plan", {
        prompt: customPrompt,
      });
      console.log(customPrompt);
      if (result.data.choices && result.data.choices.length > 0) {
        setResponse(result.data.choices[0].text);
      } else {
        setResponse(
          "No response or unexpected format received from the server."
        );
      }
    } catch (error) {
      console.error("Error calling backend:", error);
      setResponse("Failed to generate plan. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      {/* Grade dropdown */}
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

      {/* Subject textbox */}
      <label>
        Subject:
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter Subject"
        />
      </label>

      {/* Teaching Style dropdown */}
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

      {/* Additional input fields */}
      <label>
        Plan Length:
        <input
          type="text"
          value={planLength}
          onChange={(e) => setPlanLength(e.target.value)}
          placeholder="Enter Plan Length"
        />
      </label>

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
        Start Date:
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>

      {/* Scrollable div for response */}
      <div
        className="response"
        style={{
          margin: "10px auto",
          maxHeight: "200px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
          width: "50%",
        }}
      >
        {response}
      </div>

      {/* Button to trigger plan creation */}
      <button onClick={createPlan}>Create Lesson Plan</button>
    </div>
  );
};

export default ChatGPT;
