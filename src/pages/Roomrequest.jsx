import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { index, update } from '../api/otp_request';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';
import { store } from '../api/accesslogs';
import { Typography, Table, TableBody,Select, TableCell, TableContainer,Dialog, DialogTitle,TableHead,DialogContent ,DialogActions,Grid,TextField, TableRow, Paper, Card, Divider, Modal, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Header from '../assets/images/HeaderUrs.png';
import {update as Rooms_Update} from '../api/room';
function Roomrequest() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [cookies] = useCookies(['AUTH_TOKEN']);
  const [Roomrequest, setRoomrequest] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [open, setOpen] = useState(false);

 
  const [isPrinting, setIsPrinting] = useState(false);
  

  useEffect(() => {
    const fetchRooms = async () => {
      const token = cookies.AUTH_TOKEN;
      try {
        const response = await index(token);
        if (response.ok) {
          const filteredData = response.data.filter(request => !request.Access_code || request.Access_code == null);
          setRoomrequest(filteredData);
        } else {
          toast.error(response.message ?? 'Failed to fetch rooms.');
        }
      } catch (error) {
        console.error('Failed to fetch rooms', error);
        toast.error('Failed to fetch rooms.');
      }
    };
    fetchRooms();
  }, [cookies]);

  const handleAccept = async (request) => {
    if (request.otp_status === 'accepted' || request.otp_status === 'rejected') {
      toast.warning('This request has already been processed.');
      return;
    }
  
    const token = cookies.AUTH_TOKEN;
    const body = { otp_status: 1 };
    try {
      // Update OTP request
      const response = await update(body, request.id, token);
      console.log('API response:', response);
  
      if (response.ok) {
        toast.success('Request accepted successfully!');
        setRoomrequest((prevRequests) =>
          prevRequests.map((req) =>
            req.id === request.id ? { ...req, otp_status: 'accepted' } : req
          )
        );
  
        // Save to access logs
        const end_time = request.end_time;
        const used_at = request.used_at;
        const formatend_time = end_time.split(":").slice(0, 2).join(":");
        const formatused_at = used_at.split(":").slice(0, 2).join(":");
  
        const logData = {
          room_id: request.room_id,
          user_id: request.user_id,
          otp_request_id: request.id,
          accessed_at: request.generated_at,
          access_status: 2,
          used_at: formatused_at,
          end_time: formatend_time,
        };
  
        const logResponse = await store(logData, token);
  
        if (logResponse.ok) {
          console.log('Access log stored successfully!');
        } else {
          console.error('Failed to store access log:', logResponse);
          toast.error(logResponse.message || 'Failed to store access log.');
        }
  
        // Update Room Status
        const roomUpdateBody = { status: 2}; 
        const roomUpdateResponse = await Rooms_Update(roomUpdateBody, request.room_id, token);
      
  
        if (roomUpdateResponse.ok) {
          console.log("Room Status Updated");
        } else {
          console.error('Failed to update room status:', roomUpdateResponse);
          toast.error(roomUpdateData?.message || 'Failed to update room status.');
        }
      } 
    } catch (error) {
      console.error('Error during request processing:', error);
      toast.error('An error occurred. Please try again.');
    }
  };
  

  const handleReject = async (id, currentStatus, request) => {
    // Validate the request object and room_id
    if (!request || !request.room_id) {
      console.error('Invalid request object or missing room_id:', request);
      toast.error('Failed to process the request. Missing room information.');
      return;
    }
  
    if (currentStatus === 'accepted' || currentStatus === 'rejected') {
      toast.warning('This request has already been processed.');
      return;
    }
  
    const token = cookies.AUTH_TOKEN;
    const body = { otp_status: 3 };
  
    try {
      // Update the OTP request status
      const response = await update(body, id, token);
      console.log('API response:', response);
  
      if (response.ok) {
        toast.success('Request rejected successfully!');
        setRoomrequest((prevRequests) =>
          prevRequests.map((req) =>
            req.id === id ? { ...req, otp_status: 'rejected' } : req
          )
        );
      } else {
        toast.error(response.message || 'Failed to reject the request.');
      }
  
      // Update the room status
      const roomUpdateBody = { status: 1 };
      const roomUpdateResponse = await Rooms_Update(roomUpdateBody, request.room_id, token);
  
      if (roomUpdateResponse.ok) {
        console.log('Room Status Updated');
      } else {
        console.error('Failed to update room status:', roomUpdateResponse);
        toast.error(roomUpdateResponse?.message || 'Failed to update room status.');
      }
    } catch (error) {
      console.error('Failed to reject the request:', error?.message || error);
      toast.error(error?.message || 'An unexpected error occurred.');
    }
  };
  
  

  const renderStatusCell = (status) => {
    let statusText = 'PENDING';
    let color = '#E87E21';

    if (status == 1 || status === 'accepted') {
      statusText = 'ACCEPTED';
      color = '#16A22B';
    } else if (status == 3 || status === 'rejected') {
      statusText = 'REJECTED';
      color = '#E71717';
    }

    return <span style={{ color, fontWeight: 'bold' }}>{statusText}</span>;
  };

  const handleViewDetails = (request) => {
    setSelectedRoom(request);
    setOpenModal(true);
    setOpen(true); 
    setSelectedRoom(room); 
  };

    const handleMenuClick = (event, request) => {
      setMenuAnchorEl(event.currentTarget);
      setSelectedRequest(request);
    };

    const handleMenuClose = () => {
      setMenuAnchorEl(null);
      setSelectedRequest(null);
    };

    const handlePrint = () => {
      setIsPrinting(true);
      setTimeout(() => {
        window.print();
        setIsPrinting(false);
      }, 500); 
    };

    const handleCloseModal = () => {
      setOpen(false); 
      setOpenModal(false);
      setSelectedRoom(null);
  };
  const renderActionCell = (request) => (
        <TableCell align="center">
          {isSmallScreen ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
              <Button onClick={() => handleAccept(request)} sx={{backgroundColor: '#16A22B',color: 'white'}}>Accept</Button>
              <Button onClick={() => handleReject(request.id, request.otp_status,request)} sx={{backgroundColor: '#C41919',color: 'white'}}>Reject</Button>
              <Button onClick={() => handleViewDetails(request)} sx={{backgroundColor: '#1632A2',color: 'white'}}>View Details</Button>
            </Box>
          ) : (
            <>
              <IconButton onClick={(event) => handleMenuClick(event, request)}>
                <MoreVertIcon />
              </IconButton>
              <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl) && selectedRequest?.id === request.id} onClose={handleMenuClose}>
                <MenuItem onClick={() => handleAccept(request)} >Accept</MenuItem>
                <MenuItem onClick={() => handleReject(request.id, request.otp_status,request)}>Reject</MenuItem>
                <MenuItem onClick={() => handleViewDetails(request)}>View Letter</MenuItem>
              </Menu>
            </>
          )}
      </TableCell>
);

  return (
    <Box sx={{ width: '100%', padding: isSmallScreen ? 1 : 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#374151', letterSpacing: '0.5px', textAlign: 'left', }}>Room Request</Typography>
        {isSmallScreen ? (
          <Box>
            {Roomrequest.map((request) => (
              <Card key={request.id} variant="outlined" sx={{ marginBottom: 2, padding: 2, boxShadow: '0px 4px 10px rgba(0,0,0,0.1)', borderRadius: 4,}}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#374151', marginBottom: 1,}} >Room ID: {request.room_id} </Typography>

                <Divider sx={{ marginBottom: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, }}>
                  <Typography> <b>User ID:</b> {request.user_id}</Typography>
                  <Typography> <b>User Name:</b> {request.user?.username || 'N/A'}</Typography>
                  <Typography><b>Purpose:</b> {request.purpose || 'No Purpose Provided'}</Typography>
                  <Typography><b>Status:</b> {renderStatusCell(request.otp_status)} </Typography>
                  <Typography><b>Asssigned Date:</b>{' '}{new Date(request.generated_at).toLocaleDateString('en-PH', { timeZone: 'Asia/Manila', })}</Typography>
                  <Typography><strong>Start Time:</strong>{new Date(`1970-01-01T${request.used_at}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })}</Typography>
                  <Typography><strong>Start Time:</strong>{new Date(`1970-01-01T${request.end_time}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1,mt:0 }}>
                      <Typography>Action</Typography>{renderActionCell(request)}
               </Box>
              </Card>
            ))}
          </Box>
        ) : (

        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, backgroundColor: '#ffffff', overflowX: 'auto' }}>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell align="center">Room Name</TableCell>
                <TableCell align="center">User ID</TableCell>
                <TableCell align="center">User Name</TableCell>
                <TableCell align="center">Purpose</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Assigned Date</TableCell>
                <TableCell align="center">Start Time</TableCell>
                <TableCell align="center">End Time</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Roomrequest.map((request) => (
                <TableRow key={request.id}>
                  <TableCell align="center">{request.room?.name}</TableCell>
                  <TableCell align="center">{request.user_id}</TableCell>
                  <TableCell align="center">{request.user?.username}</TableCell>
                  <TableCell align="center">{request.purpose}</TableCell>
                  <TableCell align="center">{renderStatusCell(request.otp_status)}</TableCell>
                  <TableCell align="center">
                    {new Date(request.generated_at).toLocaleDateString('en-PH', {
                      timeZone: 'Asia/Manila',
                    })}
                  </TableCell>
                  <TableCell align="center">{new Date(`1970-01-01T${request.used_at}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })}</TableCell>
                  <TableCell align="center">{new Date(`1970-01-01T${request.end_time}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })}</TableCell>
                  {renderActionCell(request)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Modal  open={openModal} onClose={() => setOpenModal(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" >
       <Dialog open={open} onClose={handleCloseModal} fullWidth maxWidth="md" sx={{overflow:'hidden'}} className='.hide-on-print'>
             <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>Room Data </DialogTitle>
             <Box sx={{ px: 3, py: 2 }}>
              <Typography><strong>Request From:</strong> {selectedRoom?.user?.username || 'N/A'}</Typography>
              <Typography><strong>Assigned Date:</strong> {new Date(selectedRoom?.generated_at).toLocaleDateString('en-PH', { timeZone: 'Asia/Manila' })}</Typography>
              <Typography><strong>Start Time:</strong>{new Date(`1970-01-01T${selectedRoom?.used_at}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })}</Typography>
              <Typography><strong>End Time:</strong>{new Date(`1970-01-01T${selectedRoom?.end_time}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })}</Typography>
              <Typography><strong>Purpose:</strong> {selectedRoom?.purpose || 'No purpose provided'}</Typography>
            </Box>
        <DialogActions sx={{ display: "flex", justifyContent: "flex-start", ml: 2, mb: 2 }} className="print-hide">
              <Button sx={{ backgroundColor: "#C41919", color: "white" }} onClick={handleCloseModal}>Close</Button>
              <Button sx={{ backgroundColor: "#1632A2", color: "white" }} onClick={handlePrint}>Print</Button>
          </DialogActions>
       </Dialog>

      </Modal>
    </Box>
  );
}

export default Roomrequest;