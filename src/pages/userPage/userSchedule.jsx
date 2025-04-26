import { index } from '../../api/schedule';
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { toast } from 'react-toastify';
import { useCookies } from 'react-cookie';
function UserSchedule() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); 
  const [cookies] = useCookies(['AUTH_TOKEN']);
  const [schedule, setSchedule] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const dayMapping = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const formatDays = (daysArray) => {
    if (!daysArray) return 'N/A';
    if (typeof daysArray === 'string') {
      daysArray = daysArray.replace(/\[|\]/g, '').split(',').map(Number);
    }
    if (!Array.isArray(daysArray) || daysArray.length === 0) return 'N/A';
    return daysArray.map((day) => dayMapping[day] || 'Invalid Day').join(', ');
  };
  useEffect(() => {
    const fetchUserRequests = async () => {
      const token = cookies.AUTH_TOKEN;
      try {
        const response = await index(token);
        if (response.ok) {
          const requests = response.data;
          const filteredRequests = requests.filter((request) => request.user_id === user.id);
          setSchedule(filteredRequests);
        } else {
          toast.error(response.message ?? 'Failed to fetch requests.');
        }
      } catch (error) {
        toast.error('Failed to fetch requests.');
      }
    };

    fetchUserRequests();
  }, [cookies, user.id]);

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#374151', letterSpacing: '0.5px' ,textAlign: 'left'}}>Schedule</Typography>
      </Box>
      {isSmallScreen ? (
        <Box>
          {schedule.map((request) => (
            <Box key={request.id} sx={{ border: '1px solid #ccc', borderRadius: 2, padding: 2, marginBottom: 2, boxShadow: 2, backgroundColor: '#ffffff',}}>
              <Typography><strong>Room :</strong> {request.room?.name}</Typography>
              <Typography><strong>Course Name:</strong> {request.course?.name}</Typography>
              <Typography><strong>Assigned Date:</strong> {request.assigned_date}</Typography>
              <Typography><strong>End Date:</strong> {request.end_date}</Typography>
              <Typography><strong>Day:</strong> {formatDays(request.days_in_week)}</Typography>
              <Typography><strong>Start Time:</strong>{new Date(`1970-01-01T${request.start_time}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })}</Typography>
              <Typography><strong>End Time:</strong>{new Date(`1970-01-01T${request.end_time}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })}</Typography>
            </Box>
          ))}
        </Box>
      ) : (
       
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, backgroundColor: '#ffffff' }}>
          <Table>
            <TableHead>
              <TableRow sx={{backgroundColor: '#f1f1f1' }}>
                <TableCell align='center' sx={{fontWeight: 'bold'}}>Room </TableCell>
                <TableCell align='center' sx={{fontWeight: 'bold'}}>Course Name</TableCell>
                <TableCell align='center' sx={{fontWeight: 'bold'}}>Assigned Date</TableCell>
                <TableCell align='center' sx={{fontWeight: 'bold'}}>End Date</TableCell>
                <TableCell align='center' sx={{fontWeight: 'bold'}}>Days </TableCell>
                <TableCell align='center' sx={{fontWeight: 'bold'}}>Start Time</TableCell>
                <TableCell align='center' sx={{fontWeight: 'bold'}}>End Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedule.map((request) => (
                <TableRow key={request.id}>
                  <TableCell align='center'>{request.room?.name}</TableCell>
                  <TableCell align='center'>{request.course?.name}</TableCell>
                  <TableCell align='center'>{request.assigned_date}</TableCell>
                  <TableCell align='center'>{request.end_date}</TableCell>
                  <TableCell align='center'>{formatDays(request.days_in_week)}</TableCell>
                  <TableCell align="center">{new Date(`1970-01-01T${request.start_time}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })}</TableCell>
                  <TableCell align="center">{new Date(`1970-01-01T${request.end_time}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default UserSchedule;
