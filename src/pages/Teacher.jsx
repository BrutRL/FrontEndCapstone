import {Box,Input,Paper,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,IconButton,InputAdornment,Typography,Container,Button,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,TextField,MenuItem,Select,FormControl,InputLabel,Grid} from '@mui/material';
import { useState, useEffect } from 'react';
import { index, Usersoftdelete, update, store } from '../api/user';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
function User() {
  const [userIndex, setUserIndex] = useState([]);
  const [cookies] = useCookies(['AUTH_TOKEN']);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [departments, setDepartments] = useState(["COE", "CIT","ADMIN"]);
  const [errors, setErrors] = useState({});
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [formData, setFormData] = useState({
      user_id: null,
      username: '',
      email: '',
      password: '',
      role_id: '',
      password_confirmation: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      gender: '',
      birth_date: '',
      department: '',
      contact_number: '',
  });
  const [isEdit, setIsEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchUserIndex = async () => {
      const token = cookies.AUTH_TOKEN;
      try {
        const response = await index(token);
        if (response.ok) {
          setUserIndex(response.data);
        }
      } catch (error) {
        toast.error('Failed to fetch users.');
      }
    };

    fetchUserIndex();
  }, [cookies]);
  const handleEditClick = (user) => {
    setFormData({
      user_id: user.profile.user_id,
      first_name: user.profile.first_name || '',
      middle_name: user.profile.middle_name || '',
      last_name: user.profile.last_name || '',
      role_id: user.role_id || '',
      birth_date: user.profile.birth_date || '',
      gender: user.profile.gender || '',
      contact_number: user.profile.contact_number || '',
      department: user.profile.department || '',
    });
    setIsEdit(true);
    setFormOpen(true);
  };


  const handleCreateClick = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      gender: '',
      birth_date: '',
      department: '',
      contact_number: '',
    });
    setIsEdit(false);
    setFormOpen(true);
  };

  const handleSearch = (event) => setSearchQuery(event.target.value);
  const handleClearSearch = () => setSearchQuery('');

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const token = cookies.AUTH_TOKEN;
    try {
      const response = await store(formData, token);
      if (response.ok) {
        toast.success('User created successfully');
        setUserIndex((prevUsers) => [...prevUsers, response.data]);
        setFormOpen(false);
        setErrors({});
      } else {
        setErrors(response.errors || {});
      }
    } catch (error) {
      toast.error('Failed to create user.');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const token = cookies.AUTH_TOKEN;
  
    try {
      const response = await update(formData, formData.user_id, token);
  
      if (response.ok) {
        toast.success('User updated successfully');
  
        // Update the user in the local state
        setUserIndex((prevUsers) =>
          prevUsers.map((user) =>
            user.id === formData.user_id ? { ...response.data } : user
          )
        );
  
        setFormOpen(false);
        setErrors({});
      } else {
        setErrors(response.errors || {});
      }
    } catch (error) {
      toast.error('Failed to update user.');
    }
  };
  

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    const token = cookies.AUTH_TOKEN;
    try {
      const response = await Usersoftdelete(selectedUser.profile.user_id, token);
      if (response.ok) {
        toast.success('User deleted successfully!');
        setUserIndex(userIndex.filter(user => user.profile.user_id !== selectedUser.profile.user_id));
      } else {
        toast.error(response.message ?? 'Failed to delete user.');
      }
    } catch (error) {
      console.error('Failed to delete user', error);
      toast.error('Failed to delete user.');
    }

    setOpen(false);
    setSelectedUser(null);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);

  };
  useEffect(() => {
    if (selectedUser) {
      setRole(selectedUser.role_id); // e.g. "Admin"
    }
  }, [selectedUser]);
  
  const filteredUsers = userIndex.filter((user) =>
    (user.profile.user_id && user.profile.user_id.toString().includes(searchQuery)) ||
    (user.profile.first_name && user.profile.first_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.profile.last_name && user.profile.last_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.profile.birth_date && user.profile.birth_date.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.profile.gender && user.profile.gender.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.profile.contact_number && user.profile.contact_number.toString().includes(searchQuery)) ||
    (user.profile.department && user.profile.department.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#374151', letterSpacing: '0.5px' }}>Teachers</Typography>
      </Box>
      <Box sx={{width: '100%',display: 'flex',justifyContent:'end',gap:3}}> 
        <Button variant="contained" onClick={handleCreateClick} sx={{ marginBottom: 2,background: '#D9D9D9',color: 'black',fontWeight: 'bold'}}> Create</Button>
      </Box>
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
      <Input placeholder="Search..." value={searchQuery} onChange={handleSearch} startAdornment={<InputAdornment position="start"><SearchIcon /></InputAdornment>} endAdornment={searchQuery && (
            <InputAdornment position="end">
              <IconButton onClick={handleClearSearch}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          )}sx={{ width: '100%', marginBottom: 2 }} />
      </Paper>
      {filteredUsers.length === 0 ? (
        <Box sx={{ textAlign: 'center', padding: 2 }}>
          <Typography variant="h6" sx={{ color: '#374151' }}> No Teacher Exist</Typography>
        </Box>
      ) : isSmallScreen ?  
        <Box>
        {filteredUsers.map((user) => (
        <Paper key={user.profile.user_id} sx={{ marginBottom: 2, padding: 2, boxShadow: 3, backgroundColor: "#f9f9f9",}}>
         
          <Typography> <span style={{ fontWeight: "bold" }}>User ID:</span> {user.profile.user_id}</Typography>
          <Typography><span style={{ fontWeight: "bold" }}>First Name:</span> {user.profile.first_name}</Typography>
          <Typography><span style={{ fontWeight: "bold" }}>Middle Name:</span> {user.profile.middle_name}</Typography>
          <Typography><span style={{ fontWeight: "bold" }}>Last Name:</span> {user.profile.last_name}</Typography>
          <Typography><span style={{ fontWeight: "bold" }}>Gender:</span> {user.profile.gender}</Typography>
          <Typography><span style={{ fontWeight: "bold" }}>Email:</span> {user.email}</Typography>
          <Typography><span style={{ fontWeight: "bold" }}>Department:</span> {user.profile.department}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: isSmallScreen ? 'wrap' : 'nowrap', gap: 1 }}>
            <Typography><span style={{ fontWeight: 'bold' }}>Action:</span></Typography>
            <Button variant="contained" color="primary" size="small" sx={{ marginRight: isSmallScreen ? 0 : 1, marginTop: isSmallScreen ? 1 : 0, background: '#E87E21',}}onClick={() => handleEditClick(user)}>Edit</Button>
            <Button variant="contained" size="small" sx={{ marginTop: isSmallScreen ? 1 : 0, background: '#C41919', }}onClick={() => handleDeleteClick(user)}>Delete </Button>
          </Box>
        </Paper>
      ))}
    </Box>
   : (
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>User Id</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>First Name</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Middle Name</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Last Name</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Gender</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Email</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Department</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.profile.user_id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: '#f1f1f1' } }}>
                  <TableCell align="center">{user.profile.user_id}</TableCell>
                  <TableCell align="center">{user.profile.first_name}</TableCell>
                  <TableCell align="center">{user.profile.middle_name}</TableCell>
                  <TableCell align="center">{user.profile.last_name}</TableCell>
                  <TableCell align="center">{user.profile.gender}</TableCell>
                  <TableCell align="center">{user.email}</TableCell>
                  <TableCell align="center">{user.profile.department}</TableCell>
                  <TableCell align="center">
                    <Button variant="contained" color="primary" size="small" sx={{ marginRight: isSmallScreen ? 0 : 1, marginTop: isSmallScreen ? 1 : 0, background: '#E87E21' }} onClick={() => handleEditClick(user)}>Edit</Button>
                    <Button variant="contained" size="small" sx={{ marginTop: isSmallScreen ? 1 : 0, background: '#C41919' }} onClick={() => handleDeleteClick(user)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Delete User</DialogTitle>
                <DialogContent>
                  <Typography>Are you sure you want to delete this user?</Typography>
                </DialogContent>
              <DialogActions sx={{display: 'flex',gap:1,justifyContent: 'start',ml:'15px'}}>
                  <Button onClick={handleClose}sx={{background: '#16A22B',color: 'white'}}>Cancel</Button>
                  <Button onClick={handleConfirmDelete} sx={{background: '#E71717'}} variant="contained">Delete</Button>
              </DialogActions>
        </Dialog>

        <Dialog open={formOpen} onClose={() => {setFormOpen(false);setErrors({});}} maxWidth="lg" fullWidth>
  <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
    {isEdit ? 'Edit User' : 'Create User'}
  </DialogTitle>
  <DialogContent sx={{ overflowY: 'auto', maxHeight: '450px', padding: '16px', scrollbarWidth: 'none' }}>
    <DialogContentText sx={{ marginBottom: '16px', fontSize: '1rem' }}>
      {isEdit ? 'Edit the user details below.' : 'Enter the user details below to create a new user.'}
    </DialogContentText>

    <Grid container spacing={2}>
      {!isEdit && (
        <>
          <Grid item xs={12} md={4} lg={6}>
            <TextField label="Username" fullWidth value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} error={!!errors.username} helperText={errors.username || ''} />
          </Grid>
          <Grid item xs={12} md={4} lg={6}>
            <TextField label="Email" fullWidth value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} error={!!errors.email} helperText={errors.email || ''} />
          </Grid>
          <Grid item xs={12} md={4} lg={6}>
            <TextField label="Password" type={showPassword ? 'text' : 'password'} fullWidth value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} error={!!errors.password} helperText={errors.password || ''} InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }} />
            
          </Grid>
          <Grid item xs={12} md={4} lg={6}>  <TextField label="Confirm Password" type={showConfirmPassword ? 'text' : 'password'} fullWidth value={formData.password_confirmation} onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })} error={!!errors.password_confirmation} helperText={errors.password_confirmation || ''} InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword  ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }} /></Grid>
        </>
      )}

      <Grid item xs={12}md={isEdit ? 3 : 4} >
        <TextField label="First Name" fullWidth value={formData.first_name}   onChange={(e) => {const value = e.target.value.replace(/[0-9]/g, "");
      setFormData({ ...formData, first_name: value });
    }} error={!!errors.first_name} helperText={errors.first_name || ''} />
      </Grid>
      <Grid item xs={12} md={isEdit ? 3 : 4} >
        <TextField label="Middle Name" fullWidth value={formData.middle_name}  onChange={(e) => {const value = e.target.value.replace(/[0-9]/g, ""); 
      setFormData({ ...formData, middle_name: value });
    }} error={!!errors.middle_name} helperText={errors.middle_name || ''} />
      </Grid>
      <Grid item xs={12} md={isEdit ? 3 : 4} >
        <TextField label="Last Name" fullWidth value={formData.last_name} onChange={(e) => {const value = e.target.value.replace(/[0-9]/g, ""); 
      setFormData({ ...formData, last_name: value });
    }} error={!!errors.last_name} helperText={errors.last_name || ''} />
      </Grid>
              {isEdit && (
            <Grid item xs={12} md={3}>
              <FormControl fullWidth  variant="outlined">
                <InputLabel id="role-label">Role</InputLabel>
                <Select labelId="role-label" value={formData.role_id || ''} onChange={(e) =>setFormData((prev) => ({ ...prev, role_id: e.target.value }))}label="Role" >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </Select>
              </FormControl>
            </Grid>
        )}

      {!isEdit && (
      <Grid item xs={12} md={4} lg={6}>
        <TextField label="Birth Date" type="date" fullWidth value={formData.birth_date} onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })} error={!!errors.birth_date} helperText={errors.birth_date || ''} InputLabelProps={{ shrink: true }} />
      </Grid>
         )}

    {!isEdit && (
      <Grid item xs={12} md={4} lg={6}>
        <TextField label="Contact Number" fullWidth value={formData.contact_number} onChange={(e) => {const value = e.target.value.replace(/[^0-9]/g, ""); 
        if (value.length <= 11) {
          setFormData({ ...formData, contact_number: value });
        }
    }} error={!!errors.contact_number} helperText={errors.contact_number || ''} />
      </Grid>
       )}

    
      <Grid item xs={12} md={4} lg={6}>
            <FormControl fullWidth variant="outlined" error={!!errors.gender}>
                <InputLabel>{errors.gender ? 'Gender (Required)' : 'Gender'}</InputLabel>
                  <Select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} label="Gender">
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
        </FormControl>
      </Grid>
     

      <Grid item xs={12} md={4} lg={6}>
          <FormControl fullWidth variant="outlined" error={!!errors.department}>
             <InputLabel>Department</InputLabel>
                <Select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} label="Department">
                  {departments.map((dept, index) => (
                    <MenuItem key={index} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
      </FormControl>
      </Grid>
    </Grid>
  </DialogContent>
      <DialogActions sx={{display: 'flex',justifyContent: 'left',ml: 2,gap:2}}>
        <Button onClick={() => {setFormOpen(false);setErrors({});}}sx={{ background: '#D9D9D9', color: 'black' }}>Cancel</Button>
        <Button onClick={isEdit ? handleUpdateUser : handleCreateUser} sx={{ background: '#1632A2', color: 'white' }}>{isEdit ? 'Update' : 'Save'}</Button>
      </DialogActions>
</Dialog>
    </Box>
  );
}

export default User;
