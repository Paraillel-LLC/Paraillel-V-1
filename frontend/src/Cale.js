import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

const Cale = ({ lessonTitle, startDate }) => {
  const [calendarView] = useState('dayGridMonth');

  const events = [
    {
      title: lessonTitle,
      start: startDate,
      allDay: true,
    },
  ];

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
