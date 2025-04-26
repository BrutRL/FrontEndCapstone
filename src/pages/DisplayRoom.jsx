import { Box, Button, Typography, Dialog,Grid, DialogTitle, DialogContent, DialogActions, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, MenuItem, Select ,Input,InputAdornment,IconButton} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { index } from '../api/room'
import { image } from '../api/configuration'
import { useCookies } from 'react-cookie'
import { toast } from 'react-toastify'
import checkAuth from '../hoc/checkAuth'
import { useSelector } from 'react-redux'
import { index as userIndex } from '../api/user'
import { store as RequestRoomstore } from '../api/otp_request'
import {index as Schedule_index } from '../api/schedule';
import noroom_found from '../assets/images/NoroomFound.png';
import { useMediaQuery } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import {update as RoomUpdate} from '../api/room';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

function Card({ room, onAccessRoom,onViewSchedules   }) {
  const user = useSelector(state => state.auth.user)
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  //const isOccupied = RoomStatus.some(req => req.room_id === room.id);
  return (
    <Paper sx={{width: isSmallScreen ? '100%' : '300px',textAlign: 'center',boxShadow: '10px 5px 20px rgba(0, 0, 0.1, 0.1)',mt: isSmallScreen ? 2 : 5, mx: isSmallScreen ? 'auto' : 0, transition: 'transform 0.3s, box-shadow 0.3s','&:hover': {transform: 'scale(1.05)',boxShadow: '10px 10px 30px rgba(0, 0, 0.1, 0.2)',}}}>
      <Box sx={{ width: '240px', height: '120px', mt: 2, background: room.extension ? `url('${image}/${room.id}.${room.extension}')` : "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvFGq7TEwR0Rd5WGLrO0bJ9BpYEJPeYIZtxmkWGL4b4A&s')", backgroundSize: 'cover', backgroundPosition: 'center', mx: 'auto' }} />
      <Box sx={{ p:2, pl: 4, textAlign: 'left' }}>
        <Typography sx={{ color: '#4a5568' }}> Room Name: {room.name}</Typography>
        <Typography sx={{ color: '#4a5568' }}> Location: {room.location}</Typography>
        <Typography sx={{ color: '#4a5568' }}> Capacity: {room.capacity}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1,gap: 1}}>
        <Button onClick={() => onAccessRoom(room)} sx={{ width: '150px', whiteSpace: 'nowrap', background: room.status === 'Available'  ? '#1632A2'  : room.status === 'Occupied'  ? '#C89357'  : '#D0B65B',color: 'white',}} disabled={room.status === 'Pending' || room.status === 'Occupied'}>{room.status === 'Available' ? 'Occupy' : room.status}</Button>
          <Button sx={{ display: 'flex',backgroundColor: '#1632A2',whiteSpace: 'nowrap',width: '230px',flexWrap:'nowrap',color: 'white','&:hover': { backgroundColor: '#0d1e6b' },}}   onClick={() => onViewSchedules(room)}>View Schedules</Button>
       </Box>
      </Box>
    </Paper>
  )
}

function DisplayRoom() {
  const [rooms, setRooms] = useState([])
  const [accessRoomDialog, setAccessRoomDialog] = useState(null)
  const [cookies, setCookie, removeCookie] = useCookies(['AUTH_TOKEN'])
  const [searchTerm, setSearchTerm] = useState('')
  const [userIndexData, setUserIndexData] = useState(null)
  const [assignType, setAssignType] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [usedAt, setUsedAt] = useState('')
  const [endTime, setEndTime] = useState('')
  const [Purpose,setPurpose] = useState('');
  const [assignedDate, setAssignedDate] = useState('')
  const [selectedRoom, setSelectedRoom] = useState(null);
  const dayMapping = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [sched_open,setSched_open] = useState(false);
  const [Sched_data, setSched_data] = useState([]);
  const [error,setErrors] = useState([]);
  const [message,setMessage] = useState({});
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    index().then(res => {
      if (res?.ok) {
        setRooms(res.data)
      }
    })
  }, [])

  useEffect(() => {
    const fetchUserData = async () => {
      const token = cookies.AUTH_TOKEN

      try {
        const response = await userIndex(token)
        if (response.ok) {
          setUserIndexData(response.data)
        } else {
          toast.error(response.message ?? 'Failed to fetch users.')
        }
      } catch (error) {
        toast.error('Failed to fetch users.')
      }
    }

    fetchUserData()
  }, [cookies])

  const handleAssignClick = (user) => {
    setSelectedUser(user)
  }

  const handleRequestTypeChange = (type) => {
    setAssignType(type)
  }

  const generateOtpCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString().padStart(6, '0'); 
  }
  const handleOtpAssign = async () => {
    if (selectedUser && accessRoomDialog && usedAt && endTime && assignedDate && Purpose) {
      try {
        const otpCode = generateOtpCode();
        const data = {
          user_id: selectedUser.id,
          room_id: accessRoomDialog.id,
          //Access_code: otpCode,
          //access_status: 2,
          generated_at: assignedDate,
          used_at: usedAt,
          end_time: endTime,
          purpose: Purpose,
        };
  
        const response = await RequestRoomstore(data, cookies.AUTH_TOKEN);
  
        if (response.ok) {
          toast.success('Request successful!');
          setErrors({}); 
          navigate('/admin/access_code', { replace: true });
          
          const roomUpdateBody = { status: 3 };
            const roomUpdateResponse = await RoomUpdate(roomUpdateBody, accessRoomDialog.id, cookies.AUTH_TOKEN);
    
            if (roomUpdateResponse.ok) {
              console.log('Room Status Updated to Assigned');
           
  
            } else {
              console.error('Failed to update room status:', roomUpdateResponse);
              toast.error(roomUpdateResponse?.message || 'Failed to update room status.');
            }
           
        } else {
         
          if (response.errors || response.data?.errors) {
            setErrors(response.errors || response.data.errors);
          } else {
            toast.error(response.message || 'Failed to assign request.');
            setMessage(response.message);
          }
        }
      } catch (error) {
        console.error('Failed to assign request', error);
        setErrors(error?.response?.data?.errors || {});
        toast.error('Failed to assign request.');
      }
    } else {
      toast.error('Please fill in all fields.');
    }
  };
  
  
  const handleRoomAssign = async () => {
    if (selectedUser && accessRoomDialog && usedAt && endTime && assignedDate && Purpose) {
      try {
        // Data for the room request
        const data = {
          user_id: selectedUser.id,
          room_id: accessRoomDialog.id, 
          //access_status: 1,
          generated_at: assignedDate,
          used_at: usedAt,
          end_time: endTime,
          purpose: Purpose,
        }
        const response = await RequestRoomstore(data, cookies.AUTH_TOKEN);
  
        if (response.ok) {
          toast.success('Request successful!');
          setErrors({}); 
          navigate('/admin/room_request', { replace: true });
          
         const roomUpdateBody = { status: 2 };
          const roomUpdateResponse = await RoomUpdate(roomUpdateBody, accessRoomDialog.id, cookies.AUTH_TOKEN);
  
         if (roomUpdateResponse.ok) {
            console.log('Room Status Updated to Assigned');
         

          } else {
            console.error('Failed to update room status:', roomUpdateResponse);
            toast.error(roomUpdateResponse?.message || 'Failed to update room status.');
          }
        } else {
          if (response.errors || response.data?.errors) {
            setErrors(response.errors || response.data.errors);
          } else {
            toast.error(response.message || 'Failed to assign request.');
          }
        }
      } catch (error) {
        setErrors(error?.response?.data?.errors || {});
        toast.error('Failed to assign request.');
      }
    } else {
      toast.error('Please fill in all fields.');
    }
  };
  
  useEffect(() => {
    const fetch_Sched = async () => {
        const token = cookies.AUTH_TOKEN;
        try {
            const response = await Schedule_index(token);
            if (response.ok) {
                setSched_data(response.data);
            } else {
                toast.error(response.message ?? 'Failed to fetch Schedule Data.');
            }
        } catch (error) {
            toast.error('Failed to fetch Schedule Data.');
        }
    };

    fetch_Sched();
}, [cookies]);


  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.location.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const formatDays = (daysArray) => {
    if (!daysArray) return 'N/A';
    if (typeof daysArray === 'string') {
      daysArray = daysArray.replace(/\[|\]/g, '').split(',').map(Number);
    }
    if (!Array.isArray(daysArray) || daysArray.length === 0) return 'N/A';
    return daysArray.map((day) => dayMapping[day] || 'Invalid Day').join(', ');
  };
  /*useEffect(() => {
    const fetchOtpRequests = async () => {
      const token = cookies.AUTH_TOKEN;
      try {
        const response = await AccessCode_index(token); 
        if (response.ok) {
          setRoomStatus(response.data);
        } else {
          toast.error(response.message ?? 'Failed to fetch OTP requests.');
        }
      } catch (error) {
        console.error('Failed to fetch OTP requests', error);
        toast.error('Failed to fetch OTP requests.');
      }
    };
  
    fetchOtpRequests();
  }, [cookies]);*/
  const Sched_roomClose = () => {
    setSelectedRoom(null); 
    setSched_open(false); 
  };
  
  const Sched_roomOpen = (room) => {
    setSelectedRoom(room); 
    setSched_open(true); 
  };
  const handleClearSearch = () => setSearchTerm('');
  return (
    <Box x sx={{ textAlign: isSmallScreen ? "center" : "left", mb: isSmallScreen ? 1 : 2 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#374151', letterSpacing: '0.5px' }}> Display Room</Typography>
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          } endAdornment={
            searchTerm && (
              <InputAdornment position="end">
                <IconButton onClick={handleClearSearch}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }
          sx={{ width: '100%', marginBottom: 2 }}
        />
      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 4, flexWrap: 'wrap' }}>
        {
          filteredRooms.length > 0 ? filteredRooms.map(room => (
            <Card room={room} key={room.id} onAccessRoom={setAccessRoomDialog}  onViewSchedules={Sched_roomOpen} />
          )) : (
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", minHeight: "200px",}}>
            <Box><img src={noroom_found} alt="No rooms found" style={{ width: "100%", height: "auto" }} /></Box>
            <Typography variant="h6" sx={{ color: "#374151", mt: 2 }}>There's no room exist </Typography>
          </Box>
          )
        }
      </Box>
      {accessRoomDialog && (
        <Dialog open={!!accessRoomDialog} onClose={() => setAccessRoomDialog(null)} fullWidth>
          {!selectedUser && <DialogTitle>User Data</DialogTitle>}
          <DialogContent>
            {!selectedUser && (
              <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
              <Table size={ isSmallScreen? "small" : "medium"}>
                <TableHead>
                  <TableRow>
                    <TableCell align='center'>Name</TableCell>
                    <TableCell align='center'>Email</TableCell>
                    <TableCell align='center'>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userIndexData && userIndexData.map(user => (
                    <TableRow key={user.id}>
                      <TableCell align='center'>{user.username}</TableCell>
                      <TableCell align='center'>{user.email}</TableCell>
                      <TableCell align='center'>
                        <Button variant="outlined" sx={{ background: '#02318A', color: 'white'}}onClick={() => handleAssignClick(user)}>Select</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box display="flex" justifyContent="left" mt={2}>
                <Button onClick={() => setAccessRoomDialog(null)} sx={{ boxShadow: 1, textTransform: 'none', fontWeight: 'bold', background: '#D9D9D9', color: 'black', width: '100px',}}>Close</Button>
              </Box>
            </TableContainer>
                )}
            {selectedUser && (
             <Box mt={2} sx={{ p: 3,borderRadius: 2, boxShadow: 1}}>
             <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1f2937',}}>Assign Room to User</Typography>
             <Grid container spacing={2}>
               <Grid item xs={12} sm={6}>
                 <Select value={assignType} onChange={(e) => handleRequestTypeChange(e.target.value)} displayEmpty fullWidth sx={{ backgroundColor: '#ffffff',borderRadius: 1,}}>
                   <MenuItem value="" disabled><em>Select request type</em> </MenuItem>
                   {accessRoomDialog?.name == 'R404' ? (
                       <MenuItem value="access_code">Access Code Request</MenuItem>
                   ) : (
                     <MenuItem value="room">Room Request</MenuItem>
                   )}
                 </Select>
               </Grid>
               <Grid item xs={12} sm={6}>
                 <TextField fullWidth label="Assigned Date" type="date" value={assignedDate} onChange={(e) => setAssignedDate(e.target.value)} InputLabelProps={{shrink: true, sx: { color: '#374151' },}}sx={{ '& .MuiOutlinedInput-root': {backgroundColor: '#ffffff',borderRadius: 1,},'& .MuiInputBase-input': {color: '#374151',}, }} error={!!error?.generated_at}helperText={error?.generated_at?.[0]}/></Grid>
               <Grid item xs={12} sm={6}>
                 <TextField fullWidth label="Used At" type="time" value={usedAt} onChange={(e) => setUsedAt(e.target.value)} InputLabelProps={{ shrink: true, sx: { color: '#374151' },}}sx={{'& .MuiOutlinedInput-root': {backgroundColor: '#ffffff',borderRadius: 1,},'& .MuiInputBase-input': {color: '#374151',},}} error={!!error?.used_at}helperText={error?.used_at?.[0]}/></Grid>
    
               <Grid item xs={12} sm={6}>
                 <TextField fullWidth label="End Time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} InputLabelProps={{ shrink: true, sx: { color: '#374151' },}}sx={{'& .MuiOutlinedInput-root': { backgroundColor: '#ffffff', borderRadius: 1,},'& .MuiInputBase-input': {color: '#374151',},}} error={!!error?.end_time}helperText={error?.end_time?.[0]}/>
               </Grid>

               <Grid item xs={12}>
                 <TextField fullWidth label="Purpose" type="text" value={Purpose} onChange={(e) => setPurpose(e.target.value)} InputLabelProps={{shrink: true,sx: { color: '#374151' },}}sx={{'& .MuiOutlinedInput-root': { backgroundColor: '#ffffff', borderRadius: 1,},'& .MuiInputBase-input': {color: '#374151', }, }} error={!!error?.purpose}helperText={error?.purpose?.[0]}/></Grid>
          
               <Grid item xs={12} display="flex" justifyContent="flex-start" gap={2}>
                 <Button sx={{ boxShadow: 1, textTransform: 'none', fontWeight: 'bold', background: '#D9D9D9', color: 'black', }}onClick={() => { setSelectedUser(null); setAssignType(''); setUsedAt(''); setEndTime(''); setAssignedDate(''); setPurpose('');setErrors({});}}> Cancel </Button>
                 <Button variant="contained" sx={{ boxShadow: 3, textTransform: 'none', fontWeight: 'bold', background: '#02318A',}} onClick={() => {
                     if (assignType === 'access_code') {
                       handleOtpAssign();
                     } else if (assignType === 'room') {
                       handleRoomAssign();
                     }
                   }}>Assign</Button>
               </Grid>
             </Grid>
           </Box>
            )}
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={sched_open} onClose={Sched_roomClose} fullWidth maxWidth="xl" sx={{'& .MuiDialog-paper': {width: '90%', maxHeight: '80vh', },}}>
           <DialogTitle sx={{ textAlign: 'center' }}>Room Schedule</DialogTitle>
                <DialogContent>
                  {selectedRoom && (() => {
                    const filteredSchedules = Sched_data.filter(
                      schedule => schedule.room_id === selectedRoom.id
                    );
                        return filteredSchedules.length > 0 ? (
                          <>
                            {isSmallScreen ? (
                              <Box>
                                {filteredSchedules.map((schedule, index) => (
                                  <Box key={index} sx={{ p: 2, mb: 2, border: '1px solid #ccc', borderRadius: '8px', backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff' }}>
                                    <Typography><b>Day:</b> {formatDays(schedule.days_in_week)}</Typography>
                                    <Typography><b>Time:</b> {new Date(`1970-01-01T${schedule.start_time}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })} - {new Date(`1970-01-01T${schedule.end_time}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })}</Typography>
                                    <Typography><b>Room:</b> {schedule.room?.name}</Typography>
                                    <Typography><b>Course Code:</b> {schedule.course?.code}</Typography>
                                    <Typography><b>Descriptive Title:</b> {schedule.course?.name}</Typography>
                                    <Typography><b>Units:</b> {schedule.course?.credit_unit}</Typography>
                                    <Typography><b>Professor:</b> {schedule.user?.username}</Typography>
                                    <Typography><b>Year:</b> {schedule.year}</Typography>
                                  </Box>
                                ))}
                              </Box>
                            ) : (
                              <Table sx={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
                                <TableHead>
                                  <TableRow sx={{ backgroundColor: '#1632A2' }}>
                                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center' }}>Day</TableCell>
                                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center' }}>Time</TableCell>
                                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center' }}>Room</TableCell>
                                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center' }}>Course Code</TableCell>
                                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center' }}>Descriptive Title</TableCell>
                                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center' }}>Units</TableCell>
                                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center' }}>Professor</TableCell>
                                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center' }}>Year</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {filteredSchedules.map((schedule, index) => (
                                    <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff', '&:hover': { backgroundColor: '#f1f1f1', cursor: 'pointer' } }}>
                                      <TableCell sx={{ textAlign: 'center' }}>{formatDays(schedule.days_in_week)}</TableCell>
                                      <TableCell sx={{ textAlign: 'center' }}>{new Date(`1970-01-01T${schedule.start_time}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })} - {new Date(`1970-01-01T${schedule.end_time}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })}</TableCell>
                                      <TableCell align="center">{schedule.room?.name}</TableCell>
                                      <TableCell align="center">{schedule.course?.code}</TableCell>
                                      <TableCell align="center">{schedule.course?.name}</TableCell>
                                      <TableCell align="center">{schedule.course?.credit_unit}</TableCell>
                                      <TableCell align="center">{schedule.user?.username}</TableCell>
                                      <TableCell align="center">{schedule.year}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            )}
                          </>
                        ) : (
                          <Typography>No schedules found</Typography>
                        );
                      })()}
                    </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'left', pb: 2, ml: 2 }}>
              <Button onClick={Sched_roomClose} className="no-print" sx={{ backgroundColor: '#D9D9D9', color: 'black', fontWeight: 'bold' }}>Close</Button>
              <Button onClick={() => window.print()}  sx={{ backgroundColor: '#02318A', color: 'white', fontWeight: 'bold' }}>Print</Button>
            </DialogActions>
      </Dialog>

    </Box>
  );
}
export default checkAuth(DisplayRoom);
