import * as React from 'react';
import { Box, Typography, Grid,Modal, Paper, Button,Table, TableBody, TableCell, TableContainer, TableHead, TableRow,useMediaQuery} from '@mui/material';
import { useCookies } from 'react-cookie';
import { useState, useEffect } from 'react';
import { index as fetchCourses } from '../api/course';
import { index as Roomcount } from '../api/room';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserData, logout } from '../redux/authSlice';
import { toast } from 'react-toastify';
import {index  as ScheduleCount} from '../api/schedule';
import {index as room_status} from '../api/otp_request';
const Item = ({ children, bgColor, gradient }) => (
  <Paper sx={{ padding: { xs: 2, md: 4 },  textAlign: 'center', color: '#000',background: gradient ? `linear-gradient(to right, ${gradient[0]}, ${gradient[1]})` : bgColor, borderRadius: 2, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',}}>{children}</Paper>
);


export default function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [rows, setRows] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0); 
  const [cookies, setCookie, removeCookie] = useCookies(['AUTH_TOKEN']); 
  const [coursesCount, setCoursesCount] = useState([]);
  const [roomCount, setRoomCount] = useState(0);
  const [roomRequestcount,setroomRequestcount] = useState([]);
  const [otpRequestcount,setotpRequestcount] = useState([]);
  const [scheduleCount,setscheduleCount] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);



  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const displayedRows = isSmallScreen ? rows.slice(0, 3) : rows;
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
    const fetchAllUsers = async () => {
      const token = cookies.AUTH_TOKEN; 
      if (token) {
        try {
          const response = await axios.get('http://localhost:8000/api/users', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (response.data && response.data.data) {
            setRows(response.data.data); // Update rows with the response data
            setTotalUsers(response.data.data.length); // Set total number of users
          }
        } catch (error) {
          console.error('Failed to fetch users data', error);
        }
      }
    };
  
    fetchAllUsers();
  }, [cookies]);
  

  useEffect(() => {
    const fetchUserrequestOtp = async () => {
      const token = cookies.AUTH_TOKEN;
      try {
        const response = await room_status(token);
        if (response.ok) {
          const requests = response.data;
          const userRequestsOtp = requests.filter(request => request.Access_code !== null && request.access_status == 2);
          
          setotpRequestcount(userRequestsOtp.length);
        } else {
          toast.error(response.message ?? 'Failed to fetch requests.');
        }
      } catch (error) {
        toast.error('Failed to fetch requests.');
      }
    };
  
    fetchUserrequestOtp();
  }, [cookies]);

  useEffect(() => {
    const fetchUserroomreq = async () => {
      const token = cookies.AUTH_TOKEN;
      try {
        const response = await room_status(token);
        if (response.ok) {
          const requests = response.data;
          const userRequests = requests.filter(request => request.access_status == 2 && request.Access_code == null);
          
          setroomRequestcount(userRequests.length);
        } else {
          toast.error(response.message ?? 'Failed to fetch requests.');
        }
      } catch (error) {
        toast.error('Failed to fetch requests.');
      }
    };
  
    fetchUserroomreq();
  }, [cookies]);
  
  
  useEffect(() => {
    const fetchSchedulecount = async () => {
      const token = cookies.AUTH_TOKEN;
      try {
        const response = await ScheduleCount(token);
        if (response.ok) {
          const requests = response.data;
          setscheduleCount(requests.length);
        } else {
          toast.error(response.message ?? 'Failed to fetch requests.');
        }
      } catch (error) {
        toast.error('Failed to fetch requests.');
      }
    };
  
    fetchSchedulecount();
  }, [cookies]);
  
  
  useEffect(() => {
    const fetchData = async () => {
      const token = cookies.AUTH_TOKEN;
      if (!token) {
        return; 
      }
      try {
        const token = cookies.AUTH_TOKEN;
        const coursesData = await fetchCourses(token);
        setCoursesCount(coursesData.data);
      } catch (error) {
        toast.error('Failed to fetch courses.');
      }
    };

    fetchData();
  }, [cookies]);
  
  useEffect(() => {
    const fetch_room = async () => {
      try {
        const token = cookies.AUTH_TOKEN;
        const roomData = await Roomcount(token);
        setRoomCount(roomData.data);
      } catch (error) {
        toast.error('Failed to fetch courses.');
      }
    };

    fetch_room();
  }, [cookies]);

  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

 
 

  return (
    <Box sx={{ padding: { xs: 2, md: 4 } }}> 
        <Typography variant="h5" gutterBottom sx={{ fontSize: { xs: '1.30rem', md: '2rem' }, textAlign: { xs: 'center', md: 'left' } }}>  Welcome Back, {username ?? 'User'}! 👋 </Typography>

      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Item gradient={['#4a90e2', '#74b9ff']}>
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}> Rooms</Typography>
            <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '3rem' } }}>{roomCount.length}</Typography>
            <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}>Total</Typography>
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Item gradient={['#56ccf2', '#2f80ed']}>
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>Courses</Typography>
            <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '3rem' } }}>{coursesCount.length}</Typography>
            <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}> Total</Typography>
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Item gradient={['#ff6f61', '#ff9a8b']}>
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>Users</Typography>
            <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '3rem' } }}>{totalUsers}</Typography>
            <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}>Total Users</Typography>
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Item gradient={['#feca57', '#ffcc00']}>
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }} >Schedules</Typography>
            <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '3rem' } }} >{scheduleCount}</Typography>
            <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }} >Total Classes Today</Typography>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item gradient={['#9b59b6', '#8e44ad']}>
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }} >Room Requests</Typography>
            <Box display="flex" justifyContent="space-around" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" marginTop={2}>
              <Box textAlign="center" marginBottom={{ xs: 2, md: 0 }}>
                <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '3rem' } }}>{roomRequestcount}</Typography>
                <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}>Room Request</Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '3rem' } }}>{otpRequestcount}</Typography>
                <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}>Pin Request</Typography>
              </Box>
            </Box>
          </Item>
        </Grid>
      </Grid>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'black', letterSpacing: '0.5px', mt: 4, fontSize: isSmallScreen ? '1.3rem' : '1.8rem',}}> Recently Account Added </Typography>
         {isSmallScreen ? (
            <Box sx={{ width: '100%', p: 2 }}>
              {displayedRows && displayedRows.length > 0 ? (
                <>
                  {displayedRows.map((row) => (
                    <Paper key={row.id} sx={{ mb: 2, p: 2, boxShadow: 3 }}>
                      <Typography variant="subtitle2"> <strong>Username:</strong> {row.username}</Typography>
                      <Typography variant="subtitle2"> <strong>Email:</strong> {row.email}</Typography>
                      <Typography variant="subtitle2"> <strong>Role ID:</strong> {row.role_id}</Typography>
                      <Typography variant="subtitle2"> <strong>Created At:</strong> {new Date(row.created_at).toLocaleDateString()}</Typography>
                    </Paper>
                  ))}
                  {rows.length > 3 && (
                    <Button fullWidth sx={{backgroundColor:'rgb(2, 49, 138)',color:'white'}} onClick={handleOpen}>See More Accounts</Button>
                  )}
                </>
              ) : (
                <Typography>No users found</Typography>
              )}

              <Modal open={open} onClose={handleClose}>
                <Box  sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '95%', maxHeight: '90vh', overflowY: 'auto', bgcolor: 'background.paper', boxShadow: 24, p: 3, borderRadius: 2, }}>
                  <Typography variant="h6" mb={2} fontWeight="bold">All Accounts</Typography>
                  <Grid container spacing={2}>
                    {rows.map((row) => (
                      <Grid item xs={12} sm={6} key={row.id}>
                        <Paper sx={{ p: 2, boxShadow: 2 }}>
                          <Typography variant="subtitle2"><strong>Username:</strong> {row.username}</Typography>
                          <Typography variant="subtitle2"><strong>Email:</strong> {row.email}</Typography>
                          <Typography variant="subtitle2"><strong>Role ID:</strong> {row.role_id}</Typography>
                          <Typography variant="subtitle2"><strong>Created At:</strong>{' '}{new Date(row.created_at).toLocaleDateString()}</Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                  <Button onClick={handleClose}  sx={{ backgroundColor: 'rgb(217, 217, 217)',color: 'black',fontWeight: 'bold',mt:2}}> Close </Button>
                </Box>
              </Modal>
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ boxShadow: 3, overflowX: 'auto', width: '100%' }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Username</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Email</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Role Id</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Created At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows && rows.length > 0 ? (
                    rows.map((row) => (
                      <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: '#f1f1f1' },}}>
                        <TableCell align="center">{row.username}</TableCell>
                        <TableCell align="center">{row.email}</TableCell>
                        <TableCell align="center">{row.role_id}</TableCell>
                        <TableCell align="center">{new Date(row.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">No users found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
      )}
    </Box>
  );
}