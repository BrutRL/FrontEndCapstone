import * as React from 'react';
import { Box, Typography, Grid, Paper, Button,Table, TableBody, TableCell, TableContainer, TableHead, TableRow,useMediaQuery} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { useCookies } from 'react-cookie';
import { useState, useEffect } from 'react';
import { index as fetchCourses } from '../api/course';
import { index as Roomcount } from '../api/room';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserData, logout } from '../redux/authSlice';
import { destroy, update, store } from '../api/user'; // Import the destroy, update, and store functions
import { toast } from 'react-toastify';
import {index  as ScheduleCount} from '../api/schedule';
import {index as room_status} from '../api/otp_request';
const Item = ({ children, bgColor, gradient }) => (
  <Paper sx={{ padding: { xs: 2, md: 4 },  textAlign: 'center', color: '#000',
background: gradient ? `linear-gradient(to right, ${gradient[0]}, ${gradient[1]})` : bgColor, borderRadius: 2, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',}}
  >
    {children}
  </Paper>
);


export default function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [totalUsers, setTotalUsers] = useState(0); 
  const [cookies, setCookie, removeCookie] = useCookies(['AUTH_TOKEN']); 
  const [coursesCount, setCoursesCount] = useState([]);
  const [roomCount, setRoomCount] = useState(0);
  const [roomRequestcount,setroomRequestcount] = useState([]);
  const [otpRequestcount,setotpRequestcount] = useState([]);
  const [scheduleCount,setscheduleCount] = useState([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
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
          } else {
            console.error('No data found in response.');
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
          const userRequestsOtp = requests.filter(request => request.otp_code !== null && request.otp_status === "pending");
          
          setotpRequestcount(userRequestsOtp.length);
        } else {
          toast.error(response.message ?? 'Failed to fetch requests.');
        }
      } catch (error) {
        console.error('Failed to fetch requests', error);
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
          const userRequests = requests.filter(request => request.otp_status === "pending" && request.otp_code === null);
          
          setroomRequestcount(userRequests.length);
        } else {
          toast.error(response.message ?? 'Failed to fetch requests.');
        }
      } catch (error) {
        console.error('Failed to fetch requests', error);
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
        console.error('Failed to fetch requests', error);
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
        console.error('Failed to fetch courses', error);
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
        console.error('Failed to fetch courses', error);
        toast.error('Failed to fetch courses.');
      }
    };

    fetch_room();
  }, [cookies]);


  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit },
    }));
  };

  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  const handleSaveClick = (id) => () => {
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.View },
    }));
  };

 
  const handleCancelClick = (id) => () => {
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }));

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows((oldRows) => oldRows.filter((row) => row.id !== id));
    }
  };
  const processRowUpdate = async (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    const token = cookies.AUTH_TOKEN; // Get the token from cookies
    try {
      if (newRow.isNew) {
        const body = {
          username: newRow.username,
          email: newRow.email,
          role_id: newRow.role_id,
          created_at: newRow.created_at,
        };
        console.log('Adding new user with data:', body); // Add this line for debugging
        const res = await store(body, token);
        if (res?.ok) {
          setTotalUsers((prevTotal) => prevTotal + 1); // Increment total number of users
          toast.success(res?.message ?? 'User added successfully.');
        } else {
          toast.error(res?.message ?? 'Something went wrong');
          setWarnings(res?.error);
        }
      } else {
        const body = {
          username: newRow.username,
          email: newRow.email,
          role_id: newRow.role_id,
          created_at: newRow.created_at,
        };
       
        const res = await update(body, newRow.id, token); 
        if (res?.ok) {
          toast.success(res?.message ?? 'User updated successfully.');
        } else {
          toast.error(res?.message ?? 'Something went wrong');
        }
      }
      setRows((oldRows) => oldRows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    } catch (error) {
      
      toast.error('Failed to update user.');
    }
    return updatedRow;
  };
  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  
  return (
    <Box sx={{ padding: { xs: 2, md: 4 } }}> 
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontSize: { xs: '1.50rem', md: '2rem' }, textAlign: { xs: 'center', md: 'left' } }}
      >
        Welcome Back, {username ?? 'User'}! 👋
      </Typography>


      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Item gradient={['#4a90e2', '#74b9ff']}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
            >
              Rooms
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontSize: { xs: '1.5rem', md: '3rem' } }}
            >
              {roomCount.length}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}
            >
              Total
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Item gradient={['#56ccf2', '#2f80ed']}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
            >
              Courses
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontSize: { xs: '1.5rem', md: '3rem' } }}
            >
                {coursesCount.length}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}
            >
              Total
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Item gradient={['#ff6f61', '#ff9a8b']}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
            >
              Users
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontSize: { xs: '1.5rem', md: '3rem' } }}
            >
              {totalUsers}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}
            >
              Total Users
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Item gradient={['#feca57', '#ffcc00']}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
            >
              Schedules
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontSize: { xs: '1.5rem', md: '3rem' } }}
            >
             {scheduleCount}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}
            >
              Total Classes Today
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item gradient={['#9b59b6', '#8e44ad']}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}
            >
              Room Requests
            </Typography>
            <Box
              display="flex"
              justifyContent="space-around"
              flexDirection={{ xs: 'column', md: 'row' }}
              alignItems="center"
              marginTop={2}
            >
              <Box textAlign="center" marginBottom={{ xs: 2, md: 0 }}>
                <Typography
                  variant="h4"
                  sx={{ fontSize: { xs: '1.5rem', md: '3rem' } }}
                >
                  {roomRequestcount}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}
                >
                  Room Request
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h4"
                  sx={{ fontSize: { xs: '1.5rem', md: '3rem' } }}
                >
                  {otpRequestcount}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}
                >
                  Pin Request
                </Typography>
              </Box>
            </Box>
          </Item>
        </Grid>
      </Grid>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'black', letterSpacing: '0.5px',mt:4,fontSize: isSmallScreen ? '1.4rem' : '1.8rem' }}>Recently Account Added</Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 3, overflowX: 'auto' }}>
      <Table sx={{ minWidth: isSmallScreen ? 300 : 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', fontSize: isSmallScreen ? '0.8rem' : '1rem' }}>Username</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', fontSize: isSmallScreen ? '0.8rem' : '1rem' }}>Email</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', fontSize: isSmallScreen ? '0.8rem' : '1rem' }}>Role Id</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', fontSize: isSmallScreen ? '0.8rem' : '1rem' }}>Created At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows && rows.length > 0 ? (
            rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { backgroundColor: '#f1f1f1' },
                  '& > td:first-of-type': { marginTop: '8px', marginBottom: '8px' },
                }}
              >
                <TableCell component="th" align="center" scope="row" sx={{ fontSize: isSmallScreen ? '0.75rem' : '1rem' }}>{row.username}</TableCell>
                <TableCell align="center" sx={{ fontSize: isSmallScreen ? '0.75rem' : '1rem' }}>{row.email}</TableCell>
                <TableCell align="center" sx={{ fontSize: isSmallScreen ? '0.75rem' : '1rem' }}>{row.role_id}</TableCell>
                <TableCell align="center" sx={{ fontSize: isSmallScreen ? '0.75rem' : '1rem' }}>{new Date(row.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ fontSize: isSmallScreen ? '0.75rem' : '1rem' }}>
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
  );
}