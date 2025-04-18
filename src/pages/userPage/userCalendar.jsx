import React, { useEffect, useState } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card, CardContent, Typography } from '@mui/material';
import { index } from '../../api/schedule';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';

const localizer = dayjsLocalizer(dayjs);

function User_schedule() {
  const [cookies] = useCookies(['AUTH_TOKEN']);
  const [userSchedule, setUserSchedule] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      const token = cookies.AUTH_TOKEN;
      try {
        const response = await index(token);
        if (response.ok) {
          const requests = response.data;
          // Filter data with the same user id as the current user
          const filteredRequests = requests.filter((request) => request.user_id === user?.id && request.status == 1);
          const formattedEvents = filteredRequests.flatMap(event => generateEvents(event));
          setUserSchedule(formattedEvents);
        } else {
          toast.error(response.message ?? 'Failed to fetch schedules.');
        }
      } catch (error) {
        toast.error('Failed to fetch schedules.');
      }
    };
  
    if (user?.id) {
      fetchData();
    }
  }, [cookies, user.id]);
  

  const generateEvents = (event) => {
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
        });
      }
    }

    return events; 
  };

  const CustomEvent = ({ event }) => {
    const formatTime = (time) => time.replace(/:00$/, '');
    return (
      <div style={{ color: 'black', borderRadius: '8px', padding: '8px', fontSize: '0.85rem', lineHeight: '1.4',}} >
        <div>Year: {event.year || 'Unknown'}</div>
        <div> Subject: {event.course?.code || 'No Course'}</div>
        <div>Time: {`${formatTime(event.start_time)} to ${formatTime(event.end_time)}`}</div>
      </div>
    );
  };
  return (
    <Card sx={{ p: 2, boxShadow: 3, borderRadius: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, color: '#374151', fontWeight: 'bold' }}>Calendar</Typography>
      <CardContent>
        <div style={{ height: 800 }}>
          <Calendar localizer={localizer} events={userSchedule} startAccessor="start" endAccessor="end" titleAccessor="title" components={{ event: CustomEvent,}}style={{ height: '100%', borderRadius: '8px', overflow: 'hidden' }} />
        </div>
      </CardContent>
    </Card>
  );
}   
 export default User_schedule;