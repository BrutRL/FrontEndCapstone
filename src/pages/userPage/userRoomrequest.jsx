import React, { useState, useEffect } from "react";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,Button } from '@mui/material';
import { index } from '../../api/otp_request.js';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import { useMediaQuery } from '@mui/material';
function UserRoomRequest() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [cookies] = useCookies(['AUTH_TOKEN']);
  const [roomRequest, setRoomRequest] = useState([]);
  const isMobile = useMediaQuery('(max-width: 768px)');

    useEffect(() => {
      const fetchUserRequests = async () => {
        const token = cookies.AUTH_TOKEN;
        try {
          const response = await index(token);
          if (response.ok) {
            const requests = response.data;
            const filteredRequests = requests.filter(
              (request) => request.user_id === user.id && (!request.Access_code || request.Access_code == null)
            );
            setRoomRequest(filteredRequests);
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
  

  return (
    <Box sx={{ padding: 2 }}>
  <Box sx={{ marginBottom: 2 }}>
    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#374151', letterSpacing: '0.5px' ,textAlign: 'left'}}>Room Request</Typography>
  </Box>
  {roomRequest.length > 0 ? (
  isMobile ? (
    // ✅ Mobile View - Don't wrap with TableContainer
    <>
      {roomRequest.map((request) => (
        <Box key={request.id} sx={{ border: '1px solid #ccc', borderRadius: '5px', marginBottom: 2, padding: 2, boxShadow: 2 }}>
          <Typography><strong>Room Id:</strong> {request.room_id}</Typography>
          <Typography><strong>Room Name:</strong> {request.room?.name}</Typography>
          <Typography><strong>User Name:</strong> {request.user?.username}</Typography>
          <Typography><strong>Status:</strong> 
            <Typography sx={{  color: request.access_status == 2 ? '#E87E21' : request.access_status == 1 ? '#16A22B' : request.access_status == 3 ? '#C41919' : 'inherit', fontWeight: 'bold', borderRadius: '5px', padding: '4px 12px', display: 'inline-block', textTransform: 'none', width: '100px', textAlign: 'center'}}>
              {request.access_status == 1 ? 'ACCEPTED' : request.access_status == 2 ? 'PENDING' : request.access_status == 3 ? 'REJECTED' : 'Unknown'}
            </Typography>
          </Typography>
          <Typography><strong>Date Use:</strong> {new Date(request.generated_at).toLocaleDateString()}</Typography>
          <Typography><strong>Start Time:</strong> {new Date(`1970-01-01T${request.used_at}`).toLocaleTimeString('en-PH', { hour: 'numeric', minute: 'numeric', hour12: true })}</Typography>
          <Typography><strong>End Time:</strong> {new Date(`1970-01-01T${request.end_time}`).toLocaleTimeString('en-PH', { hour: 'numeric', minute: 'numeric', hour12: true })}</Typography>
          <Typography><strong>Purpose:</strong> {request.purpose}</Typography>
        </Box>
      ))}
    </>
  ) : (
    <TableContainer component={Paper} sx={{ boxShadow: 3, overflowX: 'auto', padding: 2 }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Room Id</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Room Name</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>User Name</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Status</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Date Use</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Start Time</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>End Time</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Purpose</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {roomRequest.map((request) => (
            <TableRow key={request.id} sx={{ '&:hover': { backgroundColor: '#f1f1f1' } }}>
              <TableCell align="center">{request.room_id}</TableCell>
              <TableCell align="center">{request.room?.name}</TableCell>
              <TableCell align="center">{request.user?.username}</TableCell>
              <TableCell align="center">
                <Typography sx={{ color: request.access_status == 2 ? '#E87E21' : request.access_status == 1 ? '#16A22B' : request.access_status == 3 ? '#C41919' : 'inherit', fontWeight: 'bold', borderRadius: '5px', padding: '4px 12px', display: 'inline-block'}}>
                  {request.access_status == 1 ? 'ACCEPTED' : request.access_status == 2 ? 'PENDING' : request.access_status == 3 ? 'REJECTED' : 'Unknown'}
                </Typography>
              </TableCell>
              <TableCell align="center">{new Date(request.generated_at).toLocaleDateString()}</TableCell>
              <TableCell align="center">{new Date(`1970-01-01T${request.used_at}`).toLocaleTimeString('en-PH', { hour: 'numeric', minute: 'numeric', hour12: true })}</TableCell>
              <TableCell align="center">{new Date(`1970-01-01T${request.end_time}`).toLocaleTimeString('en-PH', { hour: 'numeric', minute: 'numeric', hour12: true })}</TableCell>
              <TableCell align="center">{request.purpose}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
) : (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: 3 }}>
    <Typography variant="h6" sx={{ color: 'gray' }}> No room requests found.</Typography>
  </Box>
)}
</Box>
  );
}

export default UserRoomRequest;
