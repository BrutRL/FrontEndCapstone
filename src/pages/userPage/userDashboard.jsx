import * as React from 'react';
import { Box, Typography, Grid, Paper, Button,TableContainer,Table,TableHead,TableRow,TableCell,TableBody,useMediaQuery  } from '@mui/material';
import { useCookies } from 'react-cookie';
import { useState, useEffect } from 'react';
import { index as Roomcount } from '../../api/room';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserData, logout } from '../../redux/authSlice';
import { toast } from 'react-toastify';
import { index } from '../../api/otp_request';
import {index as Schedulecount} from '../../api/schedule';
import { useTheme } from '@mui/material/styles';

const Item = ({ children, bgColor, gradient }) => (
  <Paper sx={{ padding: { xs: 2, md: 4 },  textAlign: 'center', color: '#000', background: gradient ? `linear-gradient(to right, ${gradient[0]}, ${gradient[1]})` : bgColor, borderRadius: 2, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', }}>{children}</Paper>
);

export default function UserDashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); 
  const [cookies, setCookie, removeCookie] = useCookies(['AUTH_TOKEN']); 
  const [roomCount, setRoomCount] = useState(0);
  const [roomRequestscount, setRoomRequestscount] = useState(0);
  const [pinrequestscount, setPinRequestscount] = useState(0);
  const [username, setUsername] = useState('');
  const [scheduleData, setScheduleData] = useState([]);
  const userSched = JSON.parse(localStorage.getItem('user'));
  const [scheduleCount,setscheduleCount] = useState([]);
  const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'));
  const dayMapping = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  useEffect(() => {
    const token = cookies.AUTH_TOKEN;
    if (!token) {
      dispatch(logout());
    } else {
      dispatch(fetchUserData());
    }
  }, [dispatch, cookies]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user)); 
      setUsername(user.username);
    } else {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        dispatch({ type: 'auth/setUser', payload: parsedUser }); 
        setUsername(parsedUser.username);
      }
    }
  }, [user, dispatch]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const token = cookies.AUTH_TOKEN;
        const roomData = await Roomcount(token);
        setRoomCount(roomData.data);
      } catch (error) {
        toast.error('Failed to fetch courses.');
      }
    };

    fetchRoom();
  }, [cookies]);

  useEffect(() => {
    const fetchUserRequests = async () => {
      const token = cookies.AUTH_TOKEN;
      const storedUser = JSON.parse(localStorage.getItem('user'));
        const response = await index(token);
        if (response.ok) {
          const requests = response.data;
          const userRequests = requests.filter(
            (request) => request.user_id === storedUser.id && request.Access_code != null && request.otp_status == 2
          );
          setPinRequestscount(userRequests.length);  
        } 
    };
  
    fetchUserRequests();
  }, [cookies]);
  

  useEffect(() => {
    const fetchUserrequestOtp = async () => {
      const token = cookies.AUTH_TOKEN;
      const storedUser = JSON.parse(localStorage.getItem('user'));
 
        const response = await index(token);
        if (response.ok) {
          const requests = response.data;
          const userRequests = requests.filter(
            (request) => request.user_id === storedUser.id && request.Access_code == null && request.otp_status == 2
          );
          setRoomRequestscount(userRequests.length); 
        } 
      } 
    fetchUserrequestOtp();
  }, [cookies]);
  
  

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  useEffect(() => {
    const fetchSchedule = async () => {
      const token = cookies.AUTH_TOKEN;
        const response = await Schedulecount(token);
        if (response.ok) {
          const requests = response.data;
          const filteredRequests = requests.filter(
            (request) => request.user_id === userSched.id 
          );
          setScheduleData(filteredRequests);
          setscheduleCount(filteredRequests.length);
        }
      } 
    if (userSched) {
      fetchSchedule();
    }
  }, [cookies, userSched]);

  const formatDays = (daysArray) => {
    if (!daysArray) return 'N/A';
    if (typeof daysArray === 'string') {
      daysArray = daysArray.replace(/\[|\]/g, '').split(',').map(Number);
    }
    if (!Array.isArray(daysArray) || daysArray.length === 0) return 'N/A';
    return daysArray.map((day) => dayMapping[day] || 'Invalid Day').join(', ');
  };
  
  return (
    <Box sx={{ padding: { xs: 2, md: 4 } }}> 
      <Typography variant="h5" gutterBottom sx={{ fontSize: { xs: '1.50rem', md: '2rem' }, textAlign: { xs: 'center', md: 'left' } }}> Welcome Back, {username ?? 'User'}! 👋</Typography>
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        <Grid item xs={12} md={4}>
          <Item gradient={['#4a90e2', '#74b9ff']}>
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}> Rooms</Typography>
            <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '3rem' } }}>{roomCount.length}</Typography>
            <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}>Total</Typography>
          </Item>
        </Grid>

        <Grid item xs={12} md={4}>
            <Item gradient={['#feca57', '#ffcc00']}>
              <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }} >Schedules</Typography>
              <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '3rem' } }}>{scheduleCount} </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}>Total Classes Today</Typography>
            </Item>
        </Grid>

        <Grid item xs={12} md={4}>
          <Item gradient={['#9b59b6', '#8e44ad']}>
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>Room Requests</Typography>
            <Box display="flex" justifyContent="space-around" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" marginTop={0}>
                <Box textAlign="center" marginBottom={{ xs: 2, md: 0 }}>
                    <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '3rem' } }}>{roomRequestscount}</Typography>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}> Room Request</Typography>
                </Box>
              <Box textAlign="center">
                <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '3rem' } }}>{pinrequestscount}</Typography>
                <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}>Access Code Request</Typography>
              </Box>
            </Box>
          </Item>
        </Grid>
      </Grid>
      <Box sx={{ mt: 5 }}>
          <Typography  variant="h4"  gutterBottom  sx={{  color: "black",  letterSpacing: "0.5px",  textAlign: { xs: "center", sm: "left" }, fontSize: { xs: "1.8rem", md: "2rem" }}}>Schedule
</Typography>
      </Box>

      {scheduleData.length > 0 ? (
        isMobile ? (
          <Box>
            {scheduleData.map((schedule, index) => (
              <Paper key={index} sx={{ padding: 2, mb: 2, boxShadow: 3 }}>
                <Typography><b>Room Name:</b> {schedule.room?.name}</Typography>
                <Typography><b>Days:</b>{formatDays(schedule.days_in_week)}</Typography>
                <Typography><b>Course Name:</b> {schedule.course?.name}</Typography>
                <Typography><b>Assigned Date:</b> {new Date(schedule.assigned_date).toLocaleDateString()}</Typography>
                <Typography><b>End Date:</b> {new Date(schedule.end_date).toLocaleDateString()}</Typography>
                <Typography><strong>Start Time:</strong> {new Date(`1970-01-01T${schedule.start_time}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })}</Typography>
                 <Typography><strong>End Time:</strong> {new Date(`1970-01-01T${schedule.end_time}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })}</Typography>

              </Paper>
            ))}
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {['Room Name', 'Days', 'Course Name', 'Assigned Date','End Date', 'Start Time', 'End Time',].map((header, index) => (
                    <TableCell key={index} align="center" sx={{ fontWeight: 'bold' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {scheduleData.map((schedule, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{schedule.room?.name}</TableCell>
                    <TableCell align='center'>{formatDays(schedule.days_in_week)}</TableCell>
                    <TableCell align="center">{schedule.course?.name}</TableCell>
                    <TableCell align="center">{new Date(schedule.assigned_date).toLocaleDateString()}</TableCell>
                    <TableCell align="center">{new Date(schedule.end_date).toLocaleDateString()}</TableCell>
                    <TableCell align="center">{new Date(`1970-01-01T${schedule.start_time}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })}</TableCell>
                    <TableCell align="center">{new Date(`1970-01-01T${schedule.end_time}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      ) : (
        <Typography textAlign="center">No schedules exist.</Typography>
      )}
    </Box>
  );
}
