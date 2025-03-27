import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

// remember to run this script for below code : "npm install @fullcalendar/interaction" //Mohsen Code
import interactionPlugin from '@fullcalendar/interaction';
import { createEventSchedule } from './App'; // Import the function

const Cale = ({ lessonTitle, startDate, endDate }) => {
//const Cale = ({ lessonTitle, startDate, endDate }) => {
  const [calendarView, setCalendarView] = useState('dayGridMonth');
  const [events, setEvents] = useState([]);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const [classname, setclassname] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");


 // Function to fetch lesson plans from the backend API
  const fetchLessonPlans = async (classname) => {
    const username = localStorage.getItem('username');
    const class_name = classname;
    try {
      const response = await fetch('http://localhost:5000/Get_LessonPlan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, class_name: class_name }),
      });

      const data = await response.json();
    
      if (data.successful) {
        const lessonPlans = data.lesson_plans.map((plan) => {
          
          const enddate = calculateEndDate(plan.startdate, plan.duration, plan.length);
         
          return {
            lesson_id: plan.lesson_id,  // Reference the correct fields from `plan`
            title: plan.title,
            start: plan.startdate,           // Use the calculated start date
            end: enddate,               // Use the calculated end date
            backgroundColor: '#ff9f89',  // Unique color for each lesson
            borderColor: '#ff9f89',
            textColor: '#000000',       // Set text color to black for all events
            allDay: true,  
                      
            extendedProps: {
              grade: plan.grade,
              subject: plan.subject,
              style: plan.style,
              difficulty: plan.difficulty_level,
              standard: plan.standard,
              theme: plan.theme,
              eventType: 'lesson',
            },
          };
          
        });

        return lessonPlans;
      } else {
        console.error('No lesson plans found');
        return [];
      }
    } catch (error) {
      console.error('Error fetching lesson plans:', error);
    }
  };


  // Function to fetch Assignments from the backend API
  const fetchAssignments = async (classname) => {
    const username = localStorage.getItem('username');
    const class_name = classname;
    try {
      const response = await fetch('http://localhost:5000/Get_Assignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, class_name: class_name }),
      });

      const data = await response.json();
    
      if (data.successful) {
        const assignments = data.assignments.map((plan) => {
          
          return {
            assignment_id: plan.assignment_id,  // Reference the correct fields from `plan`
            title: plan.title,
            start: formatDate(new Date(plan.Duedate)),           
            end: formatDate(new Date(plan.Duedate)),     
            
            backgroundColor: '#89cff0',  // Unique color for each lesson
            borderColor: '#89cff0',
            textColor: '#000000',       // Set text color to black for all events
            allDay: true,               // Full-day event

            extendedProps: {
              Subject: plan.Subject,
              Type_of_assign: plan.Type_of_assign,
              numbers: plan.numbers,
              standards: plan.standards,
              user_id: plan.user_id,
              eventType: 'assignment',
            },
          };
          
        });

        return assignments;
      } else {
        console.error('No assignments found');
        return [];
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchQuizes = async (classname) => {
    const username = localStorage.getItem('username');
    const class_name = classname;
    try {
      const response = await fetch('http://localhost:5000/Get_Quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, class_name: class_name }),
      });

      const data = await response.json();
    
      if (data.successful) {
        const Quizes = data.quizs.map((plan) => {
          
          return {
            quiz_id: plan.quiz_id,  // Reference the correct fields from `plan`
            title: plan.title,
            start: formatDate(new Date(plan.due_date)),           
            end: formatDate(new Date(plan.due_date)),     
            
            backgroundColor: '#77dd77',  // Unique color for each lesson
            borderColor: '#77dd77',
            textColor: '#000000',       // Set text color to black for all events
            allDay: true,               // Full-day event

            extendedProps: {
              Subject: plan.subject,
              topic: plan.topic,
              question_type: plan.question_type, 
              num_questions: plan.num_questions,
              user_id: plan.user_id,
              eventType: 'quiz',
            },
          };
          
        });

        return Quizes;
      } else {
        console.error('No quiz found');
        return [];
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
  };

  function formatDate(date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Add 1 because months are 0-indexed
    const day = String(date.getUTCDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

  // Assign a color based on lesson_id (you can modify this function to use a more advanced coloring logic if needed)
  const getColorByLessonId = (lessonId) => {
    const colors = ['#ff9f89', '#89cff0', '#77dd77', '#ffb347', '#ff6961']; // Add more colors if necessary
    return colors[lessonId % colors.length]; // Cycle through the colors array based on lesson_id
  };
  
  const calculateEndDate = (startDate, planDurationUnit, planDuration) => {
    const start = new Date(startDate);
    let end = new Date(startDate);

    if (planDurationUnit === "hour") {
      end.setHours(start.getHours() + parseInt(planDuration));
    } else if (planDurationUnit === "day") {
      end.setDate(start.getDate() + parseInt(planDuration));
    } else if (planDurationUnit === "week") {
      end.setDate(start.getDate() + parseInt(planDuration) * 7);
    }

    return end.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
  };

  //const events1 = createEventSchedule(lessonTitle, startDate, endDate);
  useEffect(() => {

    fetch("http://localhost:5000/Get_ClassName/"+ localStorage.getItem('username'))  // Backend API URL
    .then(response => response.json())
    .then(data => setclassname(data.options))
    .catch(error => console.error("Error fetching data:", error));
    
    //const loadEvents = async () => {
    //  const events1 = await fetchAssignments();
    //  const events2 = await fetchLessonPlans();
  
    
    //  setEvents([...events1, ...events2]);
    //};
  
    //loadEvents();
  }, []);
  
  const handleEventMouseEnter = (info) => {

    var content = '';
    
    if(info.event.extendedProps.eventType == 'assignment')
      content = buildassignmentinfo(info);
    else
    if(info.event.extendedProps.eventType == 'quiz')
      content = buildquizinfo(info);
    else
      content = buildlessoninfo(info);
    
    setTooltipContent(content);  // Customize content if needed
    setTooltipPosition({ x: info.jsEvent.pageX, y: info.jsEvent.pageY });
    setTooltipVisible(true);
  };

  function buildlessoninfo(info)
  {
    const { grade, subject, style, difficulty, standard, theme} = info.event.extendedProps;

    const content = `
      <strong>Grade: </strong> ${grade} <br>
      <strong>Lesson Title: </strong> ${info.event.title} <br>
      <strong>Subject: </strong> ${subject} <br>
      <strong>Style: </strong> ${style} <br>
      <strong>Difficulty Level: </strong> ${difficulty} <br>
      <strong>Standard: </strong> ${standard} <br> 
      <strong>Theme: </strong> ${theme}
    `;
    return content;
  }

  function buildassignmentinfo(info)
  {
    const { Subject, topic, Type_of_assign, numbers, standard, user_id } = info.event.extendedProps;
    const content = `
      <strong>Title: </strong> ${info.event.title} <br>
      <strong>Due Date: </strong> ${formatDate(info.event.start)} <br>
      <strong>Subject: </strong> ${Subject} <br>
      <strong>Type of Assignment: </strong> ${Type_of_assign} <br>
      <strong>Number of questions: </strong> ${numbers} <br>
      <strong>Academic State Standard: </strong> ${standard} 
    `;
    return content;
  }

  function buildquizinfo(info)
  {
    const { topic, subject, Type_of_quiz, numbers, user_id } = info.event.extendedProps;

    const content = `
      <strong>Title: </strong> ${info.event.title} <br>
      <strong>Due Date: </strong> ${formatDate(info.event.start)} <br>
      <strong>Subject: </strong> ${subject} <br>
      <strong>Type of Assignment: </strong> ${Type_of_quiz} <br>
      <strong>Number of questions: </strong> ${numbers}  
    `;
    return content;
  }

  const handleEventMouseLeave = () => {
    setTooltipVisible(false);
  };

  // Handle day cell click to switch to "day" view
  const handleDateClick = (info) => {
    setCalendarView('timeGridDay');
    info.view.calendar.changeView('timeGridDay', info.date); // Switch to timeGridDay view

    console.log("clicked");
  };

  const handleClassChange = async (event) => {
    setSelectedClass(event.target.value);
    const events1 = await fetchAssignments(event.target.value);
    const events2 = await fetchLessonPlans(event.target.value);
    const events3 = await fetchQuizes(event.target.value);
  
      // Combine events1 and events2 arrays and set the result to state
    setEvents([...events1, ...events2, ...events3]);

  };

  return (
    <div style={{ paddingTop: 0 }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}></div>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px' }}>
          <label className="form-label">
            Class Name: 
            <select id="classcombo" style={styles.selectBox} className="input mt-1" value={selectedClass} onChange={handleClassChange}>
              {classname.map((option, index) => (
                  <option key={index} value={option}>
                  {option}
              </option>
              ))}
            </select>
          </label>
          
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={calendarView}
          headerToolbar={{
            left: 'prev,next',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          nowIndicator
          initialDate={new Date()}
          events={events}
          height="auto"
          dateClick={handleDateClick}
          eventMouseEnter={handleEventMouseEnter}
          eventMouseLeave={handleEventMouseLeave}
          editable={true}
        />
         {/* Legend */}
        <div style={{ flex: 1, paddingLeft: "20px" }}>
        <h3>Legend</h3>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
            <span style={{ width: "20px", height: "20px", backgroundColor: "#ff9f89", marginRight: "10px", display: "inline-block" }}></span>
            <span> Lesson Plan</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
            <span style={{ width: "20px", height: "20px", backgroundColor: "#89cff0", marginRight: "10px", display: "inline-block" }}></span>
            <span> Assignment</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
            <span style={{ width: "20px", height: "20px", backgroundColor: "#77dd77", marginRight: "10px", display: "inline-block" }}></span>
            <span> Quiz</span>
          </div>
        </div>
        
        {tooltipVisible && (
          <div
            className="tooltip"
            style={{
              position: 'absolute',
              top: tooltipPosition.y + 10,
              left: tooltipPosition.x + 10,
              backgroundColor: 'rgba(255, 255, 255, 1)',
              color: 'black',
              padding: '5px 10px',
              borderRadius: '5px',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
              pointerEvents: 'none',
              zIndex: 1000,
            }}
            dangerouslySetInnerHTML={{ __html: tooltipContent }} // Render HTML content
          />
        )}
      </div>
    </div>
  );
};

const styles = {
  selectBox: {
    padding: '10px',
    margin: '10px 0',
    fontSize: '14px',
    width: '100%',
    maxWidth: '300px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
};

export default Cale;
