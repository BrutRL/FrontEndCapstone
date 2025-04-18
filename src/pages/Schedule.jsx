import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, InputAdornment, Typography, Menu, MenuItem, FormControl, Select, InputLabel } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { index } from '../api/schedule';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import { useMediaQuery, useTheme } from "@mui/material";

export default function Schedule() {
  const [searchQuery, setSearchQuery] = useState('');
  const [rows, setRows] = useState([]);
  const [cookies] = useCookies(['AUTH_TOKEN']);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortOrder, setSortOrder] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('');
  const dayMapping = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [years, setYears] = useState([]);
  const year_course = ["BSIT -3D","BSIT -4D", "BSIT -1","BSIT -2D","BEED -3E"]
  const [selectedYear, setSelectedYear] = useState("All");
 const [filteredCourses, setFilteredCourses] = useState(year_course);

  useEffect(() => {
    const fetchData = async () => {
      const token = cookies.AUTH_TOKEN;
      if (!token) {
        toast.error('No authentication token found. Please log in again.');
        return;
      }

      try {
        const response = await index(token);
        if (response.ok) {
          setRows(response.data);
          const uniqueYears = [...new Set(response.data.map(row => row.year))];
          setYears(uniqueYears);
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

    const formatDays = (daysArray) => {
      if (!daysArray) return 'N/A';
      if (typeof daysArray === 'string') {
        daysArray = daysArray.replace(/\[|\]/g, '').split(',').map(Number);
      }
      if (!Array.isArray(daysArray) || daysArray.length === 0) return 'N/A';
      return daysArray.map((day) => dayMapping[day] || 'Invalid Day').join(', ');
    };
  
  
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleSortClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setAnchorEl(null);
  };

  const handleSort = (order) => {
    setSortOrder(order);
    setRows((prevRows) =>
      [...prevRows].sort((a, b) => {
        if (order === 'asc') {
          return a.year.localeCompare(b.year);
        } else {
          return b.year.localeCompare(a.year);
        }
      })
    );
    handleSortClose();
  };

  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(year); // Update the selected year
  
    // Filter the rows based on the selected year
    if (year === "All") {
      setFilteredRows(rows); // Show all rows when "All" is selected
    } else {
      // Filter rows by the selected year
      const filtered = rows.filter(row => row.year === year);
      setFilteredRows(filtered); // Update the filtered rows
    }
  };
  
  
  const filteredRows = rows.filter((row) => {
    const matchesLocation = selectedLocation === '' || row.year?.toLowerCase() === selectedLocation?.toLowerCase();
    const matchesSearchTerm =
      row.room_id.toString().includes(searchQuery) ||
      row.user_id.toString().includes(searchQuery) ||
      (row.course_id && row.course_id.toString().includes(searchQuery)) ||
      (row.assigned_date && row.assigned_date.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (row.end_date && row.end_date.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (row.start_time && row.start_time.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (row.end_time && row.end_time.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (row.year && row.year.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (typeof row.status === 'string' && row.status.toLowerCase().includes(searchQuery.toLowerCase()));
  
    // Filter by selected year
    const matchesYear = selectedYear === "All" || row.year.toString() === selectedYear;
  
    return matchesLocation && matchesSearchTerm && matchesYear;
  });
  

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ marginBottom: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#374151', letterSpacing: '0.5px' }}>Schedule Status</Typography>
        <Box sx={{ marginBottom: 3, display: 'flex', justifyContent: 'left' }}>
        <FormControl sx={{ mb: 2, mt: 3, display: 'flex', width: '150px', justifySelf: 'end' }}>
         <InputLabel>Filter by Year</InputLabel>
            <Select value={selectedYear} onChange={handleYearChange} label="Filter by Year">
              <MenuItem value="All">All</MenuItem>
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {`Year ${year}`}
                </MenuItem>
              ))}
            </Select>
      </FormControl>


        </Box>
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
      {filteredRows.length === 0 ? (
        <Box sx={{ textAlign: 'center', padding: 2 }}>
          <Typography variant="h6" sx={{ color: '#374151' }}> No schedules exist.</Typography>
        </Box>
      ) : isSmallScreen ? (
        <Box>
          {filteredRows.map((row) => (
            <Paper key={row.id} sx={{ marginBottom: 2, padding: 2, boxShadow: 3, backgroundColor: "#f9f9f9",}}>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#374151" }}>
                Room ID: {row.room_id}
              </Typography>
              <Typography> <span style={{ fontWeight: "bold" }}>User ID:</span> {row.user_id}</Typography>
              <Typography><span style={{ fontWeight: "bold" }}>Course ID:</span> {row.course_id}</Typography>
              <Typography><span style={{ fontWeight: "bold" }}>Assigned Date:</span> {row.assigned_date}</Typography>
              <Typography><span style={{ fontWeight: "bold" }}>End Date:</span> {row.end_date}</Typography>
              <Typography><span style={{ fontWeight: "bold" }}>Day:</span> {formatDays(row.days_in_week)}</Typography>
              <Typography><span style={{ fontWeight: "bold" }}>Start Time:</span> {row.start_time}</Typography>
              <Typography><span style={{ fontWeight: "bold" }}>End Time:</span> {row.end_time}</Typography>
              <Typography><span style={{ fontWeight: "bold" }}>Year:</span> {row.year}</Typography>
            </Paper>
          ))}
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 3, overflowX: "auto" }}>
          <Table sx={{ minWidth: 650, width: "100%" }} aria-label="responsive table">
            <TableHead>
              <TableRow>
                {[ "Room Id", "User Id", "Course Id", "Assigned Date", "End Date", "Day", "Start Time", "End Time", "Year",
                ].map((header) => (
                  <TableCell key={header} align="center" sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5", whiteSpace: "nowrap", fontSize: { xs: "12px", sm: "14px", md: "16px" }, }}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((row) => (
                <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 }, "&:hover": { backgroundColor: "#f1f1f1" },}}>
                  <TableCell align="center">{row.room_id}</TableCell>
                  <TableCell align="center">{row.user_id}</TableCell>
                  <TableCell align="center">{row.course_id}</TableCell>
                  <TableCell align="center">{row.assigned_date}</TableCell>
                  <TableCell align="center">{row.end_date}</TableCell>
                  <TableCell align="center">
                {formatDays(row.days_in_week)}
              </TableCell>
              <TableCell align="center">{new Date(`1970-01-01T${row.start_time}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })}</TableCell>
              <TableCell align="center">{new Date(`1970-01-01T${row.end_time}`).toLocaleString('en-PH', {hour: 'numeric',minute: 'numeric',hour12: true, })}</TableCell>
                  <TableCell align="center">{row.year}</TableCell>
               
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}