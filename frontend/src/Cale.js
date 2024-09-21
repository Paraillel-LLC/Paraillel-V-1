import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

const Cale = ({ lessonTitle, startDate, planDuration }) => {
  const [calendarView] = useState('dayGridMonth');

  // Function to create an array of events based on the duration
  const createEventsForDuration = (title, startDate, duration) => {
    const events = [];
    const start = new Date(startDate);

    for (let i = 0; i < duration; i++) {
      // Calculate the date for each day in the duration
      const eventDate = new Date(start);
      eventDate.setDate(start.getDate() + i); // Add i days to the start date
      const formattedDate = eventDate.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD

      events.push({
        title: title,
        start: formattedDate,
        allDay: true,
      });
    }

    return events;
  };

  // Generate events for the duration of the plan
  const events = createEventsForDuration(lessonTitle, startDate, parseInt(planDuration));

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
