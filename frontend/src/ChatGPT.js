import React, { useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Default styling

const ChatGPT = () => {
  const [response, setResponse] = useState("");
  const [prompt, setPrompt] = useState("");
  const [analytics, setAnalytics] = useState("");
  const [date, setDate] = useState(new Date());

  const createStudyPlan = async () => {
    try {
      const result = await axios.post("http://localhost:5000/create-plan", {
        prompt,
      });
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

  const fetchAnalytics = async () => {
    try {
      const result = await axios.get("http://localhost:5000/analytics");
      setAnalytics(`Study plans created: ${result.data.study_plan_count}`);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setAnalytics("Failed to fetch analytics.");
    }
  };

  // Function to handle date change in the calendar
  const onDateChange = (newDate) => {
    setDate(newDate);
    // Additional actions can be performed here when the date changes
  };

  return (
    <div>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter study topic"
      />
      <button onClick={createStudyPlan}>Create Study Plan</button>
      <div className="response">{response}</div>
      <button onClick={fetchAnalytics}>Fetch Analytics</button>
      <div className="analytics">{analytics}</div>
      <Calendar onChange={onDateChange} value={date} />
    </div>
  );
};

export default ChatGPT;
