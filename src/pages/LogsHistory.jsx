import { insertLoginhistory } from '../api/auth';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import { Box, Paper, Table,  Input,TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TextField, InputAdornment,IconButton} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

function LogsHistory() {
  const [historyIndex, setHistoryIndex] = useState([]);
  const [cookies] = useCookies(['AUTH_TOKEN']);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      const token = cookies.AUTH_TOKEN;
      try {
        const response = await insertLoginhistory(token);
        if (response.ok) {
          setHistoryIndex(response.data); 
        } else {
          toast.error(response.message ?? 'Failed to fetch logs.');
        }
      } catch (error) {
        toast.error('Failed to fetch logs.');
      }
    };

    fetchHistory();
  }, [cookies]);

  const filteredData = historyIndex.filter((row) => {
    const lower = searchQuery.toLowerCase();
    return (
      (row.username?.toLowerCase().includes(lower) || '') ||
      (row.role?.toLowerCase().includes(lower) || '') ||
      (row.created_at?.toLowerCase().includes(lower) || '') ||
      (row.event?.toLowerCase().includes(lower) || '') ||
      (row.action?.toLowerCase().includes(lower) || '')
    );
  });
  const handleClearSearch = () => setSearchQuery('');
  return (
    <Box sx={{ padding: 4, minHeight: '100vh' }}>
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1f2937', letterSpacing: '0.5px' }} >Activity Logs</Typography>

        <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} startAdornment={
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
      </Box>
      <TableContainer component={Paper} sx={{ boxShadow: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Table sx={{ minWidth: 750 }} aria-label="logs table">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgb(2 49 138)' }}>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#ffffff' }}>User Name</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#ffffff' }}>Role</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#ffffff' }}>Date</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#ffffff' }}>Time</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#ffffff' }}>Event</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#ffffff' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', color: '#9ca3af', padding: 4 }}> No logs found.</TableCell>
              </TableRow>
            ) : (
              filteredData.map((row) => (
                <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: '#f3f4f6' }, borderBottom: '1px solid #e5e7eb', }}>
                  <TableCell align="center" sx={{ color: '#374151' }}>{row.username}</TableCell>
                  <TableCell align="center" sx={{ color: '#374151' }}>{row.role}</TableCell>
                  <TableCell align="center" sx={{ color: '#374151' }}>{new Date(row.created_at).toLocaleDateString('en-PH', {year: 'numeric',month: 'long',day: 'numeric',})}</TableCell>
                  <TableCell align="center" sx={{ color: '#374151' }}>{new Date(row.created_at).toLocaleString('en-US', {hour: 'numeric',minute: 'numeric',hour12: true, })}</TableCell>
                  <TableCell align="center" sx={{ color: '#374151' }}>{row.event}</TableCell>
                  <TableCell align="center" sx={{ color: '#374151' }}>{row.action}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default LogsHistory;
