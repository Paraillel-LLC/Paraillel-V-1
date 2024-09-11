import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { createEventSchedule } from './App'; // Import the function

const Cale = ({ lessonTitle, startDate, endDate }) => {
//const Cale = ({ lessonTitle, startDate, endDate }) => {
  const [calendarView] = useState('dayGridMonth');

  const events = createEventSchedule(lessonTitle, startDate, endDate);

  return (
    <div style={{ paddingTop: 0 }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}></div>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px' }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
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
        />
      </div>
    </div>
  );
};

export default Cale;
