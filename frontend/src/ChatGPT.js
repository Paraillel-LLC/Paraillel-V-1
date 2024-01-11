import React, { useState } from "react";
import axios from "axios";

const ChatGPT = () => {
  const [response, setResponse] = useState("");
  const [grade, setGrade] = useState("1");
  const [pedagogicalApproach, setPedagogicalApproach] =
    useState("Montessori Style");
  const [subject, setSubject] = useState("");

  const pedagogicalApproaches = [
    "Montessori Style",
    "Project-Based Learning",
    "Mastery Learning",
    "Inquiry-Based Learning",
    "Direct Instruction",
    "Collaborative Learning",
    "Problem-Based Learning",
  ];

  const createPlan = async (type) => {
    const customPrompt = `Create ${type} for Grade ${grade} for ${subject} using ${pedagogicalApproach}`;
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

      {/* Pedagogy dropdown */}
      <label>
        Pedagogical Approach:
        <select
          value={pedagogicalApproach}
          onChange={(e) => setPedagogicalApproach(e.target.value)}
        >
          {pedagogicalApproaches.map((approach) => (
            <option key={approach} value={approach}>
              {approach}
            </option>
          ))}
        </select>
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

      {/* Buttons */}
      <button onClick={() => createPlan("Lesson Plan")}>
        Create Lesson Plan
      </button>
      <button onClick={() => createPlan("Study Guide")}>
        Create Study Guide
      </button>
    </div>
  );
};

export default ChatGPT;
