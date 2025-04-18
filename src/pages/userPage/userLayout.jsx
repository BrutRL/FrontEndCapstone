import * as React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import HelpCenterOutlinedIcon from '@mui/icons-material/HelpCenterOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import LoginIcon from '@mui/icons-material/Login';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import UserDashboard from './userDashboard';
import { useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: open ? 0 : `-${drawerWidth}px`,
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const UserLayout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [modalOpen, setModalOpen] = useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
     removeCookie('AUTH_TOKEN', { path: '/' }); 
     localStorage.clear();
     navigate('/login', { replace: true });
     toast.success('Logged out successfully.');
   };
 
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, link: 'dashboard' },
    { text: 'Rooms', icon: <MeetingRoomIcon />, link: 'room' },
    { text: 'Room Request', icon: <HelpCenterOutlinedIcon />, link: 'room_request' },
    { text: 'Access Code Requests', icon: <LockOpenIcon />, link: 'access_code' },
    { text: 'Schedule', icon: <EditCalendarIcon />, link: 'schedule' },
    { text: 'Profile', icon: <LocalLibraryIcon />, link: 'profile' },
    { text: 'Calendar', icon: <CalendarMonthIcon />, link: 'user_calendar' },
  ];
  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
    <CssBaseline />
    <AppBar position="fixed" open={open} sx={{ width: isSmallScreen ? '100%' : `calc(100% - ${open ? drawerWidth : 0}px)`, transition: 'width 0.3s ease' }}>
      <Toolbar sx={{ background: 'linear-gradient(to bottom, #373f88, #4f5891)' }}>
        <Grid container alignItems="center" justifyContent="space-between" wrap="nowrap">
          <Grid item>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, display: open && !isSmallScreen ? 'none' : 'block' }}
            >
              <MenuIcon />
            </IconButton>
          </Grid>
          <Grid item xs>
            <Typography variant="h6" noWrap component="div" sx={{ textAlign: 'left', fontSize: isSmallScreen ? '0.85rem' : '1.25rem' }}>
              University of Rizal System Cainta
            </Typography>
          </Grid>
          <Grid item sx={{ display: 'flex', alignItems: 'center', mr: isSmallScreen ? '10px' : '20px', gap: 2 }}>
            <Button variant="contained" sx={{ backgroundColor: 'rgb(2 49 138)', fontSize: isSmallScreen ? '0.65rem' : '1rem', padding: isSmallScreen ? '5px 10px' : '8px 16px' }} onClick={handleLogout}>
              Log Out
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(to bottom, #373f88, #4f5891)',
          color: 'white',
        },
      }}
      variant={isSmallScreen ? 'temporary' : 'persistent'}
      anchor="left"
      open={open}
      onClose={isSmallScreen ? handleDrawerClose : undefined}
    >
      <Toolbar>
        <IconButton
          onClick={handleDrawerClose}
          sx={{
            color: 'white',
            backgroundColor: 'rgb(2 49 138)',
            '&:hover': {
              backgroundColor: 'rgb(29 78 216)',
            },
          }}
        >
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item, index) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} to={item.link}>
              <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} sx={{ color: 'white' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
    <Box component="main" sx={{ flexGrow: 1, p: 3, transition: 'margin 0.3s ease', marginLeft: open && !isSmallScreen ? `${drawerWidth}px` : '0' }}>
      <Toolbar />
      <Outlet />
    </Box>
  </Box>
  );
};

export default UserLayout;