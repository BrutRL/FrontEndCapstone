import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { index, update,destroy } from '../api/otp_request';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';
import { store } from '../api/accesslogs';
import { Typography, Table, Select,TableBody, TableCell, TableContainer,Dialog, DialogTitle,TableHead,DialogContent ,DialogActions,Grid,TextField, TableRow, Paper, Card, Divider, Modal, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {update as Rooms_Update} from '../api/room';
function Roomrequest() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [cookies] = useCookies(['AUTH_TOKEN']);
  const [Roomrequest, setRoomrequest] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openDeleteModal,setDeleteModal] = useState(false)
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [errors,setErrors] = useState({});
  
  

  useEffect(() => {
    const fetctAcessCode = async () => {
      const token = cookies.AUTH_TOKEN;
      try {
        const response = await index(token);
        if (response.ok) {
          const filteredData = response.data.filter(request => request.room?.name == "R404" || request.room?.name == "404")
          .sort((a, b) => b.id - a.id); // Sort by ID descending (latest first)
          setRoomrequest(filteredData);
        } else {
          toast.error(response.message ?? 'Failed to fetch rooms.');
        }
      } catch (error) {
        toast.error('Failed to fetch rooms.');
      }
    };
    fetctAcessCode();
  }, [cookies]);

  const handleAccept = async (request) => {
    const token = cookies.AUTH_TOKEN;
    const body = { access_status: 1 };
    try {
      const response = await update(body, request.id, token);

      if (response.ok) {
        toast.success('Request accepted successfully!');
        setRoomrequest((prevRequests) =>
          prevRequests.map((req) =>
            req.id === request.id ? { ...req, access_status: 1 } : req
          )
        );

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
        const roomUpdateBody = new FormData();
        roomUpdateBody.append("status", 2);
        const roomUpdateResponse = await Rooms_Update(roomUpdateBody, request.room_id, cookies.AUTH_TOKEN);

      } else {
        toast.error(response.message || 'Failed to accept the request.');
        setErrors(response.message)
        toast.error(response.message)
      }
          }catch (error) {
            toast.error('Failed to accept the request.');
          }
        };

  const handleReject = async (id, currentStatus, request) => {
  
   /* if (currentStatus === 'accepted' || currentStatus === 'rejected') {
      toast.warning('This request has already been processed.');
      return;
    }*/
  
    const token = cookies.AUTH_TOKEN;
    const body = { access_status: 3 };
  
    try {
      // Update the OTP request status
      const response = await update(body, id, token);
      if (response.ok) {
        toast.success('Request rejected successfully!');
        setRoomrequest((prevRequests) =>
          prevRequests.map((req) =>
            req.id === id ? { ...req, access_status: 3 } : req
          )
        );
      } else {
        toast.error(response.message || 'Failed to reject the request.');
      }
  
      // Update Room Status
      const roomUpdateBody = new FormData();
      roomUpdateBody.append("status", 1);

      const roomUpdateResponse = await Rooms_Update(roomUpdateBody, request.room_id, cookies.AUTH_TOKEN);
    } catch (error) {
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
      setOpenModal(false);
      setOpen(false);
      setSelectedRoom(null);
    };

    const confirmDelete = async () => {
      try {
        const res = await destroy(selectedId, cookies.AUTH_TOKEN);
        if (res?.ok) {
          toast.success("Request has been deleted!");
          setRoomrequest((prev) => prev.filter((request) => request.id !== selectedId));
        } else {
          toast.error(res?.message ?? "Something went wrong");
        }
      } catch (error) {
        toast.error("Failed to delete request.");
      } finally {
        setDeleteModal(false);
        setSelectedId(null);
      }
    };
    
    const handleOpenDeleteModal = (id) => {
      setSelectedId(id);
      setDeleteModal(true);
    };
    
  
  const renderActionCell = (request) => (
        <TableCell align="center">
          {isSmallScreen ? (
            <>
            <IconButton onClick={(event) => handleMenuClick(event, request)}>
             <Typography>Select Action</Typography>
            </IconButton>
            <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl) && selectedRequest?.id === request.id} onClose={handleMenuClose}>
                <MenuItem onClick={() => handleAccept(request)} disabled={request.access_status == 1 || request.access_status == 3} >Accept</MenuItem>
                <MenuItem onClick={() => handleReject(request.id, request.access_status,request)} disabled={request.access_status == 1 || request.access_status == 3}>Reject</MenuItem>
                <MenuItem onClick={() => handleOpenDeleteModal(request.id)}>Delete</MenuItem>
                <MenuItem onClick={() => handleViewDetails(request)}>View Details</MenuItem>
            </Menu>
          </>
          ) : (
            <>
              <IconButton onClick={(event) => handleMenuClick(event, request)}>
                <MoreVertIcon />
              </IconButton>
              <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl) && selectedRequest?.id === request.id} onClose={handleMenuClose}>
                  <MenuItem onClick={() => handleAccept(request)} disabled={request.access_status == 1 || request.access_status == 3}>Accept</MenuItem>
                  <MenuItem onClick={() => handleReject(request.id, request.access_status,request)} disabled={request.access_status == 1 || request.access_status == 3}>Reject</MenuItem>
                  <MenuItem onClick={() => handleOpenDeleteModal(request.id)}>Delete</MenuItem>
                  <MenuItem onClick={() => handleViewDetails(request)}>View Details</MenuItem>
              </Menu>
            </>
          )}
      </TableCell>
);
  return (
    <Box sx={{ width: '100%', padding: isSmallScreen ? 1 : 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#374151', letterSpacing: '0.5px', textAlign: 'left', }}> Acess Code Request</Typography>
        {isSmallScreen ? (
          <Box>
            {Roomrequest.map((request) => (
              <Card key={request.id} variant="outlined" sx={{ marginBottom: 2, padding: 2, boxShadow: '0px 4px 10px rgba(0,0,0,0.1)', borderRadius: 4,}}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#374151', marginBottom: 1,}} >Room Name: {request.room?.name} </Typography>

                <Divider sx={{ marginBottom: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, }}>
                  <Typography> <b>User ID:</b> {request.user_id}</Typography>
                  <Typography> <b>User Name:</b> {request.user?.username || 'N/A'}</Typography>
                  <Typography> <b>Access Code:</b> {request.Access_code || 'N/A'}</Typography>
                  <Typography><b>Purpose:</b> {request.purpose || 'No Purpose Provided'}</Typography>
                  <Typography><b>Access Code:</b> {request.Access_code || 'No Access Code Provided'}</Typography>
                  <Typography><b>Status:</b> {renderStatusCell(request.access_status)} </Typography>
                  <Typography><b>Generated At:</b>{' '}{new Date(request.generated_at).toLocaleDateString('en-PH', { timeZone: 'Asia/Manila', })}</Typography>
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
                <TableCell align="center">Access Code</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Generated At</TableCell>
                <TableCell align="center">Used At</TableCell>
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
                  <TableCell align="center">{request.Access_code}</TableCell>
                  <TableCell align="center">{renderStatusCell(request.access_status)}</TableCell>
                  <TableCell align="center">{new Date(request.generated_at).toLocaleDateString('en-PH', { timeZone: 'Asia/Manila',})}
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
              <Typography><strong>Room Name:</strong> {selectedRoom?.room?.name || 'N/A'}</Typography>
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

      <Dialog open={openDeleteModal} onClose={() => setDeleteModal(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>Are you sure you want to delete this request?</DialogContent>
          <DialogActions sx={{display: 'flex',justifyContent: 'start',ml: 2,gap: 1}}>
            <Button onClick={() => setDeleteModal(false)} sx={{background: '#16A22B',color: 'white'}}>Cancel</Button>
            <Button onClick={confirmDelete} color="error" sx={{background: '#E71717'}} variant="contained">Delete</Button>
          </DialogActions>  
       </Dialog>

    </Box>
  );
}

export default Roomrequest;