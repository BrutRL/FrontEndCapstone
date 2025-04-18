import { Box, Button, Typography, Grid, Card, CardActions, CardContent } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import { userAchive as UserIndex } from '../api/user';
import { courseArchive as CourseIndex } from '../api/course';
import { scheduleArchieve as ScheduleIndex } from '../api/schedule';
import { Courserestore, destroy as CourseDestroy } from '../api/course';
import { destroy as UserDestroy,Userestore } from '../api/user';

function Archive() {
  const [users, setUsers] = useState([]);
  const [cookies] = useCookies(['AUTH_TOKEN']);
  const [courses, setCourse] = useState([]);
  const [schedules, setSchedule] = useState([]);
 const [open, setOpen] = useState(false);
 const [modalOpen, setModalOpen] = useState(false);
 const handleDrawerOpen = () => {
   setOpen(true); 
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const fetchUsers = async () => {
      const token = cookies.AUTH_TOKEN;
      try {
        const response = await UserIndex(token);
        if (response.ok) {
          setUsers(response.data);
        } else {
          console.log('Response not OK:', response); 
          toast.error(response.message ?? 'Failed to fetch users.');
        }
      } catch (error) {
        console.error('Failed to fetch users', error);
        toast.error('Failed to fetch users.');
      }
    };
    fetchUsers();
  }, [cookies]);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = cookies.AUTH_TOKEN;
      try {
        const response = await CourseIndex(token);
        if (response.ok) {
          setCourse(response.data);
        } else {
          console.log('Response not OK:', response); 
          toast.error(response.message ?? 'Failed to fetch courses.');
        }
      } catch (error) {
        console.error('Failed to fetch courses', error);
        toast.error('Failed to fetch courses.');
      }
    };
    fetchCourses();
  }, [cookies]);

  const handleDeleteCourse = async (courseId) => {
    const token = cookies.AUTH_TOKEN;
    try {
      const response = await CourseDestroy(courseId, token);
      if (response.ok) {
        setCourse((prevCourses) => prevCourses.filter((course) => course.id !== courseId));
        toast.success('Course deleted successfully.');
      } else {
        console.log('Response not OK:', response);
        toast.error(response.message ?? 'Failed to delete course.');
      }
    } catch (error) {
      console.error('Failed to delete course', error);
      toast.error('Failed to delete course.');
    }
  };

  const handleRestoreCourse = async (courseId) => {
    const token = cookies.AUTH_TOKEN;
    try {
      const response = await Courserestore(courseId, token);
      if (response.ok) {
        setCourse((prevCourses) => prevCourses.map((course) => 
          course.id === courseId ? { ...course, deleted_at: null } : course
        ));
        toast.success('Course restored successfully.');
      } else {
        console.log('Response not OK:', response);
        toast.error(response.message ?? 'Failed to restore course.');
      }
    } catch (error) {
      console.error('Failed to restore course', error);
      toast.error('Failed to restore course.');
    }
  };
  const hanldeUserdelete = async (userId) => {
    const token = cookies.AUTH_TOKEN;
    try {
      const response = await UserDestroy(userId, token);
      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((users) => users.id !== userId));
        toast.success('User deleted successfully.');
      } else {
        console.log('Response not OK:', response);
        toast.error(response.message ?? 'Failed to user course.');
      }
    } catch (error) {
      console.error('Failed to delete user', error);
      toast.error('Failed to delete user.');
    }
  };
  const handleUserRestore = async (userId) => {
    const token = cookies.AUTH_TOKEN;
    try {
      const response = await Userestore(userId, token);
      if (response.ok) {
        setUsers((prevUsers) => prevUsers.map((user) => 
          user.id === userId ? { ...user, deleted_at: null } : user
        ));
        toast.success('User restored successfully.');
      } else {
        console.log('Response not OK:', response);
        toast.error(response.message ?? 'Failed to restore user.');
      }
    } catch (error) {
      console.error('Failed to restore user', error);
      toast.error('Failed to restore user.');
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#374151', letterSpacing: '0.5px' }}>
          Archive
        </Typography>
      </Box>
    
      <Box sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant='h5' sx={{ marginBottom: 2 }}>Users</Typography>
        <Grid container spacing={1}>
          {users.length > 0 ? (
            users.map((user) => {
              return (
                <Grid item key={user.id} xs={12} sm={6} md={4}>
                  <Card sx={{ maxWidth: 345 }}>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {user.username}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {user.email}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {user.role_id}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ pl: 2 }}>
                      <Button sx={{ background: '#02318A', color: 'white' }}  onClick={()=> handleUserRestore(user.id)}>Restore</Button>
                      <Button sx={{ background: '#E71717', color: 'white' }} onClick={()=> hanldeUserdelete(user.id)}>Delete</Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', width: '100%' }}>
              No Archive User.
            </Typography>
          )}
        </Grid>
      </Box>
      <Box sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant='h5' sx={{ marginBottom: 2 }}>Courses</Typography>
        <Grid container spacing={1}>
          {courses.length > 0 ? (
            courses.map((course) => {
              return (
                <Grid item key={course.id} xs={12} sm={6} md={4}>
                  <Card sx={{ maxWidth: 345 }}>
                    <CardContent>
                      <Typography sx={{ color: '#718096' }}>Course Code: {course.code}</Typography>
                      <Typography gutterBottom variant="h5" component="div">{course.name}</Typography>
                      <Typography variant="body2" sx={{ color: '#4a5568' }}>{course.description}</Typography>
                    </CardContent>
                    <CardActions sx={{ pl: 2 }}>
                      <Button sx={{ background: '#02318A', color: 'white' }} onClick={() => handleRestoreCourse(course.id)}>Restore</Button>
                      <Button sx={{ background: '#E71717', color: 'white' }} onClick={() => handleDeleteCourse(course.id)}>Delete</Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', width: '100%' }}>
              No Archive Courses.
            </Typography>
          )}
        </Grid>
      </Box>
    </Box>
  );
}

export default Archive;
