import React, { useState } from "react";
import axios from "axios";

const ChatGPT = ({ setCurrentPage, onGenerate }) => {
  const [response, setResponse] = useState("");
  const [grade, setGrade] = useState("1");
  const [lessonTitle, setLessonTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [teachingStyle, setTeachingStyle] = useState("Montessori Style");
  const [planDuration, setPlanDuration] = useState("1");
  const [planDurationUnit, setPlanDurationUnit] = useState("hour");
  const [stateAcademicStandard, setStateAcademicStandard] = useState("");
  const [startDate, setStartDate] = useState("");
  const [theme, setTheme] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("Easy");
  const [districtId, setDistrictId] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [gradeId, setGradeId] = useState("");

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

  const durationUnits = ["hour", "day", "week"];

  const openResponseInNewTab = (responseContent) => {
    const newWindow = window.open("", "_blank");
    newWindow.document.write(`<pre>${responseContent}</pre>`);
    newWindow.document.title = "Lesson Plan Response";
  };

  const createPlan = async () => {
    const duration = `${planDuration} ${planDurationUnit}${planDuration > 1 ? "s" : ""}`;
    const payload = {
      district_id: districtId,
      school_id: schoolId,
      grade_id: gradeId,
      subject: subject,
      pedagogy: teachingStyle,
      plan_length: duration,
      experience_level: difficultyLevel,
      standard: stateAcademicStandard,
      difficulty_level: difficultyLevel,
      prompt: `As a seasoned expert in pedagogy, you are tasked to devise a comprehensive and engaging lesson plan for students in grade ${grade} studying ${subject} with a lesson titled "${lessonTitle}" based on a ${teachingStyle} pedagogical approach. The lesson plan should be suitable for a ${duration} period and compliant with the ${stateAcademicStandard} curriculum. The theme of the lesson is "${theme}" and is designed to have a difficulty level of "${difficultyLevel}". Please start by listing the relevant state academic standards, complete with their codes and descriptions, and then proceed with the lesson plan. As much as possible, try to factor in the ${teachingStyle} of the students. The first class will be on ${startDate}. Your output should be factual, impartial, thorough, and definitive.`,
      max_tokens: 1024,
    };

    try {
      const result = await axios.post('http://localhost:5000/create-plan', payload);

      if (result.data && typeof result.data === 'string') {
        openResponseInNewTab(result.data);
      } else if (result.data && result.data.message) {
        openResponseInNewTab(result.data.message);
      } else {
        console.error('No response or unexpected format received from the server.');
      }
    } catch (error) {
      console.error('Error calling backend:', error);
    }
  };


  const handleGenerateClick = () => {
    const duration = `${planDuration} ${planDurationUnit}${planDuration > 1 ? "s" : ""}`;
    const eventTitle = `${lessonTitle} (${duration})`; // Include duration in the title
    onGenerate(eventTitle, startDate);
  };
  

  return (
    <div className="min-h-screen flex-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6">Create Lesson Plan</h2>
        <div className="space-y-4">
          <label className="form-label">
            Grade:
            <select 
              className="input mt-1"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>
          <label className="form-label">
            Lesson Title:
            <input
              type="text"
              className="input mt-1"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              placeholder="Enter Lesson Title"
            />
          </label>
          <label className="form-label">
            Subject:
            <input
              type="text"
              className="input mt-1"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter Subject"
            />
          </label>
          <label className="form-label">
            Teaching Style:
            <select 
              className="input mt-1"
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
          <label className="form-label">
            Plan Duration:
            <div className="flex">
              <input
                type="number"
                className="input mt-1 w-1/2"
                value={planDuration}
                onChange={(e) => setPlanDuration(e.target.value)}
                min="1"
                max={planDurationUnit === "hour" ? "23" : planDurationUnit === "day" ? "6" : "4"}
              />
              <select 
                className="input mt-1 w-1/2 ml-2"
                value={planDurationUnit}
                onChange={(e) => setPlanDurationUnit(e.target.value)}
              >
                {durationUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit.charAt(0).toUpperCase() + unit.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </label>
          <label className="form-label">
            Difficulty Level:
            <select 
              className="input mt-1"
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(e.target.value)}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </label>
          <label className="form-label">
            State Academic Standard:
            <input
              type="text"
              className="input mt-1"
              value={stateAcademicStandard}
              onChange={(e) => setStateAcademicStandard(e.target.value)}
              placeholder="Enter State Academic Standard"
            />
          </label>
          <label className="form-label">
            Theme:
            <input
              type="text"
              className="input mt-1"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Enter Theme"
            />
          </label>
          <label className="form-label">
            Start Date:
            <input
              type="date"
              className="input mt-1"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label className="form-label">
            Grade ID:
            <input
              type="text"
              className="input mt-1"
              value={gradeId}
              onChange={(e) => setGradeId(e.target.value)}
              placeholder="Enter Grade ID"
            />
          </label>
          <div className="space-y-4">
            <button 
              onClick={createPlan}
              className="button w-full"
            >
              Generate Lesson Plan
            </button>
            <button 
              onClick={handleGenerateClick}
              className="button-secondary w-full"
            >
              Add to Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatGPT;
