import { useEffect, useState } from 'react';
import { index } from '../api/otp_request';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import { Container, Paper, Divider, Box, Typography, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions ,FormControlLabel,Checkbox,TextField} from '@mui/material';
import { useMediaQuery } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Label } from '@mui/icons-material';
import Header from '../assets/images/HeaderUrs.png';
import '../App.css';
function PrintRoom() {
    const [cookies] = useCookies(['AUTH_TOKEN']);
    const [Room_data, setRoom_data] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null); 
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    
    useEffect(() => {
        const fetchRoomData = async () => {
            const token = cookies.AUTH_TOKEN;
            try {
                const response = await index(token);
                if (response.ok) {
                    console.log(response.data); 
                    setRoom_data(response.data);
                } else {
                    toast.error(response.message ?? 'Failed to fetch Room Data.');
                }
            } catch (error) {
                console.error('Failed to fetch Room Data', error);
                toast.error('Failed to fetch Room Data.');
            }
        };

        fetchRoomData();
    }, [cookies]);

    const handleOpenModal = (room) => {
        setSelectedRoom(room); 
        setOpen(true); 
    };

    const handleCloseModal = () => {
        setOpen(false); 
        setSelectedRoom(null);
    };
    
    const handlePrint = () => {
      setTimeout(() => {
          window.print();
      }, 200); 
  };
  
    return (
        <Container>
            {Room_data.length > 0 ? (
                <Grid container spacing={2} direction={isSmallScreen ? 'column' : 'row'}>
                    {Room_data.map((room, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Paper sx={{ textAlign: 'center', boxShadow: '10px 5px 20px rgba(0, 0, 0.1, 0.1)', mt: 2, mx: 'auto', transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'scale(1.05)', boxShadow: '10px 10px 30px rgba(0, 0, 0.1, 0.2)' } }}>
                                <Box sx={{ width: '0px', height: '30px', mt: 2 }} />
                                <Box sx={{ p: 1, pl: 2, pb: 2, textAlign: 'center' }}>
                                    <Typography sx={{ color: '#4a5568' }}>Room ID: {room.id}</Typography>
                                    <Typography sx={{ color: '#4a5568' }}> Room Name: {room.room?.name} </Typography>
                                    <Typography sx={{ color: '#4a5568' }}> Location: {room.room?.location} </Typography>
                                    <Button 
                                        sx={{ backgroundColor: '#1632A2', color: 'white', mt: 1 }}
                                        onClick={() => handleOpenModal(room)}
                                    >
                                        View Details
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> 
                    <Typography>No Room Request Letter.</Typography>
                    <AssignmentIcon sx={{ fontSize: 50 }} />
                </Box> 
            )}

<Dialog open={open} onClose={handleCloseModal} fullWidth maxWidth="md" sx={{overflow:'hidden'}} className='.hide-on-print'>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 2, flexDirection: "column" }}>
          <img src={Header} alt="Header" style={{ width: "68%" }} />
          <Box sx={{ height: "3px", width: "100%", backgroundColor: "black", mt: 2 }} />
      </Box>
    <Box sx={{ display: "flex", mt: 2 ,flexDirection: "column", alignItems: "center" ,color: '#427ef5'}}>
      <Typography variant ="h6"sx={{fontWeight: 'bold',fontStyle: 'italic'}}>Office of the General Services, URS Cainta</Typography>
      <Typography sx={{fontWeight: 'bold'}}>Tel. No. loc. ___ Email Address: gso.cainta@urs.edu.ph</Typography>
    </Box>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
        REQUEST FOR THE UTILIZATION OF URS CAINTA FACILITIES
      </DialogTitle>
      <DialogContent>
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={8}>
            <Grid item xs={6}>
            {["Multi-Purpose Hall", "Computer Lab 404", "Computer Lab 405"].map((facility, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <TextField variant="standard"  InputProps={{ disableUnderline: true, style: { borderBottom: "1px solid black" },}} />
                <Typography>{facility}</Typography>
                </Box>
            ))}
            </Grid>
            <Grid item xs={6}>
            {["Speech Lab", "Academic Room, please specify:"].map((facility, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Box sx={{ borderBottom: "1px solid black", width: "50px", mr: 1 }}></Box>
                <Typography>{facility}</Typography>
                {facility.includes("please specify") && (
                    <TextField variant="standard"  InputProps={{ disableUnderline: true, style: { borderBottom: "1px solid black" },}} />
                )}
                </Box>
            ))}
            </Grid>
        </Grid>
    </Box>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          {[
            ["Title of Activity/Program:", ""],
            ["Date of Activity/Program:", ""],
            ["Inclusive Time of Activity:", ""],
            ["Number of Participants:", ""],
            ["Requested Equipment:", ""],
          ].map(([label, value], index) => (
            <Grid container item xs={12} alignItems="center" key={index}>
              <Grid item xs={4}>
                <Typography>{label}</Typography>
              </Grid>
              <Grid item xs={8}>
              <TextField variant="standard" fullWidth InputProps={{ disableUnderline: true, style: { borderBottom: "1px solid black" },}} />
              </Grid>
            </Grid>
          ))}
        </Grid>
        <Typography sx={{ mt: 3, fontWeight: "bold" }}>TERMS & CONDITIONS:</Typography>
        <Typography sx={{ ml: 3}}>To sustain the services and maintain the properties and facilities of the University in
        order, the following terms and conditions must be observed:</Typography>
        <Typography>1. Upkeep the University properties and maintain cleanliness before and after the affair.</Typography>
        <Typography>2. Turn off the lights, fans, and AC right after use.</Typography>
        <Typography>3. Avoid eating inside the venue; if essential, dispose of garbage properly.</Typography>
        <Typography>4. Arrange tables and chairs in order after use.</Typography>
        <Typography>5. Avoid littering inside the venue.</Typography>
        <Typography >
          Non-compliance with the above-mentioned conditions or violations of these protocols, the requisitioner will be held responsible for a written explanation and/or replacement/repair of the damage done after the activity.
        </Typography>

        <Typography sx={{ mt: 2, ml: 7}}>I/We agree and shall abide by the set conditions.</Typography>


        <Grid container spacing={2} sx={{ mt: 2 }}>
          {[
            ["Signature over printed name of Requisitioner:", ""],
            ["College/ Division/ Office:", ""],
            ["Cellular Phone/ Telephone:", ""],
            ["Date Requested:", ""],
          ].map(([label, value], index) => (
            <Grid container item xs={12} alignItems="center" key={index}>
              <Grid item xs={4}> <Typography>{label}</Typography></Grid>
              <Grid item xs={8}>
                <TextField variant="standard" fullWidth InputProps={{ disableUnderline: true, style: { borderBottom: "1px solid black" },}} />
              </Grid>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 3 }}>
          {[
            ["Endorsed by:", "Dean/ Director/ Head of Office"],
            ["Recommended by:", "Head, General Services, URS Cainta"],
            ["In case of University-wide Activities/ Program:", ""], 
            ["Approved:", "Campus Director"],
            ["", "Director, General Services"],
          ].map(([label, position], index) => (
            <Grid container key={index} alignItems="center" sx={{ mt: 2 }}>
              <Grid item xs={4}>
                <Typography>{label}</Typography>
              </Grid>
              {index !== 2 && ( 
                <Grid item xs={8}>
                  <TextField variant="standard" fullWidth InputProps={{ disableUnderline: true, style: { borderBottom: "1px solid black" },}} />
                  <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>{position}</Typography>
                </Grid>
              )}
            </Grid>
          ))}
        </Box>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "flex-start", ml: 2, mb: 2 }} className="print-hide">
            <Button sx={{ backgroundColor: "#C41919", color: "white" }} onClick={handleCloseModal}>Close</Button>
            <Button sx={{ backgroundColor: "#1632A2", color: "white" }} onClick={handlePrint}>Print</Button>
        </DialogActions>
        </Dialog>
        </Container>
    );
}

export default PrintRoom;
