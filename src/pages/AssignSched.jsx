import React, { useEffect, useState } from "react";
import { store } from "../api/schedule"; 
import { index as Room_index } from "../api/room";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { index as User_index } from "../api/user";
import { index as Course_index } from "../api/course";
import {index as Schedule_index} from '../api/schedule';
import { Container, Typography,Box,Button, Card, IconButton,Dialog, Input,InputAdornment,DialogTitle,useMediaQuery, useTheme, CardContent,Select, MenuItem, InputLabel, FormControl, Checkbox, FormGroup, FormControlLabel, Grid, TextField,Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, DialogActions} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import '../App.css';

function Assign_sched() {
  const [cookies] = useCookies(["AUTH_TOKEN"]);
  const [roomData, setRoomData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [scheduleData,setScheduleData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [open,setOpen] = useState(false);
  const [openView,setopenView] = useState(false);
  const year_course = ["BSIT - 1D", "BSIT - 2D","BSIT - 3D", "BSIT - 4D", "BIT - 1E","BIT - 2E", "BIT - 3E","BIT  - 4E","BEED - 1C","BEED -2C","BEED - 3C","BEED - 4C","BSED Eng - 1B","BSED Eng - 2B","BSED Eng - 3B","BSED Eng - 4B","BTLED - 1A","BTLED - 2A","BTLED - 3A","BTLED - 4A"]
  const [selectedYear, setSelectedYear] = useState("All");
  const [formValues, setFormValues] = useState({ room_id: "", user_id: "", course_id: "", assigned_date: "", end_date: "", days_in_week: [], start_time: "", end_time: "", status: 2, year: "",});
  const dayMapping = { Monday: 0, Tuesday: 1, Wednesday: 2, Thursday: 3, Friday: 4, Saturday: 5, Sunday: 6,};
  const daySched = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState(year_course);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [errorMessage, setErrorMessage] = useState("");

  
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Handle day selection checkboxes
  const handleDaysChange = (e) => {
    const { value, checked } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      days_in_week: checked
        ? [...prevValues.days_in_week, value]
        : prevValues.days_in_week.filter((day) => day !== value),
    }));
  };

  // Fetch data for Room, User, and Course dropdowns
  useEffect(() => {
    const fetchRoomData = async () => {
      const token = cookies.AUTH_TOKEN;
      try {
        const response = await Room_index(token);
        if (response.ok) {
          setRoomData(response.data);
        } else {
          toast.error(response.message ?? "Failed to fetch rooms.");
        }
      } catch (error) {
        toast.error("Failed to fetch rooms.");
      }
    };

    const fetchUserData = async () => {
      const token = cookies.AUTH_TOKEN;
      try {
        const response = await User_index(token);
        if (response.ok) {
          setUserData(response.data);
        } else {
          toast.error(response.message ?? "Failed to fetch users.");
        }
      } catch (error) {
        toast.error("Failed to fetch users.");
      }
    };

    const fetchCourseData = async () => {
      const token = cookies.AUTH_TOKEN;
      try {
        const response = await Course_index(token);
        if (response.ok) {
          setCourseData(response.data);
        } else {
          toast.error(response.message ?? "Failed to fetch courses.");
        }
      } catch (error) {
        toast.error("Failed to fetch courses.");
      }
    };

    fetchRoomData();
    fetchUserData();
    fetchCourseData();
  }, [cookies]);
 

  
  const handleSave = async (e) => {
    e.preventDefault();
    const token = cookies.AUTH_TOKEN;
  
    // Convert days_in_week to numbers
    const transformedFormValues = {
      ...formValues,
      days_in_week: formValues.days_in_week.map((day) => dayMapping[day]),
    };
  
    try {
      const response = await store(transformedFormValues, token);
  
      // Ensure we parse the response properly
      const responseData = await response.json();
      if (response.ok) {
        toast.success('Schedule saved successfully');
        setFormValues({
          room_id: "", user_id: "", course_id: "", assigned_date: "", end_date: "", days_in_week: [], start_time: "", end_time: "", status: "", year: ""
        });
        setErrors({});
        setErrorMessage(""); 
      } else {
        // Check if the response contains validation errors
        if (responseData?.errors) {
          setErrors(responseData.errors); // Update the errors state with backend validation errors
         // toast.error("Please fix the highlighted errors.");
        } const message = responseData.message ?? "Failed to create schedule.";
        setErrorMessage(message); // Store error message in state
      }
    } catch (error) {
      if (error.response && error.response.data?.errors) {
        setErrors(error.response.data.errors); 
        toast.error("Validation failed. Please fix the form.");
      } else {
        toast.error("Something went wrong while saving.");
      }
    }
  };
  

 const Openset_Sched = (year) => {
  setFormValues((prevValues) => ({
    ...prevValues,
    year: year, 
    room_id: "",
    user_id: "",
    course_id: "",
    assigned_date: "",
    end_date: "",
    days_in_week: [],
    start_time: "",
    end_time: "",
    status: 1,
  }));
  setOpen(true);
 }
 const Closeset_Sched = () =>{
   setOpen(false);
   setErrors({});
   setErrorMessage("");
 }

 const Viewsched_Open = async (selectedYear) => {
  const token = cookies.AUTH_TOKEN;
  try {
    const response = await Schedule_index(token);
    if (response.ok) {
      const filteredData = response.data.filter((item) => item.year === selectedYear);
      setScheduleData(filteredData);
      setSelectedYear(selectedYear)
      setopenView(true);
    } else {
      toast.error(response.message ?? "Failed to fetch schedule.");
    }
  } catch (error) {
    console.error("Failed to fetch schedule", error);
    toast.error("Failed to fetch schedule.");
  }
};


 const Viewsched_Close = () =>{
  setopenView(false);
  setScheduleData([]);
}

  const formatDays = (daysArray) => {
    if (!daysArray) return 'N/A';
    if (typeof daysArray === 'string') {
      daysArray = daysArray.replace(/\[|\]/g, '').split(',').map(Number);
    }
    if (!Array.isArray(daysArray) || daysArray.length === 0) return 'N/A';
    return daysArray.map((day) => daySched[day] || 'Invalid Day').join(', ');
  };


const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = year_course.filter((course) => course.toLowerCase().includes(value));
    setFilteredCourses(filtered);
  };

 const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(year);

    if (year === "All") {
      setFilteredCourses(year_course);
    } else {
      const filtered = year_course.filter((course) => {
        // Extract the year level from the course name
        const yearLevel = course.match(/(\d+)/)?.[0];  // Get the number part (e.g., 3 from "BSIT -3D")
        return yearLevel === year;
      });
      setFilteredCourses(filtered);
    }
  };    
  const handleClearSearch = () => {
    setSearchTerm('');
    setFilteredCourses(year_course)
  }
  return (
    <Box sx={{ width: '100vw', maxWidth: '100%', mt: 3, px: isSmallScreen ? 2 : 5 }}>
             <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#374151', letterSpacing: '0.5px' }}>Create Schedule</Typography>
             <Paper sx={{ padding: 2, marginBottom: 2 }}>
                <Input placeholder="Search..." value={searchTerm} onChange={handleSearchChange}startAdornment={
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
              <FormControl sx={{ mb: 2, mt: 3, display: 'flex', width: '150px', justifySelf: 'end'}}>
                <InputLabel>Filter by Year</InputLabel>
                <Select value={selectedYear} onChange={handleYearChange} label="Filter by Year">
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="1">Year 1</MenuItem>
                  <MenuItem value="2">Year 2</MenuItem>
                  <MenuItem value="3">Year 3</MenuItem>
                  <MenuItem value="4">Year 4</MenuItem>
                </Select>
              </FormControl>
              <Grid container spacing={3} justifyContent="flex-start">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((year, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Card  sx={{backgroundColor: '#f0f4ff', transition: 'transform 0.3s, box-shadow 0.3s','&:hover': { transform: 'scale(1.05)', boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.2)', },}}>
                      <CardContent>
                        <Typography align="center">Year: {year}</Typography>
                        <Box sx={{  display: 'flex',  flexDirection: isSmallScreen ? 'column' : 'row',  justifyContent: 'center',  gap: 1,  mt: 2 }}>
                          <Button sx={{  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",  background: 'linear-gradient(to right, #3b82f6, #1e40af)',  boxShadow: '0px 4px 12px rgba(59, 130, 246, 0.3)',color: "white", whiteSpace: 'nowrap', fontWeight: 'bold',"&:hover": {   background: 'linear-gradient(to right, #2563eb, #1d4ed8)', }, }} onClick={() => Viewsched_Open(year)}>View Schedule </Button>
                          
                          <Button sx={{boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",  background: 'linear-gradient(to right, #22c55e, #15803d)',color: "white", whiteSpace: 'nowrap',boxShadow: '0px 4px 12px rgba(34, 197, 94, 0.3)', fontWeight: 'bold',"&:hover": { background: 'linear-gradient(to right, #16a34a, #166534)', }, }}   onClick={() => Openset_Sched(year)}>Set Schedule</Button>
                        </Box>
                      </CardContent>
                    </Card>
                    </Grid>
                  ))):(
                    <Grid item xs={12}>
                    <Typography variant="h6" align="center" sx={{ width: '100%', color: 'black', fontWeight: 'bold', mt: 3,}}> Year didn't exist</Typography>
                    </Grid>)}
                </Grid>
              <Dialog  open={open} onClose={Closeset_Sched} fullWidth fullScreen={isSmallScreen}  maxWidth="lg" sx={{"& .MuiDialog-paper": {width: "100%",maxHeight: "90vh", margin: 0,padding: 5,},"& .MuiDialog-paper::-webkit-scrollbar": {display: "none", },}}>
              <Typography variant="h4" component="h1" gutterBottom sx={{textAlign: 'center'}}>Creating Schedule </Typography>
              {errorMessage && (<Typography color="error" variant="body5" textAlign='center'> {errorMessage} </Typography>)}

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField select label="Room" name="room_id" value={formValues.room_id} onChange={handleChange} variant="outlined" fullWidth margin="normal" error={!!errors.room_id} helperText={errors.room_id ? errors.room_id.join(', ') : ''} >
                      {roomData.map((room) => (
                        <MenuItem key={room.id} value={room.id}>
                          {room.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField select label="Prof" name="user_id" value={formValues.user_id} onChange={handleChange} variant="outlined" fullWidth margin="normal" error={Boolean(errors.user_id)} helperText={errors.user_id ? errors.user_id.join(', ') : ''}   >
                      {userData.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.username}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField select label="Subject" name="course_id" value={formValues.course_id} onChange={handleChange} variant="outlined" fullWidth margin="normal" error={!!errors.course_id} helperText={errors.course_id ? errors.course_id.join(', ') : ''} >
                      {courseData.map((course) => (
                        <MenuItem key={course.id} value={course.id}>
                          {course.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField label="Assigned Date" name="assigned_date" type="date" value={formValues.assigned_date} onChange={handleChange} InputLabelProps={{ shrink: true }} variant="outlined" fullWidth margin="normal" error={Boolean(errors.assigned_date)} helperText={errors.assigned_date ? errors.assigned_date.join(', ') : ''} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField label="End Date" name="end_date" type="date" value={formValues.end_date} onChange={handleChange} InputLabelProps={{ shrink: true }} variant="outlined" fullWidth margin="normal" error={Boolean(errors.end_date)} helperText={errors.end_date ? errors.end_date.join(', ') : ''} />
                  </Grid>

                  <Grid item xs={12}>
                  <Typography variant="body1" sx={{ mb: 1 ,fontWeight: 'bold'}}> Select Days</Typography>
                    <FormGroup name="days"row error={!!errors.days} helperText={errors.days ? errors.days.join(', ') : ''} >
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                        (day) => (
                          <FormControlLabel key={day} control={
                              <Checkbox value={day} checked={formValues.days_in_week.includes(day)} onChange={handleDaysChange}/>} label={day} />
                        )
                      )}
                    </FormGroup>
                  </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField label="Start Time" name="start_time" type="time" value={formValues.start_time} onChange={handleChange} InputLabelProps={{ shrink: true }} variant="outlined" fullWidth margin="normal" error={!!errors.start_time} helperText={errors.start_time ? errors.start_time.join(', ') : ''} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField label="End Time" name="end_time" type="time" value={formValues.end_time} onChange={handleChange} InputLabelProps={{ shrink: true }} variant="outlined" fullWidth margin="normal" error={!!errors.end_time} helperText={errors.end_time ? errors.end_time.join(', ') : ''} />
                    </Grid>
                </Grid>
                 <Box sx={{display: 'flex',gap: 2,justifyContent: 'leftt',mt: 2}}>
                    <Button sx={{backgroundColor: '#D9D9D9' ,color: 'black', fontWeight: 'bold'}} onClick={Closeset_Sched}> Close </Button>
                    <Button variant="contained" sx={{ backgroundColor: "#02318A" ,fontWeight: 'bold'}} onClick={handleSave}>Save Schedule</Button>
                 </Box>
              </Dialog>
               <Dialog open={openView} onClose={Viewsched_Close} fullWidth fullScreen={isSmallScreen} maxWidth="lg" sx={{"& .MuiDialog-paper": { width: "100%", maxHeight: "90vh", margin: 0, padding: 3,},"& .MuiDialog-paper::-webkit-scrollbar": {display: "none",},}}>
                <DialogTitle variant="h5" sx={{ textAlign: "center" }}>Class Schedule</DialogTitle>
                    {isSmallScreen ? (
                      <Box>
                        {scheduleData.length > 0 ? (
                          scheduleData.map((row, index) => (
                            <Box key={index} sx={{ border: "1px solid #ccc", borderRadius: "8px", padding: 2, mb: 2, boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",}}>
                              <Box sx={{ mb: 1, fontWeight: "bold" }}>Day: {formatDays(row.days_in_week)}</Box>
                              Time: {new Date(`1970-01-01T${row.start_time}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - 
                              {new Date(`1970-01-01T${row.end_time}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              <Box sx={{ mb: 1 }}>Room: {row.room?.name}</Box>
                              <Box sx={{ mb: 1 }}>Course Code: {row.course?.code}</Box>
                              <Box sx={{ mb: 1 }}>Descriptive Title: {row.course?.name}</Box>
                              <Box sx={{ mb: 1 }}>Unit: {row.course?.credit_unit}</Box>
                              <Box sx={{ mb: 1 }}>Professor: {row.user?.username}</Box>
                            </Box>
                          ))
                        ) : (
                          <Box sx={{ textAlign: "center", mt: 2 }}>No schedule available for {selectedYear}</Box>
                        )}
                      </Box>) : (
                <TableContainer>
                  <Table sx={{ border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden", mt: 2,}}>
                      <TableHead>
                          <TableRow sx={{ backgroundColor: "#1632A2" }}>
                            <TableCell align="center" sx={{ color: "#ffffff", fontWeight: "bold" }}>Day</TableCell>
                            <TableCell align="center" sx={{ color: "#ffffff", fontWeight: "bold" }}>Time</TableCell>
                            <TableCell align="center" sx={{ color: "#ffffff", fontWeight: "bold" }}>Room</TableCell>
                            <TableCell align="center" sx={{ color: "#ffffff", fontWeight: "bold" }}>Course Code</TableCell>
                            <TableCell align="center" sx={{ color: "#ffffff", fontWeight: "bold" }}>Descriptive Title</TableCell>
                            <TableCell align="center" sx={{ color: "#ffffff", fontWeight: "bold" }}>Unit</TableCell>
                            <TableCell align="center" sx={{ color: "#ffffff", fontWeight: "bold" }}>Professor</TableCell>
                          </TableRow>
                      </TableHead>
                    <TableBody>
                        {scheduleData.length > 0 ? (
                          scheduleData.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell align="center">{formatDays(row.days_in_week)}</TableCell>
                              <TableCell align="center"> {new Date(`1970-01-01T${row.start_time}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - {new Date(`1970-01-01T${row.end_time}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</TableCell>
                              <TableCell align="center">{row.room?.name}</TableCell>
                              <TableCell align="center">{row.course?.code}</TableCell>
                              <TableCell align="center">{row.course?.name}</TableCell>
                              <TableCell align="center">{row.course?.credit_unit}</TableCell>
                              <TableCell align="center">{row.user?.username}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} align="center"> No schedule available for {selectedYear}</TableCell>
                          </TableRow>
                        )}
                    </TableBody>
                  </Table>
                </TableContainer>
            )}
              <DialogActions sx={{ display: "flex", justifyContent: "left", pb: 2,gap:2}}>
                 <Button onClick={Viewsched_Close} className="no-print" sx={{backgroundColor: "#D9D9D9",color: "black",fontWeight: "bold",}}> Close</Button>
                 <Button onClick={() => window.print()}   sx={{backgroundColor: "#1632A2",color: "white",fontWeight: "bold",}}> Print</Button>
              </DialogActions>
          </Dialog>  
        </Box>
  );
}
export default Assign_sched;
