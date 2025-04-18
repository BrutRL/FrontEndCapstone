import React, { useState, useEffect } from "react";
import bgImg from '../../public/roomImages/Room1.png';
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
          setLogsdata(response.data);
        } else {
          toast.error(response.message ?? 'Failed to fetch schedules.');
        }
      } catch (error) {
        console.error('Failed to fetch schedules', error);
        toast.error('Failed to fetch schedules.');
      }
    };

    fetchData();
  }, [cookies]);

  const getStatus = (accessed_at, used_at, end_time) => {
    const now = new Date();
    const accessedDate = new Date(accessed_at);
    const accessedDateStr = accessedDate.toISOString().split('T')[0];
    const usedDateTime = new Date(`${accessedDateStr}T${used_at}:00`);
    const endDateTime = new Date(`${accessedDateStr}T${end_time}:00`);

    if (now >= usedDateTime && now <= endDateTime) {
      return "ONGOING";
    } else if (now > endDateTime) {
      return "ENDED";
    } else {
      return "UPCOMING";
    }
  };

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
            Logsdata.map((row) => {
              const status = getStatus(row.accessed_at, row.used_at, row.end_time);
              return (
                <Card key={row.id} variant="outlined" sx={{ marginBottom: 2, padding: 2, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", borderRadius: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#374151', marginBottom: 1 }}>Room ID: {row.room_id}</Typography>
                  <Divider sx={{ marginBottom: 2 }} />
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography><b>User ID:</b> {row.user_id}</Typography>
                    <Typography><b>Request ID:</b> {row.otp_request_id}</Typography>
                    <Typography><b>Accessed At:</b> {new Date(row.accessed_at).toLocaleDateString("en-PH", { timeZone: "Asia/Manila" })}</Typography>
                    <Typography><strong>Start Time:</strong>{new Date(`1970-01-01T${row.used_at}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })}</Typography>
              <Typography><strong>End Time:</strong>{new Date(`1970-01-01T${row.end_time}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })}</Typography>
                    <Typography><b>Status:</b> <span style={{ color: getStatusColor(status), fontWeight: "bold" }}>{status}</span></Typography>
                  </Box>
                </Card>
              );
            })
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
                Logsdata.map((row) => {
                  const status = getStatus(row.accessed_at, row.used_at, row.end_time);
                  return (
                    <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 }, "&:hover": { backgroundColor: "#f1f1f1" } }}>
                      <TableCell align="center" component="th" scope="row">{row.room_id}</TableCell>
                      <TableCell align="center">{row.user_id}</TableCell>
                      <TableCell align="center">{row.otp_request_id}</TableCell>
                      <TableCell align="center">{new Date(row.accessed_at).toLocaleDateString("en-PH", { timeZone: "Asia/Manila" })}</TableCell>
                      <TableCell align="center">{new Date(`1970-01-01T${row.used_at}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })}</TableCell>
                      <TableCell align="center">{new Date(`1970-01-01T${row.end_time}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })}</TableCell>
                      <TableCell align="center" sx={{ color: getStatusColor(status), fontWeight: "bold" }}>{status}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
