import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { toast } from 'react-toastify';
import { useCookies } from 'react-cookie';
import { index ,update} from '../../api/otp_request';

export default function UserRoomRequest() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [cookies] = useCookies(['AUTH_TOKEN']);
  const [otpRequest, setOtpRequest] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newAccessCode, setNewAccessCode] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchUserRequests = async () => {
      const token = cookies.AUTH_TOKEN;
      try {
        const response = await index(token);
        if (response.ok) {
          const requests = response.data;
          console.log(requests);
          const filteredRequests = requests.filter(
            (request) => request.user_id === user.id && request.Access_code != null
          );
          setOtpRequest(filteredRequests);
        } else {
          toast.error(response.message ?? 'Failed to fetch requests.');
        }
      } catch (error) {
        console.error('Failed to fetch requests', error);
        toast.error('Failed to fetch requests.');
      }
    };

    fetchUserRequests();
  }, [cookies, user.id]);

  const handleOpenModal = (request) => {
    setSelectedRequest(request);
    setNewAccessCode(request.Access_code || '');
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleUpdateAccessCode = async () => {
    if (!newAccessCode) {
      toast.error('Please enter a valid access code.');
      return;
    }
  
    try {
      const token = cookies.AUTH_TOKEN;
      // Ensure that the request ID is correctly placed in the URL and the Access code is sent in the body
      const response = await fetch(`http://localhost:8000/api/otp_requests/${selectedRequest.id}?_method=PATCH`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ Access_code: newAccessCode }), // Send the access code in the body of the request
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setOtpRequest((prevRequests) => prevRequests.map((request) =>
          request.id === selectedRequest.id ? { ...request, Access_code: newAccessCode } : request
        ));
        toast.success('Access code updated successfully.');
        handleCloseModal();
      } else {
        toast.error(data.message ?? 'Failed to update access code.');
      }
    } catch (error) {
      console.error('Failed to update access code', error);
      toast.error('Failed to update access code.');
    }
  };
  

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ marginBottom: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#374151', letterSpacing: '0.5px', textAlign: 'left' }}>Access Code Request</Typography>
            <Button disabled={!otpRequest[0] || otpRequest[0].otp_status != 1} sx={{ background: otpRequest[0] && otpRequest[0].otp_status == 1 ? '#16A22B' : '#ccc', color: 'white', fontWeight: 'bold', width: '200px', height: '50px', borderRadius: '10px', marginTop: '2rem', '&:disabled': { backgroundColor: '#ccc', color: 'white',}}}onClick={() => handleOpenModal(otpRequest[0])}> Change Access Code</Button>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 3, overflowX: 'auto', padding: 2 }}>
        {otpRequest.length > 0 ? (
          isSmallScreen ? (
            otpRequest.map((request) => (
              <Box key={request.id} sx={{ border: '1px solid #ccc', borderRadius: '5px', marginBottom: 2, padding: 2, boxShadow: 2 }}>
                <Typography><strong>Room Id:</strong> {request.room_id}</Typography>
                <Typography><strong>Room Name:</strong> {request.room?.name}</Typography>
                <Typography><strong>User Name:</strong> {request.user?.username}</Typography>
                <Typography> <strong>Access Code:</strong>{request.otp_status == 1 ? request.Access_code : '—'}</Typography>


                <Typography><strong>Status:</strong>
                <Typography  sx={{  color:request.otp_status == 2 ? '#E87E21' : request.otp_status == 1 ? '#16A22B' : request.otp_status == 3 ? '#C41919' : 'inherit', fontWeight: 'bold', borderRadius: '5px', padding: '4px 12px', display: 'inline-block', textTransform: 'none', width: '100px', textAlign: 'center',}}>{request.otp_status == 1 ? 'ACCEPTED' : request.otp_status == 2 ? 'PENDING' : request.otp_status == 3 ? 'REJECTED' : 'Unknown'}      </Typography>

                </Typography>
                <Typography><strong>Date Use:</strong> {new Date(request.generated_at).toLocaleDateString()}</Typography>
                <Typography><strong>Start Time:</strong> {new Date(`1970-01-01T${request.used_at}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })}</Typography>
                <Typography><strong>End Time:</strong> {new Date(`1970-01-01T${request.end_time}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })}</Typography>
                <Typography><strong>Purpose:</strong> {request.purpose}</Typography>
              </Box>
            ))
          ) : (
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Room Id</TableCell>
                  <TableCell align="center">Room Name</TableCell>
                  <TableCell align="center">User Name</TableCell>
                  <TableCell align="center">Access Code</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Date Use</TableCell>
                  <TableCell align="center">Start Time</TableCell>
                  <TableCell align="center">End Time</TableCell>
                  <TableCell align="center">Purpose</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {otpRequest.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell align="center">{request.room_id}</TableCell>
                    <TableCell align="center">{request.room?.name}</TableCell>
                    <TableCell align="center">{request.user?.username}</TableCell>
                    <TableCell align="center">{request.otp_status == 1 ? request.Access_code : '—'}</TableCell>
                    <TableCell align="center">
                <Typography align="center" sx={{color: request.otp_status == 2 ? '#E87E21' : request.otp_status == 1 ? '#16A22B' : request.otp_status == 3 ? '#C41919' : 'inherit', fontWeight: 'bold', borderRadius: '5px', padding: '4px 12px', display: 'inline-block',textAlign: 'center',}}>{request.otp_status == 1  ? 'ACCEPTED' : request.otp_status == 2 ? 'PENDING' : request.otp_status == 3 ? 'REJECTED' : 'Unknown'}</Typography>
                </TableCell>

                    <TableCell align="center">{new Date(request.generated_at).toLocaleDateString()}</TableCell>
                    <TableCell align="center">{new Date(`1970-01-01T${request.used_at}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })}</TableCell>
                    <TableCell align="center">{new Date(`1970-01-01T${request.end_time}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })}</TableCell>
                    <TableCell align="center">{request.purpose}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: 3 }}>
            <Typography variant="h6" sx={{ color: 'gray' }}> No room requests found.</Typography>
          </Box>
        )}
      </TableContainer>
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontWeight: 'bold', color: '#374151', fontSize: '1.25rem' }}>Change Access Code</DialogTitle>
            <DialogContent sx={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
               <TextField label="Access Code" variant="outlined" fullWidth value={newAccessCode} onChange={(e) => setNewAccessCode(e.target.value)} InputLabelProps={{style: { whiteSpace: 'nowrap', overflow: 'visible' }, }} sx={{marginTop: 2, }}/>
            </DialogContent>
            <DialogActions sx={{ padding: '16px 24px' ,display: 'flex',justifyContent: 'start'}}>
                <Button onClick={handleCloseModal} sx={{ fontWeight: 'bold', color: 'white', borderRadius: '8px',backgroundColor: 'rgb(255, 0, 0)' }}>Cancel </Button>
                <Button onClick={handleUpdateAccessCode} color="primary" sx={{ fontWeight: 'bold', backgroundColor: '#16A22B', color: 'white', borderRadius: '8px', '&:hover': { backgroundColor: '#128C1A', },}} >Update</Button>
            </DialogActions>
      </Dialog>
    </Box>
  );
}
