import React, { useState } from "react";
import axios from "axios";

const ChatGPT = () => {
  const [response, setResponse] = useState("");
  const [grade, setGrade] = useState("1");
  const [lessonTitle, setLessonTitle] = useState(""); // Added for lesson title
  const [subject, setSubject] = useState(""); // Added for subject
  const [teachingStyle, setTeachingStyle] = useState("Montessori Style");
  const [planDuration, setPlanDuration] = useState("1-4 hours"); // Renamed from planLength to planDuration
  const [stateAcademicStandard, setStateAcademicStandard] = useState("");
  const [startDate, setStartDate] = useState("");
  const [theme, setTheme] = useState(""); // Added for theme
  const [experienceLevel, setExperienceLevel] = useState(""); // Added for experience level

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

  const openResponseInNewTab = (responseContent) => {
    const newWindow = window.open("", "_blank");
    newWindow.document.write(`<pre>${responseContent}</pre>`);
    newWindow.document.title = "Lesson Plan Response";
  };

  const createPlan = async () => {
    const customPrompt = `As a seasoned expert in pedagogy, you are tasked to devise a comprehensive and engaging lesson plan for students in the ${grade} studying ${subject} with a lesson titled "${lessonTitle}" based on a ${teachingStyle} pedagogical approach. The lesson plan should be suitable for a ${planDuration} period and compliant with the ${stateAcademicStandard} curriculum. The theme of the lesson is "${theme}" and is designed for students with ${experienceLevel} experience level. Please start by listing the relevant state academic standards, complete with their codes and descriptions, and then proceed with the lesson plan. As much as possible, try to factor in the ${teachingStyle} of the students. The first class will be on ${startDate}. Your output should be factual, impartial, thorough, and definitive.`;
    try {
      const result = await axios.post("http://localhost:5000/create-plan", {
        prompt: customPrompt,
        max_tokens: 1024, // Increase max_tokens as needed
      });

      if (result.data.choices && result.data.choices.length > 0) {
        const responseContent = result.data.choices[0].text;
        const newWindow = window.open("", "_blank");
        newWindow.document.write(`<pre>${responseContent}</pre>`);
        newWindow.document.title = "Lesson Plan Response";
      } else {
        console.error(
          "No response or unexpected format received from the server."
        );
      }
    } catch (error) {
      console.error("Error calling backend:", error);
    }
  };

  return (
    <div className="lesson-plan">
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

      {/* Lesson Title textbox */}
      <label>
        Lesson Title:
        <input
          type="text"
          value={lessonTitle}
          onChange={(e) => setLessonTitle(e.target.value)}
          placeholder="Enter Lesson Title"
        />
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

      {/* Plan Duration radio buttons */}
      <label>
        Plan Duration:
        <label>
          <input
            type="radio"
            name="planDuration"
            value="1-4 hours"
            checked={planDuration === "1-4 hours"}
            onChange={(e) => setPlanDuration(e.target.value)}
          />
          1-4 hours
        </label>
        <label>
          <input
            type="radio"
            name="planDuration"
            value="1-5 hours"
            checked={planDuration === "1-5 hours"}
            onChange={(e) => setPlanDuration(e.target.value)}
          />
          1-5 hours
        </label>
      </label>

      {/* State Academic Standard textbox */}
      <label>
        State Academic Standard:
        <input
          type="text"
          value={stateAcademicStandard}
          onChange={(e) => setStateAcademicStandard(e.target.value)}
          placeholder="Enter State Academic Standard"
        />
      </label>

      {/* Start Date input */}
      <label>
        Start Date:
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>

      {/* Theme textbox */}
      <label>
        Theme:
        <input
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="Enter Theme"
        />
      </label>

      {/* Experience Level textbox */}
      <label>
        Experience Level:
        <input
          type="text"
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
          placeholder="Enter Experience Level"
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

      <div className="accent-one">
        {/* Button to trigger plan creation */}
        <button onClick={createPlan}>Generate</button>
      </div>
    </div>
  );
};

export default ChatGPT;
