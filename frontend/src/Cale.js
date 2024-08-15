import React, { useContext, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import {LessonPlanContext} from './LessonPlanContext';

const Cale = () => {
  const [calendarView, setCalendarView] = useState('dayGridMonth'); // 

  const { lessons } = useContext(LessonPlanContext);

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return year + '-' + mm + '-' + dd;
  };

  return (
    <div style={{ paddingTop: 0 }}> 
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
    </div>
    <div style={{ maxWidth: '800px', margin: '0 auto' , padding: "80px"}}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView={calendarView}
        headerToolbar={{
          left: 'prev,next',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        nowIndicator
        events={lessons}
        initialDate={getCurrentDate()}
        height="auto"
      />
    </div>
  </div>
  );
};

export default Cale;