import React, { useState, useCallback, useEffect } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { index, store, update, destroy } from '../api/room';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import $ from 'jquery';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import checkAuth from '../hoc/checkAuth';

function Room() {
  const user = useSelector((state) => state.auth.user);
  const [rooms, setRooms] = useState([]);
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(1);
  //const [selectedLocation,setSelectedLocation] = useState("")
  const [file, setFile] = useState(null);
  const [cookies] = useCookies();
  const [deleteDialog, setDeleteDialog] = useState(null);


  const getStatusString = (status) => {
    const statusMap = {
      1: 'Available',
      2: 'Occupied',
      3: 'Pending',
      '1': 'Available',
      '2': 'Occupied',
      '3': 'Pending',
      'Available': 'Available',
      'Occupied': 'Occupied',
      'Pending': 'Pending',
    };
    return statusMap[status] || 'Unknown';
  };
  
  
  
  const getStatusColor = (status) => {
    switch (Number(status)) {
      case 1: return 'green';
      case 2: return 'red';
      case 3: return 'orange';
      default: return 'gray';
    }
  };
  
  const refreshData = useCallback(() => {
    index().then((res) => {
      console.log("API Response:", res); 
      if (res?.ok) {
        const updatedRooms = res.data.map((room) => ({
          ...room,
          created_at: dayjs(room.created_at).format('YYYY-MM-DD HH:mm:ss'),
          status_string: getStatusString(room.status), 
        }));
        setRooms(updatedRooms); 
      } else {
        toast.error(res?.message ?? 'Something went wrong');
      }
    });
  }, []);
  
  

  const onCreate = (e) => {
    e.preventDefault();
    const fd = new FormData(document.getElementById("create-form"));

    store(fd, cookies.AUTH_TOKEN).then((res) => {
      if (res?.ok) {
        toast.success(res?.message ?? 'Room has been created!');
        setCreateDialog(false);
        refreshData();
      } else {
        toast.error(res?.message ?? 'Something went wrong');
      }
    });
  };

  const onUpdate = (e) => {
  e.preventDefault();
  const fd = new FormData();
  fd.append('user_id', $('#input_user_id').val());
  fd.append('name', $('#input_name').val());
  fd.append('capacity', $('#input_capacity').val());
  fd.append('location', $('#input_location').val());
  fd.append('status', selectedStatus);
  if (file) {
    fd.append('image', file);
  }

  update(fd, editDialog.id, cookies.AUTH_TOKEN).then((res) => {
    if (res?.ok) {
      toast.success(res?.message ?? 'Room has been updated!');
      setEditDialog(null);
      refreshData(); // Refresh the UI with the latest data
    } else {
      toast.error(res?.message ?? 'Something went wrong');
    }
  }).finally(() => {
    setLoading(false);
  });
};

  useEffect(() => {
    if (editDialog) {
      setSelectedStatus(editDialog.status);
    } else if (!editDialog && !createDialog) {
      setSelectedStatus(1);
      setFile(null);
    }
  }, [editDialog, createDialog]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const onDelete = () => {
    setLoading(true);
    destroy(deleteDialog, cookies.AUTH_TOKEN)
      .then((res) => {
        if (res?.ok) {
          toast.success(res?.message ?? "Room deleted successfully.");
          refreshData();
          setDeleteDialog(null);
        } else {
          toast.error(res?.message ?? "Something went wrong.");
        }
      })
      .finally(() => setLoading(false));
  };

  const navigate = useNavigate();

  const columns = [
    { field: 'id', headerName: 'ID' },
   // { field: 'user_id', headerName: 'User ID' },
    { field: 'name', headerName: 'Room Name', flex: 1 },
    { field: 'capacity', headerName: 'Capacity', flex: 1 },
    { field: 'location', headerName: 'Location', flex: 1 },
    { field: 'status_string', headerName: 'Status', flex: 1 },
    { field: 'created_at', headerName: 'Created At', flex: 1 },
    {
      field: "actions", headerName: "Actions", sortable: false, filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", alignItems: "center", height: "100%" }}>
          <Button onClick={() => setEditDialog({ ...params.row })} variant="contained" color='warning'>Edit</Button>
          <Button onClick={() => setDeleteDialog(params.row.id)} variant="contained" color='error'>Delete</Button>
        </Box>
      ), minWidth: 200, hideable: false, flex: 0
    },
  ];

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', pr: 2, pl: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#374151', letterSpacing: '0.5px' }}>Create Rooms</Typography>
        <Box>
          <Button sx={{backgroundColor: "#26A338",color: "white"}}onClick={() => setCreateDialog(true)}>
            Create
          </Button>
        </Box>
      </Box>
      <DataGrid columns={columns} rows={rooms}   hideFooter sx={{ height: 350, mt: 2 }} />
      <Dialog open={createDialog}>
        <DialogTitle>Create Room</DialogTitle>
        <DialogContent>
          <Box onSubmit={onCreate} component="form" encType="multipart/form-data" id="create-form">
            <TextField name="name" id="input_name" required label="Room Name" sx={{ mt: 1 }} size="small" fullWidth />
            <TextField
              name="capacity"
              id="input_capacity"
              type="number"
              label="Capacity"
              sx={{ mt: 1 }}
              size="small"
              fullWidth
              inputProps={{ min: 0 }}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || Number(value) >= 0) {
                  e.target.value = value;
                } else {
                  e.target.value = 0;
                }
              }}
              onBlur={(e) => {
                if (e.target.value === "" || Number(e.target.value) < 0) {
                  e.target.value = 0; // Resets empty or negative values to 0
                }
              }}
            />
           <FormControl required sx={{ mt: 1 }} fullWidth size="small">
              <InputLabel id="location-label">Location</InputLabel>
              <Select labelId="location-label" id="input_location" name="location" label="Location" defaultValue="">
                <MenuItem value="Admin Building">Admin Building</MenuItem>
                <MenuItem value="Academic Building">Academic Building</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ mt: 2 }}>
              <input onChange={(e) => setFile(e.target.files[0])} name="image" type="file" />
            </Box>
            <Button id="create_submit" type="submit" sx={{ display: 'none' }} />
          </Box>
        </DialogContent>
        <DialogActions sx={{display: 'flex',gap: 2,justifyContent: 'start',ml: '15px'}}>
          <Button  sx={{backgroundColor: "#02318A" ,color: 'white'}} onClick={() => setCreateDialog(false)}>Cancel</Button>
          <Button sx={{backgroundColor: "#26A338" ,color: 'white'}} onClick={() => $('#create_submit').trigger('click')}>Create</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={!!editDialog}>
        <DialogTitle>Edit Room</DialogTitle>
        <DialogContent>
          <Box onSubmit={onUpdate} component="form" encType="multipart/form-data" id="update-form">
            <TextField defaultValue={editDialog?.name} name="name" id="input_name" required label="Room Name" sx={{ mt: 1 }} size="small" fullWidth />
            <TextField
              defaultValue={editDialog?.capacity}
              name="capacity"
              id="input_capacity"
              required
              label="Capacity"
              type="number"
              sx={{ mt: 1 }}
              size="small"
              fullWidth
              inputProps={{ min: 0 }}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || Number(value) >= 0) {
                  e.target.value = value;
                } else {
                  e.target.value = 0;
                }
              }}
              onBlur={(e) => {
                if (e.target.value === "" || Number(e.target.value) < 0) {
                  e.target.value = 0;
                }
              }}
            />
            <TextField defaultValue={editDialog?.location} name="location" id="input_location" required label="Location" sx={{ mt: 1 }} size="small" fullWidth />
            <FormControl required sx={{ mt: 1 }} fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} label="Status">
                <MenuItem value={1}>Available</MenuItem>
                <MenuItem value={2}>Occupied</MenuItem>
                <MenuItem value={3}>Pending</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ mt: 2 }}>
              <input onChange={(e) => setFile(e.target.files[0])} name="image" type="file" />
            </Box>
            <Button id="update_submit" type="submit" sx={{ display: 'none' }} />
          </Box>
        </DialogContent>
        <DialogActions  sx={{display: 'flex',gap: 2,justifyContent: 'start',ml: '15px'}}>
          <Button  sx={{backgroundColor: "#02318A" ,color: 'white'}} onClick={() => setEditDialog(null)}>Cancel</Button>
          <Button sx={{backgroundColor: "#26A338" ,color: 'white'}} onClick={() => $('#update_submit').trigger('click')}>Update</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={!!deleteDialog}>
        <DialogTitle>Delete Room</DialogTitle>
        <DialogContent>
          <Typography>  Are you sure you want to delete this Room with ID: {deleteDialog}? </Typography>
        </DialogContent>
        <DialogActions sx={{display: 'flex',gap: 2,justifyContent: 'start',ml: '15px'}} >
          <Button onClick={() => setDeleteDialog(null)} sx={{backgroundColor: "#26A338",color: 'white'}}>Cancel</Button>
          <Button onClick={onDelete} sx={{background: '#E71717',color:'white'}} disabled={loading}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default checkAuth(Room);