import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useMediaQuery } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { Container, Paper, Box, Typography, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { index } from '../api/room';
import { index as Sched_index } from '../api/schedule';

function Room_scheds() {
    const [cookies] = useCookies(['AUTH_TOKEN']);
    const [Room_data, setRoom_data] = useState([]);
    const [Sched_data, setSched_data] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const dayMapping = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    useEffect(() => {
        const fetchRoomData = async () => {
            const token = cookies.AUTH_TOKEN;
            try {
                const response = await index(token);
                if (response.ok) {
                    setRoom_data(response.data);
                } else {
                    toast.error(response.message ?? 'Failed to fetch Room Data.');
                }
            } catch (error) {
                console.error('Failed to fetch Room Data', error);
                toast.error('Failed to fetch Room Data.');
            }
        };

        fetchRoomData();
    }, [cookies]);

    useEffect(() => {
        const fetch_Sched = async () => {
            const token = cookies.AUTH_TOKEN;
            try {
                const response = await Sched_index(token);
                if (response.ok) {
                    setSched_data(response.data);
                } else {
                    toast.error(response.message ?? 'Failed to fetch Schedule Data.');
                }
            } catch (error) {
                console.error('Failed to fetch Schedule Data', error);
                toast.error('Failed to fetch Schedule Data.');
            }
        };

        fetch_Sched();
    }, [cookies]);

    const handleOpenModal = (room) => {
        setSelectedRoom(room);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setSelectedRoom(null);
    };


    const formatDays = (daysArray) => {
        if (!daysArray) return 'N/A';
        if (typeof daysArray === 'string') {
          daysArray = daysArray.replace(/\[|\]/g, '').split(',').map(Number);
        }
        if (!Array.isArray(daysArray) || daysArray.length === 0) return 'N/A';
        return daysArray.map((day) => dayMapping[day] || 'Invalid Day').join(', ');
      };
    return (
        <Container>
            {Room_data.length > 0 ? (
                <Grid container spacing={2} direction={isSmallScreen ? 'column' : 'row'}>
                    {Room_data.map((room, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Paper sx={{ textAlign: 'center', boxShadow: '10px 5px 20px rgba(0, 0, 0.1, 0.1)', mt: 2, mx: 'auto', transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'scale(1.05)', boxShadow: '10px 10px 30px rgba(0, 0, 0.1, 0.2)' } }}>
                                <Box sx={{ width: '0px', height: '30px', mt: 2 }} />
                                <Box sx={{ p: 1, pl: 2, pb: 2, textAlign: 'center' }}>
                                    <Typography sx={{ color: '#4a5568' }}>Room ID: {room.id}</Typography>
                                    <Typography sx={{ color: '#4a5568' }}>Name: {room.name}</Typography>
                                    <Typography sx={{ color: '#4a5568' }}>Location: {room.location}</Typography>
                                    <Button 
                                        sx={{ backgroundColor: '#1632A2', color: 'white', mt: 1 }}
                                        onClick={() => handleOpenModal(room)}
                                    >
                                        View Schedule
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography sx={{ textAlign: 'center', mt: 5, color: '#4a5568' }}>No Room Found.</Typography>
            )}

            <Dialog open={open} onClose={handleCloseModal} fullWidth maxWidth="xl"  sx={{'& .MuiDialog-paper': {width: '90%', maxHeight: '80vh', },}}>
                <DialogTitle sx={{textAlign: 'center'}}>Room Schedule</DialogTitle>
                <DialogContent>
                    {selectedRoom && (
                        <>
                            {(() => {
                                const filteredSchedules = Sched_data.filter(
                                    schedule => schedule.room_id === selectedRoom.id && schedule.status == 1
                                );

                                return filteredSchedules.length > 0 ? (
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
                                                <TableRow
                                                    key={index}
                                                    sx={{
                                                        backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
                                                        '&:hover': {
                                                            backgroundColor: '#f1f1f1',
                                                            cursor: 'pointer',
                                                        },
                                                    }}
                                                >
                                                    <TableCell sx={{ textAlign: 'center' }}>{formatDays(schedule.days_in_week)}</TableCell>
                                                    <TableCell sx={{ textAlign: 'center' }}>{schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}</TableCell>
                                                    <TableCell align="center">{schedule.room?.name}</TableCell>
                                                    <TableCell align="center">{schedule.course?.name}</TableCell>
                                                    <TableCell align="center">{schedule.course?.code}</TableCell>
                                                    <TableCell align="center">{schedule.course?.credit_unit}</TableCell>
                                                    <TableCell align="center">{schedule.user?.username}</TableCell>
                                                    <TableCell align="center">{schedule.year}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <Typography>No schedules found</Typography>
                                );
                            })()}
                        </>
                    )}
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'left', pb: 2, ml: 2 }}>
                    <Button onClick={handleCloseModal} sx={{ backgroundColor: '#D9D9D9', color: 'black', fontWeight: 'bold' }}>Close</Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
}

export default Room_scheds;
