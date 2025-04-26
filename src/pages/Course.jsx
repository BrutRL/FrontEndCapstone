import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import { Typography, Button, useTheme,useMediaQuery,IconButton, Grid, Card, InputLabel,Select,FormControl,CardActionArea, CardContent, Box, Modal, TextField, Menu, MenuItem, Paper,Input,InputAdornment,Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import { index, store, update, Coursesoftdelete  } from '../api/course'; 
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import {store as store_sched, index as Scheduleindex} from '../api/schedule'
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};

export default function Course() {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cookies] = useCookies(['AUTH_TOKEN']);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [openSeeDetails,setOpenSeedetails] =useState(false)
  const [seeDetailssched,setseeDetailssched] = useState(null);
  const [errors, setErrors] = useState({});
  const dayMapping = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    code: '',
    credit_unit: '',
    description: '',
    user_id: '',
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);  
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchCourses = async () => {
      const token = cookies.AUTH_TOKEN;
      try {
        const response = await index(token);
        if (response.ok) {
          setCourses(response.data);
        } else {
          toast.error(response.message ?? 'Failed to fetch courses.');
        }
      } catch (error) {
        toast.error('Failed to fetch courses.');
      }
    };

    const fetchSched_index = async () => {
      const token = cookies.AUTH_TOKEN;
      try {
        const response = await Scheduleindex(token);
        if (response.ok) {
          setseeDetailssched(response.data);
        } else {
          toast.error(response.message ?? 'Failed to fetch schedules.');
        }
      } catch (error) {
        console.error('Failed to fetch schedules', error);
        toast.error('Failed to fetch schedules.');
      }
    };


    fetchCourses();
    fetchSched_index();
  }, [cookies]);


  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleOpenCreate = () => {
    setOpenCreate(true);
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
    setFormData({
      id: '',
      name: '',
      code: '',
      credit_unit: '',
      description: '',
      //user_id: '',
    });
  };
  const toNormalTime = (time) => {
    const [hours, minutes] = time.split(':');
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${period}`;
  };
  
  const handleOpenUpdate = () => {
    setOpenUpdate(true);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
    setFormData({
      id: '',
      name: '',
      credit_unit: '',
      description: '',
      user_id: '',
    });
    setSelectedCourse(null);
  };




   const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
        ...prevData,
        [name]: value,
    }));

};


const handleCreateSubmit = async (e) => {
  e.preventDefault();
  const token = cookies.AUTH_TOKEN;
  try {
    const response = await store(formData, token);

    if (response.ok) {
      toast.success("Course created successfully");
      setCourses((prevCourses) => [...prevCourses, response.data]);
      handleCloseCreate();
      setErrors({});
    } else {
      if (response.errors) {
        setErrors(response.errors); 
      }
    }
  } catch (error) {
    toast.error('Failed to create course.');
  }
};


  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const token = cookies.AUTH_TOKEN;
    try {
      const response = await update(formData, selectedCourse.id, token);
      if (response.ok) {
        toast.success('Course updated successfully');
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.id === selectedCourse.id ? response.data : course
          )
        );
        handleCloseUpdate();
      } else {
        toast.error(response.message ?? 'Failed to update course.');
      }
    } catch (error) {
      toast.error('Failed to update course.');
    }
  };

  const handleMenuOpen = (event, course) => {
    setAnchorEl(event.currentTarget);
    setSelectedCourse(course);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  


  const handleDelete = async () => {
    const token = cookies.AUTH_TOKEN;
    try {
      const response = await Coursesoftdelete(selectedCourse.id, token);
      if (response.ok) {
        toast.success('Course deleted successfully');
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course.id !== selectedCourse.id)
        );
      } else {
        toast.error(response.message ?? 'Failed to delete course.');
      }
    } catch (error) {
      toast.error('Failed to delete course.');
    }
    handleMenuClose();
    setOpenConfirmDelete(false);
  };


  const handleConfirmDelete = () => {
    setOpenConfirmDelete(true);
  };

  const handleSeeDetails = () => {
    setOpenSeedetails(true);
  };
  const handleCloseConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };
   const handleCloseSeedetails = () =>{
    setOpenSeedetails(false);
   }
  const handleUpdate = () => {
    if (selectedCourse) {
      setFormData({
        id: selectedCourse.id,
        name: selectedCourse.name,
        code: selectedCourse.code,
        credit_unit: selectedCourse.credit_unit,
        description: selectedCourse.description,
        user_id: selectedCourse.user_id,
      });
      handleOpenUpdate(); 
    } else {
      toast.error('No course selected for update.');
    }
    handleMenuClose(); 
  };
  const formatDays = (daysArray) => {
    if (!daysArray) return 'N/A';
    if (typeof daysArray === 'string') {
      daysArray = daysArray.replace(/\[|\]/g, '').split(',').map(Number);
    }
    if (!Array.isArray(daysArray) || daysArray.length === 0) return 'N/A';
    return daysArray.map((day) => dayMapping[day] || 'Invalid Day').join(', ');
  };

  const filteredCourses = courses.filter((course) =>
    (course.name?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()) ||
    (course.code?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()) ||
    (course.description?.toLowerCase() ?? '').includes(searchQuery.toLowerCase())
  );
  

  const handleCardClick = (course) => {
    setSelectedCourse(course);
  };
  const handleClearSearch = () => setSearchQuery('');

  return (
    <Box sx={{ width: '100vw', maxWidth: '100%', mt: 3, px: isSmallScreen ? 2 : 5 }}>
     <Box sx={{ width: '100%', mb: 2 }}>
        <Box sx={{display: 'flex',justifyContent: 'space-between'}}>   
          <Typography variant="h4" sx={{ textAlign: 'left',fontWeight: 'bold'}} gutterBottom>Courses</Typography>
        </Box>
        <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <Input placeholder="Search..." value={searchQuery} onChange={handleSearch} startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          } endAdornment={
            searchQuery && (
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
      <Box sx={{width: '100%', display: 'flex', flexDirection: 'row-reverse',mt: 2}}>
          <Button variant="contained" sx={{backgroundColor: 'rgb(22,162,43)', color:'white',fontWeight: 'bold',height: '40px'}} onClick={handleOpenCreate}> Create </Button> 
      </Box>
   </Box>
      <Grid container spacing={3} justifyContent="flex-start">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => {
            const assignedSchedule = seeDetailssched?.find(
            (sched) => sched.course_id === course.id && sched.status == 1); const professorName = assignedSchedule?.user?.username || "None";
          return (
              <Grid item xs={12} sm={6} md={3} key={course.id}>
                <Card sx={{ width: '100%', height: '100%',  background: 'linear-gradient(to bottom,rgb(146, 190, 231), #e8f2fb)', transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'scale(1.05)', boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',},  }}onClick={() => handleCardClick(course)}>
                  <CardActionArea sx={{ height: '100%' }}>
                    <CardContent>
                      <IconButton style={{ float: 'right' }} onClick={(event) => {handleMenuOpen(event, course); }}><MoreVertIcon /> </IconButton>
                      <Typography gutterBottom variant="h5" sx={{fontWeight: 'bold', wordBreak: 'break-word' }}component="div">{course.name}</Typography>
                        <Typography sx={{ color: 'black', wordBreak: 'break-word'  }}>Course Code: {course.code}</Typography>
                        <Typography variant="body2" sx={{ color: 'black', wordBreak: 'break-word' }}>{course.description}</Typography>
                        <Typography variant="body2" sx={{ color: 'black', wordBreak: 'break-word' }}>Assign Professor: {professorName} </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
          );
        })
      ) : (
        <Grid item xs={12}>
          <Typography variant="h6" align="center" sx={{ mt: 2 }}> No courses exist</Typography>
        </Grid>
      )}
    </Grid>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleUpdate}>Update</MenuItem>
        <MenuItem onClick={handleConfirmDelete}>Delete</MenuItem>
        <MenuItem onClick={handleSeeDetails}>See Details</MenuItem>
      </Menu>
      <Modal open={openCreate} onClose={() =>{handleCloseCreate();setErrors({});}} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <Box  sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: { xs: "90%", sm: "70%", md: "50%", lg: 450 },  bgcolor: "background.paper", p: { xs: 2, sm: 3, md: 4 },  borderRadius: "12px", boxShadow: 5,}}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography id="modal-modal-title" variant="h6" component="h2">Create Course</Typography>
              <IconButton onClick={() =>{handleCloseCreate();setErrors({});}}>
                <CloseIcon />
              </IconButton>
            </Box>
            
            <form onSubmit={handleCreateSubmit}>
              <TextField fullWidth margin="normal" label="Name" name="name" value={formData.name}  onChange={(e) => { const value = e.target.value.replace(/[0-9]/g, ""); setFormData({ ...formData, name: value }); }} helperText={errors.name ? errors.name.join(', ') : ''}  />
              <TextField fullWidth margin="normal" label="Code" name="code" value={formData.code} onChange={handleChange} required  error={!!errors.code} helperText={errors.code ? errors.code.join(', ') : ''} />
              
              <TextField fullWidth margin="normal" label="Unit" name="credit_unit" value={formData.credit_unit} onChange={handleChange} required  error={!!errors.credit_unit} helperText={errors.credit_unit ? errors.credit_unit.join(', ') : ''}/>
              
              <TextField fullWidth margin="normal" label="Description" name="description" value={formData.description} onChange={(e) => { const value = e.target.value.replace(/[0-9]/g, ""); setFormData({ ...formData, description: value }); }} required error={!!errors.description} helperText={errors.description ? errors.description.join(', ') : ''} />
              <Box sx={{ display: "flex", flexDirection: { xs: "row", sm: "row" }, gap: 2, mt: 3 }}>
                <Button onClick={() =>{handleCloseCreate();setErrors({});}} variant="contained" sx={{ backgroundColor: "red", width: { xs: "100%", sm: "auto" } }}>Close</Button>
                <Button type="submit" variant="contained" sx={{ backgroundColor: "#02318A", width: { xs: "100%", sm: "auto" } }}> Save</Button>
              </Box>
            </form>
          </Box>
   </Modal>
      <Modal open={openUpdate} onClose={handleCloseUpdate} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
  <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: { xs: "90%", sm: "70%", md: "50%", lg: 450 },  bgcolor: "background.paper", p: { xs: 2, sm: 3, md: 4 }, borderRadius: "12px", boxShadow: 5,}}>
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography id="modal-modal-title" variant="h6" component="h2"> Update Course</Typography>
      <IconButton onClick={handleCloseUpdate}>
        <CloseIcon />
      </IconButton>
    </Box>
    
    <form onSubmit={handleUpdateSubmit}>
      <TextField fullWidth margin="normal" label="Course ID" name="id" value={formData.id} onChange={handleChange} required disabled />
      <TextField fullWidth margin="normal" label="Name" name="name" value={formData.name} onChange={handleChange} required />
      <TextField fullWidth margin="normal" label="Unit" name="credit_unit" value={formData.credit_unit} onChange={handleChange} required />
      <TextField fullWidth margin="normal" label="Description" name="description" value={formData.description} onChange={handleChange} required />
      
      <Box sx={{ display: "flex", flexDirection: { xs: "row", sm: "row" }, gap: 2, mt: 3, alignItems: {xs: 'center'} }}>
        <Button onClick={handleCloseUpdate} variant="contained" sx={{ backgroundColor: "red", width: { xs: "70%", sm: "auto" } }}>Close </Button>
        <Button type="submit" variant="contained" sx={{ backgroundColor: "#02318A", width: { xs: "70%", sm: "auto" } }}>Update</Button>
      </Box>
    </form>
  </Box>
</Modal>
      <Dialog open={openConfirmDelete} onClose={handleCloseConfirmDelete} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"> Are you sure you want to delete this course?</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'left' }}>
          <Button onClick={handleCloseConfirmDelete} sx={{ backgroundColor: 'green', color: 'white' }}>Cancel</Button>
          <Button onClick={handleDelete} sx={{ backgroundColor: 'red', color: 'white' }} autoFocus> Delete </Button>
        </DialogActions>
      </Dialog>
      <Modal open={openSeeDetails} onClose={handleCloseSeedetails} aria-labelledby="assign-modal-title" aria-describedby="assign-modal-description">
  <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: { xs: "90%", sm: "70%", md: "50%", lg: 450 },  bgcolor: "background.paper", p: { xs: 2, sm: 3, md: 4 },  height: "auto", maxHeight: "75vh", overflowY: "auto", borderRadius: "12px", boxShadow: 5,}}>
    <Typography id="assign-modal-title" variant="h5" gutterBottom sx={{ textAlign: "center", color: "#374151" }}> Professor Assigned Details</Typography>
    {selectedCourse && seeDetailssched.some((sched) => sched.course_id === selectedCourse.id && sched.status == 1) ? (
      seeDetailssched.filter((sched) => sched.course_id === selectedCourse.id && sched.status == 1).map((sched) => (
          <Box key={sched.id} sx={{ mt: 2, p: 3, bgcolor: "#F3F4F6", borderRadius: "10px", boxShadow: 2,}}>
            <Typography variant="body1" fontWeight="bold"><span style={{ color: "black" }}>👨‍🏫 Professor Name:</span> {sched.user?.username || "N/A"}</Typography>
            <Typography variant="body1"><span style={{ fontWeight: "bold", color: "black" }}>📌 Prof ID:</span> {sched.user_id}</Typography>
            <Typography variant="body1"><span style={{ fontWeight: "bold", color: "black" }}>📚 Course ID:</span> {sched.course_id}</Typography>
            <Typography variant="body1"><span style={{ fontWeight: "bold", color: "black" }}>🚪 Room:</span> {sched.room?.name}</Typography>
            <Typography  variant="body1" ><span style={{ fontWeight: "bold", color: "black" }}>🗓 Day:</span> {formatDays(sched.days_in_week)}</Typography>
            <Typography variant="body1"><span style={{ fontWeight: "bold", color: "black" }}>📅 Start Date:</span> {sched.assigned_date}</Typography>
            <Typography variant="body1"><span style={{ fontWeight: "bold", color: "black" }}>📆 End Date:</span> {sched.end_date}</Typography>
            <Typography variant="body1"><span style={{ fontWeight: "bold", color: "black" }}>⏳ Duration:</span> {toNormalTime(sched.start_time)} to {toNormalTime(sched.end_time)}</Typography>
          </Box>
        ))
    ) : (
      <Typography sx={{ textAlign: "center", mt: 2, color: "black" }}>
        ❌ No professor assigned
      </Typography>
    )}

    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
      <Button onClick={handleCloseSeedetails} sx={{ backgroundColor: "#374151", color: "white", fontWeight: "bold", px: 3, py: 1, borderRadius: "8px", "&:hover": { backgroundColor: "#1F2937" },}}> Close</Button>
    </Box>
  </Box>
</Modal>

    </Box>
  );
}