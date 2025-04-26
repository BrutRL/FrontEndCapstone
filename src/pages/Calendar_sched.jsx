import React, { useEffect, useState } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card, CardContent, Typography } from '@mui/material';
import { index } from '../api/schedule';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';

const localizer = dayjsLocalizer(dayjs);

function Calendar_sched() {
  const [cookies] = useCookies(['AUTH_TOKEN']);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = cookies.AUTH_TOKEN;
        const response = await index(token);
  
        if (response.ok) {
          const allRequests = response.data;
          const formattedEvents = allRequests.flatMap(event => generateEvents(event));
          console.log("Formatted Events:", formattedEvents);
          setSchedules(formattedEvents);
        } else {
          toast.error(response.message ?? 'Failed to fetch schedules.');
        }
      } catch (error) {
        toast.error('Error fetching schedules.');
      }
    };
  
    fetchData();
  }, [cookies]);

  const generateEvents = (event) => {
    console.log(event);
  
    const events = [];
    const assignedDate = dayjs(event.assigned_date);
    const endDate = dayjs(event.end_date);
    const [startHour, startMinute] = event.start_time.split(':');
    const [endHour, endMinute] = event.end_time.split(':');
  
    const daysInWeek = Array.isArray(event.days_in_week)
      ? event.days_in_week
      : JSON.parse(event.days_in_week);
  
    for (let day = assignedDate; day.isBefore(endDate) || day.isSame(endDate); day = day.add(1, 'day')) {
      if (daysInWeek.includes(day.day())) {
        events.push({
          title: event.course?.code || 'No code',
          start: day.set('hour', startHour).set('minute', startMinute).toDate(),
          end: day.set('hour', endHour).set('minute', endMinute).toDate(),
          year: event.year,
          course: event.course,
          start_time: event.start_time,
          end_time: event.end_time,
          user: event.user,
        });
      }
    }
  
    return events;
  };


  const CustomEvent = ({ event }) => {
    const formatTime = (time) => time.replace(/:00$/, '');
  
    const name = event.user?.username || 'Unknown';
    return (
      <div style={{ color: 'black', borderRadius: '8px', padding: '8px', fontSize: '0.85rem', lineHeight: '1.4', background:"none" }}>
        <div>Year: {event.year || 'Unknown'}</div>
        <div>Subject: {event.course?.code || 'No Course'}</div>
        <div>Time: {`${formatTime(event.start_time)} to ${formatTime(event.end_time)}`}</div>
        <div>Professor: {name}</div>
      </div>
    );
  };

  return (
    <Card sx={{ p: 2, boxShadow: 3, borderRadius: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, color: '#374151', fontWeight: 'bold' }}>Calendar</Typography>
      <CardContent>
        <div style={{ height: 800 }}>
          <Calendar
            localizer={localizer}
            events={schedules}
            startAccessor="start"
            endAccessor="end"
            titleAccessor="title"
            components={{ event: CustomEvent }}
            style={{ height: '100%', borderRadius: '8px', overflow: 'hidden' }}/>
        </div>
      </CardContent>
    </Card>
  );
}
export default Calendar_sched;
