import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions,DialogContent, DialogTitle, TextField, Typography, Grid, Paper, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { toast } from 'react-toastify';
import { update } from '../../api/user';
import { useCookies } from 'react-cookie';
import maleImage from '../../../public/roomImages/male.png';
import femaleImage from '../../../public/roomImages/female.png';

const UserProfile = () => {
  const [cookies] = useCookies(['AUTH_TOKEN']);
  const user = JSON.parse(localStorage.getItem('user'));
  const [editDialog, setEditDialog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});


  const onEdit = async (e) => {
    e.preventDefault();
    setErrors({}); // Reset previous errors
  
    try {
      const res = await update(
        {
          first_name: editDialog.first_name,
          middle_name: editDialog.middle_name,
          last_name: editDialog.last_name,
          gender: editDialog.gender,
          birth_date: editDialog.birth_date,
          contact_number: editDialog.contact_number,
          department: editDialog.department,
        },
        editDialog.id,
        cookies.AUTH_TOKEN
      );
  
      if (res?.ok) {
        toast.success(res?.message ?? 'User has been updated');
  
        const updatedUser = {
          ...user,
          profile: {
            ...user.profile,
            first_name: editDialog.first_name,
            middle_name: editDialog.middle_name,
            last_name: editDialog.last_name,
            gender: editDialog.gender,
            birth_date: editDialog.birth_date,
            contact_number: editDialog.contact_number,
            department: editDialog.department,
          },
        };
  
      
        localStorage.setItem('user', JSON.stringify(updatedUser));
  
        setEditDialog(null);
      } else {
        if (res?.errors) {
          setErrors(res.errors);
        } else {
          toast.error(res?.message ?? 'Something went wrong');
        }
      }
    } catch (error) {
      toast.error('Failed to update user.');
    }
  };
  
  

  return (
    <Box sx={{ minHeight: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%',}}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '' }}>Profile Update</Typography>
        <Typography sx={{ color: 'grey' }}>Update your Profile here</Typography>
      </Box>
        <Grid container spacing={4} maxWidth="md">
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ padding: '1.5rem', borderRadius: '15px', textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'black',}} >
                <Box sx={{ width: 150, height: 150, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 1rem',}}>
                  <img src={user?.profile?.gender === 'Male' ? maleImage : femaleImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>{user?.profile?.first_name || 'N/A'} {user?.profile?.last_name || 'N/A'}</Typography>
                <Typography>Teacher ID: {user?.id || 'N/A'}</Typography>
                <Typography>{user.profile?.department} Department</Typography>
              </Paper>
            </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: '1.5rem', borderRadius: '15px', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff', textAlign: 'center',}}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '1rem', color: 'black' }}> General Information </Typography>
            <Box sx={{ color: 'black' }}>
              <Typography>First Name: {user.profile?.first_name}</Typography>
              <Typography>Middle Name: {user.profile?.middle_name}</Typography>
              <Typography>Last Name: {user.profile?.last_name}</Typography>
              <Typography>Birth Date: {user.profile?.birth_date}</Typography>
              <Typography>Gender: {user.profile?.gender}</Typography>
              <Typography>Contact Number: {user.profile?.contact_number}</Typography>
              <Typography>Department: {user.profile?.department}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Button sx={{ background: '#02318A', color: 'white', width: '200px', borderRadius: '20px', textTransform: 'none', fontWeight: 'bold', marginTop: '2rem', ':hover': {background: '02618a',},}} onClick={() => setEditDialog({ id: user?.id || '', email: user?.email || '', first_name: user?.profile?.first_name || '', middle_name: user?.profile?.middle_name || '', last_name: user?.profile?.last_name || '', gender: user?.profile?.gender || '', birth_date: user?.profile?.birth_date || '', contact_number: user?.profile?.contact_number || '', department: 'CIT Department',})}>Update</Button>
            <Dialog open={!!editDialog} onClose={() => setEditDialog(null)} fullWidth maxWidth="md" PaperProps={{ sx: { backgroundColor: 'white', borderRadius: '15px', width: { xs: '90%', sm: '80%', md: '70%', lg: '60%' }, height: 'auto', m: { xs: 1, sm: 2, md: 3 },},}}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={onEdit} sx={{ p: { xs: 1, sm: 2 } }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField onChange={(e) => setEditDialog({ ...editDialog, email: e.target.value })} value={editDialog?.email ?? ''} fullWidth size="small" label="Email" type="email" error={!!errors.email} helperText={errors.email}/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField onChange={(e) => setEditDialog({ ...editDialog, first_name: e.target.value })} value={editDialog?.first_name ?? ''} fullWidth size="small" label="First Name" error={!!errors.first_name} helperText={errors.first_name} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField onChange={(e) => setEditDialog({ ...editDialog, middle_name: e.target.value })} value={editDialog?.middle_name ?? ''} fullWidth size="small" label="Middle Name" error={!!errors.middle_name} helperText={errors.middle_name}/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField onChange={(e) => setEditDialog({ ...editDialog, last_name: e.target.value })} value={editDialog?.last_name ?? ''} fullWidth size="small" label="Last Name" error={!!errors.last_name} helperText={errors.last_name} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small" error={!!errors.gender}>
                  <InputLabel>Gender</InputLabel>
                  <Select value={editDialog?.gender ?? ''} onChange={(e) => setEditDialog({ ...editDialog, gender: e.target.value })} label="Gender" >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField onChange={(e) => setEditDialog({ ...editDialog, birth_date: e.target.value })} value={editDialog?.birth_date ?? ''} fullWidth size="small" type="date" error={!!errors.birth_date} helperText={errors.birth_date}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField onChange={(e) => setEditDialog({ ...editDialog, contact_number: e.target.value })} value={editDialog?.contact_number ?? ''} fullWidth size="small" label="Contact Number" type="text" error={!!errors.contact_number} helperText={errors.contact_number}/>
              </Grid>
              <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small" error={!!errors.department}>
                    <InputLabel>Department</InputLabel>
                    <Select value={editDialog?.department ?? ''} onChange={(e) => setEditDialog({ ...editDialog, department: e.target.value })} label="Department">
                      <MenuItem value="COE">COE</MenuItem>
                      <MenuItem value="CIT">CIT</MenuItem>
                    </Select>
                  </FormControl>
              </Grid>
            </Grid>
            <Button id="edit-btn" type="submit" sx={{ display: 'none' }} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ display: !!editDialog ? 'flex' : 'none', justifyContent: 'flex-start', pl: 5, pb: 2 }}>
          <Button sx={{ background: '#1632A2', color: 'white', fontWeight: 'bold', mr: 2 }} onClick={() => setEditDialog(null)} > Close </Button>
          <Button sx={{ background: '#16A22B', color: 'white', fontWeight: 'bold' }} disabled={loading} onClick={() => document.getElementById('edit-btn').click()}> Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserProfile;
