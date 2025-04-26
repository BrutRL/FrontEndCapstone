import React, { useState, useEffect } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Card, Divider } from '@mui/material';
import { index } from '../api/accesslogs';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function Accesslogs() {
  const [cookies] = useCookies(['AUTH_TOKEN']);
  const [Logsdata, setLogsdata] = useState([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      const token = cookies.AUTH_TOKEN;
      try {
        const response = await index(token);
        if (response.ok) {
          // Map response data to include initial `status` and sort by ID descending
          const updatedData = response.data
            .map((log) => ({
              ...log,
              status: getStatus(log.accessed_at, log.used_at, log.end_time),
            }))
            .sort((a, b) => b.id - a.id); // Sort by ID descending
          setLogsdata(updatedData);
        } else {
          toast.error(response.message ?? 'Failed to fetch schedules.');
        }
      } catch (error) {
        toast.error('Failed to fetch schedules.');
      }
    };
  
    fetchData();
  }, [cookies]);
  
  

  const getStatus = (accessed_at, used_at, end_time) => {
    const now = new Date();
    const accessedDate = new Date(accessed_at);
    
    // Ensure proper time parsing
    const usedDateTime = new Date(accessedDate.toISOString().split('T')[0] + 'T' + used_at);
    const endDateTime = new Date(accessedDate.toISOString().split('T')[0] + 'T' + end_time);
  
    if (now >= usedDateTime && now <= endDateTime) {
      return "ONGOING";
    } else if (now > endDateTime) {
      return "ENDED";
    } else {
      return "UPCOMING";
    }
  };
  

  // Periodically update the statuses every 1 minute
  useEffect(() => {
    const interval = setInterval(() => {
      setLogsdata((prevLogsdata) =>
        prevLogsdata.map((log) => ({
          ...log,
          status: getStatus(log.accessed_at, log.used_at, log.end_time),
        }))
      );
    }, 60000); // Update every 60 seconds
  
    return () => clearInterval(interval);
  }, []);
  

  const getStatusColor = (status) => {
    switch (status) {
      case "UPCOMING":
        return "#02318A";
      case "ENDED":
        return "#E71717"; 
      case "ONGOING":
        return "#16A22B"; 
      default:
        return "#000000"; 
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ marginBottom: 2, textAlign: "left" }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#374151', letterSpacing: '0.5px' }}>Rooms Logs</Typography>
      </Box>
      {isSmallScreen ? (
        <Box>
          {Logsdata.length === 0 ? (
            <Typography sx={{ textAlign: "center", padding: 2, fontSize: "16px", color: "#9e9e9e", }}>No schedules exist.</Typography>
          ) : (
            Logsdata.map((row) => (
              <Card key={row.id} variant="outlined" sx={{ marginBottom: 2, padding: 2, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", borderRadius: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#374151', marginBottom: 1 }}>Room ID: {row.room_id}</Typography>
                <Divider sx={{ marginBottom: 2 }} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography><b>User ID:</b> {row.user_id}</Typography>
                  <Typography><b>Request ID:</b> {row.otp_request_id}</Typography>
                  <Typography><b>Accessed At:</b> {new Date(row.accessed_at).toLocaleDateString("en-PH", { timeZone: "Asia/Manila" })}</Typography>
                  <Typography><strong>Start Time:</strong>{new Date(`1970-01-01T${row.used_at}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })}</Typography>
                  <Typography><strong>End Time:</strong>{new Date(`1970-01-01T${row.end_time}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })}</Typography>
                  <Typography><b>Status:</b> <span style={{ color: getStatusColor(row.status), fontWeight: "bold" }}>{row.status}</span></Typography>
                </Box>
              </Card>
            ))
          )}
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 3, overflowX: "auto", maxWidth: "100%" }}>
          <Table sx={{ minWidth: 650, width: "100%" }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5", whiteSpace: "nowrap" }}>Room ID</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5", whiteSpace: "nowrap" }}>User ID</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5", whiteSpace: "nowrap" }}>Request ID</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5", whiteSpace: "nowrap" }}>Accessed At</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5", whiteSpace: "nowrap" }}>Start At</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5", whiteSpace: "nowrap" }}>End At</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5", whiteSpace: "nowrap" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Logsdata.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: "center", height: "150px", fontSize: "16px" }}>No schedules exist.</TableCell>
                </TableRow>
              ) : (
                Logsdata.map((row) => (
                  <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 }, "&:hover": { backgroundColor: "#f1f1f1" } }}>
                    <TableCell align="center" component="th" scope="row">{row.room_id}</TableCell>
                    <TableCell align="center">{row.user_id}</TableCell>
                    <TableCell align="center">{row.otp_request_id}</TableCell>
                    <TableCell align="center">{new Date(row.accessed_at).toLocaleDateString("en-PH", { timeZone: "Asia/Manila" })}</TableCell>
                    <TableCell align="center">{new Date(`1970-01-01T${row.used_at}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })}</TableCell>
                    <TableCell align="center">{new Date(`1970-01-01T${row.end_time}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })}</TableCell>
                    <TableCell align="center" sx={{ color: getStatusColor(row.status), fontWeight: "bold" }}>{row.status}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
